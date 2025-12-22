export interface WompiTransactionResponse {
    data: {
        id: string;
        created_at: string;
        amount_in_cents: number;
        reference: string;
        currency: string;
        payment_method_type: string;
        payment_method: {
            type: string;
            extra: {
                brand: string;
                last_four: string;
                [key: string]: any;
            };
            token: string;
        };
        status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';
        status_message?: string;
        [key: string]: any;
    };
    meta: any;
}

export interface CardTokenResponse {
    status: 'CREATED' | 'ERROR';
    data?: {
        id: string;
        created_at: string;
        brand: string;
        name: string;
        last_four: string;
        bin: string;
        exp_year: string;
        exp_month: string;
        card_holder: string;
        expires_at: string;
    };
    error?: {
        type: string;
        reason: string;
        messages: { [key: string]: string[] };
    };
}

export interface PaymentRequest {
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    payment_method: {
        type: "CARD";
        token: string; // The token created on the frontend
        installments: number; // Number of installments
    };
    reference: string; // Unique reference for the transaction
    session_id?: string; // Device session ID for anti-fraud
}

export interface PaymentStatus {
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'VOIDED';
    transactionId?: string;
    message?: string;
}
