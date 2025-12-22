import { supabase } from "../supabase/client";
import { type PaymentRequest, type WompiTransactionResponse } from "../interfaces/payment.interface";

export interface AtomicOrderRequest {
    customer_id?: string; // Optional if we want backend to infer from Auth
    address_id: string;
    items: { productId: string; quantity: number }[];
    payment: {
        token: string;
        installments: number;
        acceptance_token: string;
        email: string;
    };
    sessionId?: string;
    // Extra fields just in case
    customer_data?: {
        full_name: string;
        phone: string;
    }
}

export const PaymentService = {
    /**
     * Creates an order AND processes payment atomically via Edge Function.
     */
    createAtomicOrder: async (payload: AtomicOrderRequest) => {
        console.log("Invoking create-wompi-checkout with:", payload);

        const { data, error } = await supabase.functions.invoke('create-wompi-checkout', {
            body: payload,
        });

        if (error) {
            console.error("Supabase Atomic Function Error:", error);
            throw new Error(error.message || "Error al conectar con el servidor de pagos");
        }

        if (data.error) {
            console.error("Atomic Transaction Error:", data);
            throw new Error(data.error.details?.[0] || data.error || "El pago fue rechazado o falló");
        }

        return data; // { success: true, order: ..., wompiStatus: ... }
    },

    /**
     * Legacy method (kept for reference or double-check usage)
     */
    processPayment: async (paymentData: PaymentRequest): Promise<WompiTransactionResponse> => {
        console.log("Invoking wompi-transaction with:", paymentData);

        const { data, error } = await supabase.functions.invoke('wompi-transaction', {
            body: paymentData,
        });

        if (error) {
            console.error("Supabase Function Error:", error);
            throw new Error(error.message || "Error connecting to payment server");
        }

        if (data.error) {
            console.error("Payment Transaction Error:", data);
            throw new Error(data.error.reason || "Payment was declined or failed");
        }

        return data as WompiTransactionResponse;
    }
};
