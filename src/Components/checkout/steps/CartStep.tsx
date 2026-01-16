import { useCartStore } from "../../../store/cart.store";
import { useCheckoutStore } from "../../../store/checkout.store";
import { CustomButton } from "../../shared/CustomButton";
import { CartItem } from "../../shared/CartItem";
import { CustomCard } from "../../shared/CustomCard";
import { AnimatePresence, motion } from "framer-motion";
import { CheckoutNavigation } from "./CheckoutNavigation";

// Helper to format currency
const COP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

export const CartStep = () => {
    const { items, totalAmount } = useCartStore();
    const { setActiveStep } = useCheckoutStore();

    if (items.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-black/80 dark:text-white/80 font-bold text-lg mb-4">Tu carrito está vacío</p>
                <CustomButton
                    onClick={() => window.location.href = '/productos'}
                    variant="outline"
                    effect="shine"
                >
                    Ir a Productos
                </CustomButton>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">1. Revisa tu pedido</h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Items List */}
                <div className="md:col-span-8">
                    <ul className="space-y-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.productId}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    layout
                                >
                                    <CartItem item={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>

                {/* Right Column: Sticky Summary */}
                <div className="md:col-span-4">
                    <div className="sticky top-24 space-y-6">
                        <CustomCard className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Resumen de Compra</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                                    <span className="font-medium text-zinc-900 dark:text-white">{COP.format(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-600 dark:text-zinc-400">Envío</span>
                                    <span className="text-green-500 font-medium">Gratis</span>
                                </div>
                                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 flex justify-between items-center">
                                    <span className="text-lg font-bold text-zinc-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{COP.format(totalAmount)}</span>
                                </div>
                            </div>

                            <CheckoutNavigation
                                nextLabel="Continuar"
                                onNext={() => setActiveStep('AUTH')}
                            />
                        </CustomCard>
                    </div>
                </div>
            </div>
        </div>
    );
};
