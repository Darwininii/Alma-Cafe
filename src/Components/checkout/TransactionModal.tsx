import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdError, MdPrint, MdPhoneAndroid, MdAccountBalance } from 'react-icons/md';
import { CustomButton } from '../shared/CustomButton';
import { CustomClose } from '../shared/CustomClose';
import { CustomPrint } from '../shared/CustomPrint';
import { TransactionReceipt } from './TransactionReceipt';
import { Loader } from '../shared/Loader';
import { useCheckoutStore } from '../../store/checkout.store';

// Helper to format currency
const formatCurrency = (amount: number, currency: string = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(amount);
};

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: string | null;
    onFinish: () => void; // Called when user clicks "Finalizar" on success
}

interface WompiTransactionData {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';
    reference: string;
    amount_in_cents: number;
    currency: string;
    payment_method_type: string;
    payment_method: {
        type: string;
        phone_number?: string;
        extra?: {
            async_payment_url?: string;
            ticket_id?: string;
        };
    };
    customer_email?: string;
    created_at: string;
}

export const TransactionModal = ({ isOpen, onClose, transactionId, onFinish }: TransactionModalProps) => {
    const { payer } = useCheckoutStore();
    const [status, setStatus] = useState<'LOADING' | 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR'>('LOADING');
    const [data, setData] = useState<WompiTransactionData | null>(null);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initial Fetch & Polling Logic
    useEffect(() => {
        if (!isOpen || !transactionId) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            return;
        }

        const fetchStatus = async () => {
            try {
                const pubKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
                const isTest = pubKey?.includes("pub_test_");
                const baseUrl = isTest ? "https://sandbox.wompi.co/v1" : "https://production.wompi.co/v1";

                const res = await fetch(`${baseUrl}/transactions/${transactionId}`);
                const json = await res.json();

                if (json.data) {
                    setData(json.data);
                    const currentStatus = json.data.status;

                    // Update local status map
                    setStatus(currentStatus);

                    // Stop polling if final state
                    if (['APPROVED', 'DECLINED', 'ERROR', 'VOIDED'].includes(currentStatus)) {
                        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                    }
                }
            } catch (error) {
                console.error("Error polling transaction:", error);
            }
        };

        // Fetch immediately
        fetchStatus();

        // Start polling every 3 seconds
        pollIntervalRef.current = setInterval(fetchStatus, 3000);

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [isOpen, transactionId]);


    const handlePrint = () => {
        window.print();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:bg-white">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col border border-zinc-200 dark:border-zinc-800 print:shadow-none print:border-none print:w-full print:max-w-none"
                >
                    {/* Header: Hidden in print unless needed, but usually we want a clean sheet */}
                    <div className="flex justify-end p-4 print:hidden shrink-0">
                        <CustomClose onClick={() => status === 'APPROVED' ? onFinish() : onClose()} />
                    </div>

                    <div className="px-6 pb-8 pt-2 text-center overflow-y-auto print:pt-8 print:px-8 custom-scrollbar">

                        {/* STATES */}

                        {/* 1. LOADING / INITIAL */}
                        {(status === 'LOADING') && (
                            <div className="flex flex-col items-center py-8">
                                <Loader size={48} color="#4F46E5" />
                                <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium">Verificando estado de la transacción...</p>
                            </div>
                        )}

                        {/* 2. PENDING (Instructions) */}
                        {status === 'PENDING' && data && (
                            <div className="flex flex-col items-center animate-fadeIn">
                                {data.payment_method.type === 'NEQUI' && (
                                    <>
                                        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                            <MdPhoneAndroid size={40} className="text-pink-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Confirma en tu celular</h2>
                                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                            Hemos enviado una notificación a tu Nequi. <br />
                                            Por favor ve a la app y <span className="font-bold text-zinc-800 dark:text-zinc-200">acepta la transacción</span>.
                                        </p>
                                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 w-full mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-zinc-500">Monto</span>
                                                <span className="font-bold text-zinc-900 dark:text-white text-lg">
                                                    {formatCurrency(data.amount_in_cents / 100, data.currency)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">Referencia</span>
                                                <span className="font-medium text-black dark:text-zinc-200 text-sm overflow-hidden text-ellipsis max-w-[150px]">{data.reference}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                            Esperando confirmación...
                                        </div>
                                    </>
                                )}

                                {data.payment_method.type === 'PSE' && (
                                    <>
                                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                            <MdAccountBalance size={40} className="text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Finaliza en tu banco</h2>
                                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                            Te estamos redirigiendo a tu sucursal bancaria PSE.
                                            Si la ventana no se abrió, usa el botón abajo.
                                        </p>
                                        {data.payment_method.extra?.async_payment_url && (
                                            <a
                                                href={data.payment_method.extra.async_payment_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors inline-block"
                                            >
                                                Ir a mi Banco
                                            </a>
                                        )}
                                        <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
                                            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" />
                                            Detectaremos tu pago automáticamente aquí...
                                        </div>
                                    </>
                                )}

                                { /* General Pending / Async default */}
                                {!['NEQUI', 'PSE'].includes(data.payment_method.type) && (
                                    <>
                                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                            <MdAccountBalance size={40} className="text-yellow-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Pago Pendiente</h2>
                                        <p className="text-zinc-600 dark:text-zinc-400 mb-6 px-4">
                                            Tu pago está siendo procesado o requiere acción adicional (Efectivo/Corresponsal).
                                            Revisa tu correo para más detalles.
                                        </p>
                                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 w-full mb-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-zinc-500">Referencia Wompi</span>
                                                <span className="font-mono text-black dark:text-zinc-200 text-sm">{data.id}</span>
                                            </div>
                                        </div>
                                        <CustomButton effect="ghost" onClick={onFinish} variant="primary" className="w-full">
                                            Entendido, Finalizar
                                        </CustomButton>
                                    </>
                                )}
                            </div>
                        )}

                        {/* 3. APPROVED (Receipt) */}
                        {status === 'APPROVED' && data && (
                            <div className="flex flex-col items-center animate-fadeIn print:block print:w-full">
                                <div className="print:hidden">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                        <MdCheckCircle size={48} className="text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">¡Transacción Aprobada!</h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 mb-8">El pago ha sido procesado exitosamente.</p>
                                </div>

                                {/* Printable Receipt Component (Hidden on Screen, Visible on Print) */}
                                <TransactionReceipt
                                    data={{
                                        reference: data.reference,
                                        date: data.created_at,
                                        transactionId: data.id,
                                        paymentMethod: `${data.payment_method.type} ${data.payment_method.phone_number ? `(${data.payment_method.phone_number})` : ''}`,
                                        email: data.customer_email || payer?.email || 'No registrado',
                                        total: data.amount_in_cents / 100,
                                        status: 'APROBADO'
                                    }}
                                />

                                {/* Actions */}
                                <div className="flex gap-3 w-full print:hidden">
                                    <CustomPrint
                                        effect="shine"
                                        effectColor="green"
                                        className="flex-1"
                                        label="Imprimir"
                                    />
                                    <CustomButton onClick={onFinish} variant="primary" className="flex-1">
                                        Finalizar
                                    </CustomButton>
                                </div>
                            </div>
                        )}

                        {/* 4. ERROR / DECLINED */}
                        {(status === 'DECLINED' || status === 'ERROR' || status === 'VOIDED') && (
                            <div className="flex flex-col items-center animate-fadeIn">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <MdError size={48} className="text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Transacción Rechazada</h2>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-center">
                                    Lo sentimos, el pago no pudo ser procesado. <br />
                                    {data?.status === 'DECLINED' ? 'Fue rechazado por la entidad financiera.' : 'Ocurrió un error técnico.'}
                                </p>
                                <div className="flex gap-3 w-full">
                                    <CustomButton
                                        onClick={onClose}
                                        effect="none"
                                        className="w-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300"
                                    >
                                        Volver e intentar
                                    </CustomButton>
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
