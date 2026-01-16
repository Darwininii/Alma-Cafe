import { supabase } from "../supabase/client";
import { type PaymentRequest, type WompiTransactionResponse } from "../interfaces/payment.interface";

export interface AtomicOrderRequest {
    customer_id?: string;
    address_id: string;
    items: { productId: string; quantity: number }[];
    payment:
    | {
        type: "CARD";
        token: string;
        installments: number;
        acceptance_token: string;
        email: string;
    }
    | {
        type: "NEQUI";
        phone_number: string;
        acceptance_token: string;
        email: string;
    }
    | {
        type: "PSE";
        financial_institution_code: string;
        user_type: "0" | "1";
        user_legal_id: string;
        user_legal_id_type: string;
        acceptance_token: string;
        email: string;
    }
    | {
        type: "BANCOLOMBIA_TRANSFER" | "BANCOLOMBIA_COLLECT" | "NEQUI_PUSH" | "DAVIPLATA" | "EFECTY"; // Async/Cash methods
        acceptance_token: string;
        email: string;
        payment_method_type?: string;
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

        // Return data directly. The component should check for 'data' or 'status'
        return { success: true, ...data };
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
