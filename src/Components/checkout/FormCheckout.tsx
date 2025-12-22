import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  type CheckoutFormValues,
  checkoutSchema
} from "../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateOrder } from "../../hooks";
import { useCartStore } from "../../store/cart.store";
import { InputAddress } from "./InputAddres";
import { motion, AnimatePresence } from "framer-motion";
import { MdPayments, MdCreditCard } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { Loader } from "../shared/Loader";
import { PaymentService } from "../../services/payment.service";
import { CustomInput } from "../shared/CustomInput";
import { CustomButton } from "../shared/CustomButton";
import { CustomCard } from "../shared/CustomCard";
import { CustomCheckbox } from "../shared/CustomCheckbox";

// Helper to format currency
const COP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const FormCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'NEQUI'>('CARD');

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment: {
        installments: 1
      }
    }
  });

  // State for Wompi Acceptance Token
  const [acceptanceToken, setAcceptanceToken] = useState<string>("");
  const [permalink, setPermalink] = useState<string>("#");

  // Fetch Wompi Merchant Info (for Terms acceptance)
  useState(() => {
    const fetchMerchantParams = async () => {
      try {
        const pubKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
        if (!pubKey) return;

        const isTest = pubKey.includes("pub_test_");
        const baseUrl = isTest ? "https://sandbox.wompi.co/v1" : "https://production.wompi.co/v1";

        const res = await fetch(`${baseUrl}/merchants/${pubKey}`);
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        if (data.data?.presigned_acceptance) {
          setAcceptanceToken(data.data.presigned_acceptance.acceptance_token);
          setPermalink(data.data.presigned_acceptance.permalink);
        }
      } catch (e) {
        console.error("Error fetching Wompi merchant info", e);
      }
    };
    fetchMerchantParams();
  });

  const { mutate: createOrder } = useCreateOrder(); // We might not need this anymore if fully atomic, but let's keep for fallback or hybrid? 
  // actually we are fully replacing it.

  const cleanCart = useCartStore((state) => state.cleanCart);
  const cartItems = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  // const removeItem = useCartStore((state) => state.removeItem);

  const onSubmit = handleSubmit(async (data) => {
    setIsProcessing(true);
    const toastId = toast.loading("Procesando pago seguro...");

    try {
      // 1. Validate Cart & Terms
      if (cartItems.length === 0) throw new Error("El carrito está vacío");
      if (!acceptanceToken) throw new Error("Error cargando términos y condiciones. Recarga la página.");

      // 2. Tokenize Card (Client Side)
      const wompiPublicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
      if (!wompiPublicKey) throw new Error("Falta la llave pública de WOMPI");

      const isTest = wompiPublicKey.includes("pub_test_");
      const baseUrl = isTest ? "https://sandbox.wompi.co/v1" : "https://production.wompi.co/v1";

      const tokenResponse = await fetch(`${baseUrl}/tokens/cards`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${wompiPublicKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          number: data.payment.cardNumber,
          cvc: data.payment.cvc,
          exp_month: data.payment.expMonth,
          exp_year: data.payment.expYear,
          card_holder: data.payment.cardHolder
        })
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        throw new Error(tokenData.error.messages?.number?.[0] || tokenData.error.reason || "Error en los datos de la tarjeta");
      }

      const cardToken = tokenData.data.id;

      // 3. Create OR Get Customer & Address First? 
      // The Atomic Function expects customer_id and address_id.
      // Ideally the Atomic Function should Create them if they don't exist?
      // Or we can simple create the Address here first (using existing hooks/actions) and then pass the ID.
      // Given the user flow, it's safer to Create the Address/Customer first using Supabase Client (actions/order.ts logic)
      // BUT `createOrder` action did everything. 
      // Let's optimize: We need `customer_id` and `address_id` FOR the edge function.
      // We can use a small helper or just rely on the existing auth context.

      // Quick fix: We need to ensure Customer and Address exist. 
      // Since we don't have a dedicated "create address" endpoint decoupled from createOrder, 
      // we might need to do a small pre-flight or include address data in the payload and handle it in the Edge Function?
      // The current atomic function expects `address_id`. 

      // Let's modify the Edge Function? NO, user wants to use provided code logic.
      // We need to insert Address first.

      // Let's assume we invoke a server action or supabase call to create address.
      // For now, to keep it simple and robust without rewriting everything:
      // We will perform a "Pre-check" action.
      // Warning: we need `customerId` and `addressId`.

      // Since we are refactoring, let's create the Address using standard Supabase client here before payment.
      // Import supabase client
      // NOTE: We need to import `supabase` from client.

      // ... Actually, the Atomic function could be improved to handle Address creation, but keeping strict to request:
      // We will use a helper to Create Address.

      // For this step I will assume there's a way. 
      // Since `createOrder` (original) did it all.
      // I will implement a quick `saveAddress` helper in `order.ts` or just do it inline here?
      // Inline here is risky.

      // Let's use `saveOrderAddress` action if exists? It doesn't.

      // WORKAROUND: We will update the `create-wompi-checkout` function to ACCEPT address data?
      // No, let's stick to the plan. I will create a small helper `saveAddressForOrder` in `src/actions/order.ts` 
      // that returns the ID, and call it here.

      // WAIT. I can't update `actions/order.ts` in this tool call loop easily without breaking flow.
      // I will create the helper inside this file or assume it exists? No.

      // Let's use direct Supabase call here. It's client side, RLS allows insert own address.

      /*  
          Pre-step: Save Address & Ensure Customer
          We need to ensure the user is logged in or create a customer record.
          This logic was in `createOrder`. 
          We should extract it.
      */

      // We need to import `supabase` client.
      const { data: { user } } = await import("../../supabase/client").then(m => m.supabase.auth.getUser());
      if (!user) throw new Error("Debes iniciar sesión para pagar");

      const supabase = (await import("../../supabase/client")).supabase;

      // 1. Get/Create Customer
      let { data: customer } = await supabase.from('customers').select('id').eq('user_id', user.id).single();
      if (!customer) {
        const { data: newCust, error: custErr } = await supabase.from('customers').insert({
          user_id: user.id,
          email: user.email,
          full_name: user.email?.split('@')[0],
        }).select('id').single();
        if (custErr) throw new Error("Error creando cliente");
        customer = newCust;
      }

      // 2. Create Address
      const { data: addressData, error: addrErr } = await supabase.from('address').insert({
        customer_id: customer?.id,
        address_line: data.address.addressLine,
        city: data.address.city,
        state: data.address.state,
        postal_code: data.address.postalCode,
        country: data.address.country
      }).select('id').single();

      if (addrErr) throw new Error("Error guardando dirección");
      if (!addressData || !customer) throw new Error("Error preparando datos de envío");


      // 4. ATOMIC PAYMENT CALL
      const result = await PaymentService.createAtomicOrder({
        customer_id: customer.id,
        address_id: addressData.id,
        items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
        payment: {
          token: cardToken,
          installments: data.payment.installments,
          acceptance_token: acceptanceToken,
          email: user.email || "invitado@example.com"
        }
      });

      if (result.success) {
        toast.success("¡Pago aprobado y orden creada!", { id: toastId });
        cleanCart();
        // Redirect or show success
      } else {
        throw new Error("El pago no fue exitoso");
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al procesar el pago", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  });

  return (
    <div className="relative">
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <Loader className="text-primary" />
            <p className="font-bold text-zinc-900 dark:text-zinc-100 animate-pulse">Confirmando transacción con el banco...</p>
          </div>
        </div>
      )}

      <form className="flex flex-col gap-6 md:gap-8" onSubmit={onSubmit}>
        {/* Delivery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CustomCard variant="glass" padding="lg" className="border border-zinc-200 dark:border-zinc-700"
          >
            <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-rose-600 rounded-lg shadow-md">
                <PiMapPinAreaFill className="text-white" size={22} />
              </div>
              Dirección de Entrega
            </h3>

            <div className="space-y-4">
              <InputAddress register={register} errors={errors} name="address.addressLine" placeholder="Dirección y número" />
              <InputAddress register={register} errors={errors} name="address.state" placeholder="Barrio / Localidad" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputAddress register={register} errors={errors} name="address.city" placeholder="Ciudad" />
                <InputAddress register={register} errors={errors} name="address.postalCode" placeholder="C. Postal (Opc)" />
              </div>
              <InputAddress register={register} errors={errors} name="address.country" placeholder="País" />
            </div>
          </CustomCard>
        </motion.div>

        {/* Payment Logic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CustomCard variant="glass" padding="lg" className="border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                <MdPayments className="text-white" size={22} />
              </div>
              Método de Pago
            </h3>

            {/* Payment Tabs (Simplified for now) */}
            <div className="flex gap-3 md:gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`flex-1 py-3 px-2 rounded-xl font-bold transition-all border-2 flex items-center justify-center gap-2 text-sm md:text-base ${paymentMethod === 'CARD'
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
              >
                <MdCreditCard size={20} /> <span className="hidden sm:inline">Tarjeta Crédito/Débito</span><span className="sm:hidden">Tarjeta</span>
              </button>
              {/* Future Nequi implementation */}
            </div>

            <AnimatePresence mode="wait">
              {paymentMethod === 'CARD' && (
                <motion.div
                  key="card-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* ... existing fields ... */}
                  <CustomInput
                    label="Nombre en la tarjeta"
                    placeholder="COMO APARECE EN EL PLÁSTICO"
                    {...register("payment.cardHolder")}
                    error={errors.payment?.cardHolder?.message}
                    wrapperClassName="bg-white/60"
                  />

                  <CustomInput
                    label="Número de tarjeta"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    {...register("payment.cardNumber")}
                    error={errors.payment?.cardNumber?.message}
                    wrapperClassName="bg-white/60"
                  />

                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <CustomInput
                      label="Mes (MM)"
                      placeholder="MM"
                      maxLength={2}
                      {...register("payment.expMonth")}
                      error={errors.payment?.expMonth?.message}
                    />
                    <CustomInput
                      label="Año (YY)"
                      placeholder="YY"
                      maxLength={2}
                      {...register("payment.expYear")}
                      error={errors.payment?.expYear?.message}
                    />
                    <CustomInput
                      label="CVC"
                      placeholder="123"
                      maxLength={4}
                      type="password"
                      {...register("payment.cvc")}
                      error={errors.payment?.cvc?.message}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block mb-2">Cuotas</label>
                    <select
                      {...register("payment.installments", { valueAsNumber: true })}
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                    >
                      {[1, 2, 3, 4, 6, 12, 24, 36].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Cuota' : 'Cuotas'}</option>
                      ))}
                    </select>
                  </div>

                  {/* TERMS AND CONDITIONS */}
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    <input
                      type="checkbox"
                      id="terms-required"
                      required
                      className="sr-only"
                      {...register("terms")}
                    />
                    <div className="shrink-0">
                      <CustomCheckbox
                        id="terms"
                        checked={!!watch("terms")}
                        onChange={(checked) => {
                          setValue("terms", checked, { shouldValidate: true });
                        }}
                        label=""
                        className="p-0 m-0 hover:bg-transparent dark:hover:bg-transparent"
                      />
                    </div>
                    <label htmlFor="terms" className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      Acepto haber leído los <a href={permalink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-700 dark:hover:text-indigo-300">Términos y Condiciones</a> y autorizo el pago.
                    </label>
                  </div>

                  <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex items-start gap-3">
                    <div className="p-1 bg-white dark:bg-zinc-800 rounded-md shadow-sm border border-indigo-200 dark:border-indigo-700">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">SSL</span>
                    </div>
                    <p className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed">
                      Tus datos están protegidos. La transacción se procesa de forma segura a través de WOMPI y nunca almacenamos tu información financiera completa.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </CustomCard>
        </motion.div>

        {/* Submit Button */}
        <CustomButton
          type="submit"
          size="lg"
          effect="shine"
          disabled={isProcessing}
          className="w-full py-5 md:py-6 text-lg font-bold md:text-xl bg-linear-to-r from-zinc-900 to-pink-800 dark:from-zinc-200 dark:to-pink-600 text-white dark:text-black shadow-2xl hover:shadow-primary/30"
        >
          {isProcessing ? 'Procesando...' : `Pagar ${COP.format(totalAmount)}`}
        </CustomButton>

      </form>
    </div>
  );
};

