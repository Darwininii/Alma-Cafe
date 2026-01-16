import { formatPrice } from "@/helpers";
import { MdCheckCircle } from "react-icons/md";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface TransactionReceiptProps {
    data: {
        reference: string;
        date: string | Date;
        transactionId: string;
        paymentMethod: string;
        email: string;
        total: number;
        status?: string;
    };
}

export const TransactionReceipt = ({ data }: TransactionReceiptProps) => {
    // Ensure we only render on client
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div id="print-receipt-portal" className="hidden print:block fixed inset-0 z-50 bg-white w-full h-full">
            <style>
                {`
                    @media print {
                        body > *:not(#print-receipt-portal) { display: none !important; }
                        #print-receipt-portal {
                            display: block !important;
                            position: absolute !important;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: auto;
                            z-index: 9999;
                        }
                        html, body {
                            height: auto !important;
                            overflow: visible !important;
                        }
                    }
                `}
            </style>
            <div className="w-full max-w-2xl mx-auto border-2 border-black p-8 text-black bg-white print:mt-12">
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-black pb-6">
                    <MdCheckCircle size={64} className="mx-auto text-black mb-4" />
                    <h1 className="text-3xl font-bold mb-2 text-black">COMPROBANTE DE PAGO</h1>
                    <p className="text-lg text-gray-600">Transacción Aprobada</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8 text-black">
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">REFERENCIA DE PAGO</p>
                        <p className="font-bold text-xl">{data.reference}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">FECHA</p>
                        <p className="text-lg font-medium">
                            {new Date(data.date).toLocaleDateString()} <br />
                            {new Date(data.date).toLocaleTimeString()}
                        </p>
                    </div>

                    <div className="col-span-2 border-t border-dashed border-gray-400 my-2"></div>

                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">ID Transacción</p>
                        <p className="font-mono font-medium text-lg">{data.transactionId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Método</p>
                        <p className="font-medium text-lg">{data.paymentMethod}</p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-1">Email Cliente</p>
                        <p className="font-medium text-lg">{data.email}</p>
                    </div>
                </div>

                {/* Footer Total */}
                <div className="border-t-2 border-black pt-6 mt-6 flex justify-between items-center text-black">
                    <span className="text-xl font-bold text-black uppercase">Total Pagado</span>
                    <span className="text-3xl font-black text-black">
                        {formatPrice(Number(data.total) || 0)}
                    </span>
                </div>

                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>Gracias por tu compra en Alma Café.</p>
                    <p>www.almacafe.com</p>
                </div>
            </div>
        </div>,
        document.body
    );
};
