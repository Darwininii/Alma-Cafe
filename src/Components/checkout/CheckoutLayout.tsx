import { useCheckoutStore } from "../../store/checkout.store";
import type { CheckoutStep } from "../../store/checkout.store";
import { useCartStore } from "../../store/cart.store"; // Import CartStore
import { CartStep } from "./steps/CartStep";
import { AuthStep } from "./steps/AuthStep";
import { ShippingStep } from "./steps/ShippingStep";
import { SummaryStep } from "./steps/SummaryStep";
import { PaymentStep } from "./steps/PaymentStep";
import { AnimatePresence, motion } from "framer-motion";
import { MdCheck } from "react-icons/md";
import { CustomBack } from "../shared/CustomBack";
import { useEffect } from "react";

const steps: { id: CheckoutStep; label: string }[] = [
    { id: 'CART', label: 'Carrito' },
    { id: 'AUTH', label: 'Datos' },
    { id: 'SHIPPING', label: 'Envío' },
    { id: 'SUMMARY', label: 'Resumen' },
    { id: 'PAYMENT', label: 'Pago' }
];

export const CheckoutLayout = () => {
    const { activeStep, payer, setActiveStep } = useCheckoutStore();
    const { items } = useCartStore();

    const currentStepIndex = steps.findIndex(s => s.id === activeStep);

    // Protection / Redirect Logic
    useEffect(() => {
        // 1. If Cart is empty, always go to Cart step (unless we are at Success/Status, but activeStep enum handles that)
        if (items.length === 0 && activeStep !== 'CART') {
            setActiveStep('CART');
            return;
        }

        // 2. If we are past AUTH but have no Payer info, go back to AUTH
        const isPastAuth = ['SHIPPING', 'SUMMARY', 'PAYMENT'].includes(activeStep);
        if (isPastAuth && !payer) {
            setActiveStep('AUTH');
            return;
        }

    }, [items.length, activeStep, payer, setActiveStep]);

    const renderStep = () => {
        switch (activeStep) {
            case 'CART': return <CartStep />;
            case 'AUTH': return <AuthStep />;
            case 'SHIPPING': return <ShippingStep />;
            case 'SUMMARY': return <SummaryStep />;
            case 'PAYMENT': return <PaymentStep />;
            default: return <CartStep />;
        }
    };

    return (
        <div className="min-h-screen  pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <CustomBack />
                </div>

                {/* Stepper Header */}
                <div className="mb-12">
                    <div className="flex justify-between items-center relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 z-0"></div>
                        <div
                            className="absolute left-0 top-1/2 h-1 bg-primary z-0 transition-all duration-500 ease-in-out"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isActive = index === currentStepIndex;

                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                    <div
                                        className={`
                                            w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-4 transition-all duration-300
                                            ${isActive
                                                ? 'bg-primary border-white dark:border-zinc-200 text-white shadow-lg shadow-primary/30 scale-110'
                                                : isCompleted
                                                    ? 'bg-primary border-primary text-white'
                                                    : 'bg-black dark:bg-zinc-700 border-white/80 dark:border-black/40 text-white/80'
                                            }
                                        `}
                                    >
                                        {isCompleted ? <MdCheck size={24} /> : index + 1}
                                    </div>
                                    <span className={`
                                        absolute top-full mt-2 text-xs md:text-sm font-medium whitespace-nowrap transition-colors duration-300
                                        ${isActive ? 'text-primary' : 'text-black/50 dark:text-white/50'}
                                    `}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
