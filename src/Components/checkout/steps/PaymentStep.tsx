import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCheckoutStore } from "../../../store/checkout.store";
import { useCartStore } from "../../../store/cart.store";
import { PaymentService } from "../../../services/payment.service";
import { CustomInput } from "../../shared/CustomInput";
import { useNavigate } from "react-router-dom";
import { checkoutSchema } from "../../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutNavigation } from "./CheckoutNavigation";
import { MdCreditCard } from "react-icons/md";
import { CustomCard } from "../../shared/CustomCard";
import { TransactionModal } from "../TransactionModal";
import { CustomButton } from "../../shared/CustomButton";
import { TbSquareLetterNFilled } from "react-icons/tb";
import { CustomDivider } from "../../shared/CustomDivider";

const COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export const PaymentStep = () => {
    const { setActiveStep, shippingData, payer, resetCheckout } = useCheckoutStore();
    const { items, totalAmount, cleanCart } = useCartStore();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'NEQUI' | 'PSE' | 'ASYNC'>('CARD');
    const [financialInstitutions] = useState<{ code: string; name: string }[]>([]);

    // Wompi Data
    const [acceptanceToken, setAcceptanceToken] = useState<string>("");

    // Modal State
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Focus Refs
    const yearRef = useRef<HTMLInputElement>(null);
    const cvcRef = useRef<HTMLInputElement>(null);


    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            payment: { type: "CARD", installments: 1 },
            address: shippingData || {}
        }
    });

    // Note: User data is now handled via 'payer' in store, no need to init fields here.

    // Update payment type in form when state changes
    useEffect(() => {
        if (paymentMethod === 'CARD') setValue('payment.type', 'CARD');
        if (paymentMethod === 'NEQUI') setValue('payment.type', 'NEQUI');
        if (paymentMethod === 'PSE') setValue('payment.type', 'PSE');
        if (paymentMethod === 'ASYNC') setValue('payment.type', 'EFECTY');
    }, [paymentMethod, setValue]);

    // Fetch Wompi Data
    useEffect(() => {
        const fetchWompi = async () => {
            const pubKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
            if (!pubKey) return;
            const isTest = pubKey.includes("pub_test_");
            const baseUrl = isTest ? "https://sandbox.wompi.co/v1" : "https://production.wompi.co/v1";

            try {
                // Merchant
                const res = await fetch(`${baseUrl}/merchants/${pubKey}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.data?.presigned_acceptance) {
                        setAcceptanceToken(data.data.presigned_acceptance.acceptance_token);
                    }
                }
                // PSE
                // PSE - Temporarily Disabled
                /*
                const pseRes = await fetch(`${baseUrl}/pse/financial_institutions`, { headers: { Authorization: `Bearer ${pubKey}` } });
                if (pseRes.ok) {
                    const pseData = await pseRes.json();
                    setFinancialInstitutions(pseData.data || []);
                }
                */
            } catch (e) {
                console.error("Wompi Error", e);
            }
        };
        fetchWompi();
    }, []);

    const onSubmit = async (data: any) => {
        setIsProcessing(true);
        const toastId = toast.loading("Iniciando pago...");

        try {
            if (!payer) throw new Error("Faltan datos del pagador. Vuelve al paso de datos.");

            // 1. User & Customer
            const supabase = (await import("../../../supabase/client")).supabase;
            const { data: { user } } = await supabase.auth.getUser();

            // Priority: Form Email -> User Email -> Guest
            const userEmail = payer.email;
            const userId = user?.id;

            // Get or Create Customer
            // Get or Create Customer (Securely via RPC)
            const { data: customerId, error: custError } = await supabase.rpc('get_or_create_customer', {
                p_email: userEmail,
                p_full_name: payer.fullName,
                p_user_id: userId || undefined,
                p_phone: payer.phone || undefined
            });

            if (custError) {
                console.error("Error identifying customer:", custError);
                throw new Error("Error al identificar al cliente. Por favor contacta soporte.");
            }

            if (!customerId) throw new Error("No se pudo obtener el ID del cliente.");


            // 2. Address (Save shipping data Securely via RPC)
            const { data: addressId, error: addrErr } = await supabase.rpc('create_checkout_address' as any, {
                p_customer_id: customerId,
                p_address_line: shippingData?.addressLine,
                p_city: shippingData?.city,
                p_state: shippingData?.state,
                p_country: shippingData?.country || 'Colombia',
                p_postal_code: shippingData?.postalCode || null
            });

            if (addrErr) {
                console.error("Address RPC Error Data:", addrErr);
                throw new Error("Error guardando dirección: " + addrErr.message);
            }

            if (!addressId) throw new Error("No se pudo obtener el ID de la dirección created.");

            // 3. Prepare Payload
            // Clean payment payload (Wompi expects email and acceptance_token here too for some endpoints, but mainly in transaction)
            let paymentPayload: any = { email: userEmail, acceptance_token: acceptanceToken };
            const pubKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;

            if (paymentMethod === 'CARD') {
                // Tokenize
                const isTest = pubKey.includes("pub_test_");
                const baseUrl = isTest ? "https://sandbox.wompi.co/v1" : "https://production.wompi.co/v1";

                const tokenRes = await fetch(`${baseUrl}/tokens/cards`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${pubKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        number: data.payment.cardNumber.replace(/\s/g, ''),
                        cvc: data.payment.cvc,
                        exp_month: data.payment.expMonth,
                        exp_year: data.payment.expYear,
                        card_holder: data.payment.cardHolder
                    })
                });
                const tokenData = await tokenRes.json();
                if (tokenData.error) throw new Error("Error en tarjeta: " + (tokenData.error.reason || "Revisa los datos"));

                paymentPayload = { ...paymentPayload, type: "CARD", token: tokenData.data.id, installments: data.payment.installments };
            } else if (paymentMethod === 'NEQUI') {
                paymentPayload = { ...paymentPayload, type: "NEQUI", phone_number: data.payment.phoneNumber };
            } else if (paymentMethod === 'PSE') {
                paymentPayload = { ...paymentPayload, type: "PSE", ...data.payment };
            } else {
                paymentPayload = { ...paymentPayload, type: data.payment.type };
            }

            console.log("Sending Payload:", paymentPayload);

            // 4. Call Service
            const result = await PaymentService.createAtomicOrder({
                customer_id: customerId,
                address_id: addressId,
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                payment: paymentPayload,
                customer_data: {
                    full_name: payer.fullName,
                    phone: shippingData?.phone || "3000000000" // Fallback or required
                }
            });

            if (result.success) {
                toast.success("Orden Creada", { id: toastId });
                // Handle Success Logic -> Open Modal
                const txId = result.order?.transaction_id || result.data?.id;
                if (txId) {
                    setTransactionId(txId);
                    if (result.order?.id) setOrderId(result.order.id);
                    setIsModalOpen(true);
                    // Cart clean moved to finishProcess
                } else {
                    // Fallback
                    cleanCart();
                    resetCheckout();
                    navigate('/account/pedidos');
                }
            } else {
                throw new Error("Error al crear la orden");
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error desconocido", { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const finishProcess = () => {
        setIsModalOpen(false);
        cleanCart();
        resetCheckout();
        navigate('/account/pedidos');
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">5. Método de Pago</h2>

            <div className="flex justify-center gap-4 mb-10">
                {[
                    { id: 'CARD', label: 'Tarjeta', icon: MdCreditCard },
                    { id: 'NEQUI', label: 'Nequi', icon: TbSquareLetterNFilled }
                ].map(m => (
                    <CustomButton
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        variant="ghost"
                        effect="shine"
                        className={`border-2 h-auto p-3 rounded-xl transition-all
                            ${paymentMethod === m.id
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900 text-zinc-500 hover:border-zinc-300'}
                        `}
                    >
                        <span className="flex flex-col items-center justify-center gap-2 w-full">
                            {m.icon && <m.icon size={24} />}
                            <span className="text-xs font-bold">{m.label}</span>
                        </span>
                    </CustomButton>
                ))}
            </div>

            <CustomCard className="max-w-lg mx-auto p-6 border border-black/10 dark:border-zinc-700">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {paymentMethod === 'CARD' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">

                            <div className="grid gap-4">
                                <CustomInput
                                    label="Número de Tarjeta"
                                    placeholder="0000 0000 0000 0000"
                                    {...register('payment.cardNumber', {
                                        onChange: (e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                                            e.target.value = formatted.substring(0, 19);
                                        }
                                    })}
                                    error={(errors.payment as any)?.cardNumber?.message as string}
                                    maxLength={19}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <CustomInput
                                        label="Titular"
                                        placeholder="Como aparece en la tarjeta"
                                        {...register('payment.cardHolder')}
                                        error={(errors.payment as any)?.cardHolder?.message as string}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <CustomInput
                                            label="Mes (MM)"
                                            placeholder="MM"
                                            {...register('payment.expMonth', {
                                                onChange: (e) => {
                                                    if (e.target.value.length === 2) yearRef.current?.focus();
                                                }
                                            })}
                                            error={(errors.payment as any)?.expMonth?.message as string}
                                            maxLength={2}
                                        />
                                        {(() => {
                                            const { ref: yearHookRef, onChange: yearOnChange, ...yearRest } = register('payment.expYear');
                                            return (
                                                <CustomInput
                                                    label="Año (YY)"
                                                    placeholder="YY"
                                                    {...yearRest}
                                                    ref={(e) => {
                                                        yearHookRef(e);
                                                        yearRef.current = e;
                                                    }}
                                                    onChange={(e) => {
                                                        yearOnChange(e);
                                                        if (e.target.value.length === 2) cvcRef.current?.focus();
                                                    }}
                                                    error={(errors.payment as any)?.expYear?.message as string}
                                                    maxLength={2}
                                                />
                                            );
                                        })()}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {(() => {
                                        const { ref: cvcHookRef, ...cvcRest } = register('payment.cvc');
                                        return (
                                            <CustomInput
                                                label="CVC"
                                                placeholder="123"
                                                type="password"
                                                {...cvcRest}
                                                ref={(e) => {
                                                    cvcHookRef(e);
                                                    cvcRef.current = e;
                                                }}
                                                error={(errors.payment as any)?.cvc?.message as string}
                                                maxLength={4}
                                            />
                                        );
                                    })()}

                                    <CustomInput
                                        label="Cuotas"
                                        type="number"
                                        placeholder="1"
                                        {...register('payment.installments', { valueAsNumber: true })}
                                        error={(errors.payment as any)?.installments?.message as string}
                                        min={1}
                                        max={36}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'NEQUI' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <CustomInput
                                label="Celular Nequi"
                                placeholder="300 000 0000"
                                {...register('payment.phoneNumber')}
                                error={(errors.payment as any)?.phoneNumber?.message as string}
                            />
                        </div>
                    )}

                    {paymentMethod === 'PSE' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label htmlFor="bank-select" className="block text-sm font-medium mb-1">Banco</label>
                                <select
                                    id="bank-select"
                                    {...register('payment.financialInstitutionCode')}
                                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                >
                                    <option value="">Selecciona tu banco</option>
                                    {financialInstitutions.map((bank, index) => (
                                        <option key={`${bank.code}-${index}`} value={bank.code}>{bank.name}</option>
                                    ))}
                                </select>
                                {(errors.payment as any)?.financialInstitutionCode && <p className="text-red-500 text-xs mt-1">{(errors.payment as any).financialInstitutionCode.message as string}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="user-type-select" className="block text-sm font-medium mb-1">Tipo de Persona</label>
                                    <select
                                        id="user-type-select"
                                        {...register('payment.userType')}
                                        className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                    >
                                        <option value="0">Natural</option>
                                        <option value="1">Jurídica</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="doc-type-select" className="block text-sm font-medium mb-1">Tipo de Documento</label>
                                    <select
                                        id="doc-type-select"
                                        {...register('payment.userLegalIdType')}
                                        className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent"
                                    >
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        <option value="NIT">NIT</option>
                                        <option value="PP">Pasaporte</option>
                                    </select>
                                </div>
                            </div>

                            <CustomInput
                                label="Número de Documento"
                                placeholder="123456789"
                                {...register('payment.userLegalId')}
                                error={(errors.payment as any)?.userLegalId?.message as string}
                            />
                        </div>
                    )}

                    <CustomDivider className="my-6" />

                    <CheckoutNavigation
                        onBack={() => setActiveStep('SUMMARY')}
                        nextLabel={`Pagar ${COP.format(totalAmount)}`}
                        isProcessing={isProcessing}
                    />
                </form>
            </CustomCard>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setTransactionId(null);
                }}
                transactionId={transactionId}
                orderId={orderId}
                onFinish={finishProcess}
            />
        </div>
    );
};
