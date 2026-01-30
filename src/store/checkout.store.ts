import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CheckoutStep = 'CART' | 'AUTH' | 'SHIPPING' | 'SUMMARY' | 'PAYMENT' | 'STATUS';

export interface ShippingData {
    addressLine: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
    phone: string;
}

export interface CheckoutState {
    activeStep: CheckoutStep;
    shippingData: ShippingData | null;
    paymentMethod: 'CARD' | 'NEQUI' | 'PSE' | 'ASYNC' | null;
    transactionId: string | null;
    payer: { email: string; fullName: string; phone?: string } | null;

    // Actions
    setActiveStep: (step: CheckoutStep) => void;
    setShippingData: (data: ShippingData) => void;
    setPaymentMethod: (method: 'CARD' | 'NEQUI' | 'PSE' | 'ASYNC') => void;
    setTransactionId: (id: string | null) => void;
    setPayer: (payer: { email: string; fullName: string; phone?: string } | null) => void;
    resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set) => ({
            activeStep: 'CART',
            shippingData: null,
            paymentMethod: null,
            transactionId: null,
            payer: null,

            setActiveStep: (step) => set({ activeStep: step }),
            setShippingData: (data) => set({ shippingData: data }),
            setPaymentMethod: (method) => set({ paymentMethod: method }),
            setTransactionId: (id) => set({ transactionId: id }),
            setPayer: (payer) => set({ payer }),

            resetCheckout: () => set({
                activeStep: 'CART',
                shippingData: null,
                paymentMethod: null,
                transactionId: null,
                payer: null
            })
        }),
        {
            name: 'checkout-storage',
            partialize: (state) => ({
                shippingData: state.shippingData,
                payer: state.payer,
                activeStep: state.activeStep !== 'STATUS' ? state.activeStep : 'CART' // Don't persist STATUS step
            }),
        }
    )
);
