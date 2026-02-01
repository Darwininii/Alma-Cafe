import { useCheckoutStore } from "../../../store/checkout.store";
import { useCartStore } from "../../../store/cart.store";
import { CustomCard } from "../../shared/CustomCard";
import { CustomButton } from "../../shared/CustomButton";
import { CartItem } from "../../shared/CartItem";
import { MdEdit } from "react-icons/md";
import { InfoUserCheckout } from "../InfoUserCheckout"; // Import component
import { CheckoutNavigation } from "./CheckoutNavigation";
import { LuMapPinHouse } from "react-icons/lu";
import { CustomDivider } from "../../shared/CustomDivider";
import { useUser } from "@/hooks"; // Import useUser

// Helper to format currency
const COP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

export const SummaryStep = () => {
    const { setActiveStep, shippingData, payer } = useCheckoutStore();
    const { items, totalAmount } = useCartStore();
    const { session } = useUser(); // Get session

    if (!shippingData) {
        setActiveStep('SHIPPING'); // Fallback safety
        return null;
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">4. Resumen de Compra</h2>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Left Col: Details */}
                <div className="md:col-span-2 space-y-6">

                    {/* Payer Info */}
                    <InfoUserCheckout
                        fullName={payer?.fullName}
                        email={payer?.email}
                        phone={payer?.phone}
                        isGuest={!session}
                        onEdit={() => setActiveStep('AUTH')}
                        className="w-full"
                    />

                    {/* Shipping Info */}
                    <CustomCard className="p-6 border border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                                    <LuMapPinHouse size={20} />
                                    <span>Dirección de Envío</span>
                                </div>
                                <div className="font-medium text-lg leading-snug text-black/80 dark:text-white">
                                    {shippingData.addressLine}
                                </div>
                                <div className="text-black/80 dark:text-white/80 text-sm">
                                    {shippingData.state}, {shippingData.city} — {shippingData.country}
                                </div>
                            </div>
                            <CustomButton
                                variant="ghost"
                                effect="magnetic"
                                size="sm"
                                className="text-black dark:text-white hover:text-primary bg-transparent hover:bg-transparent"
                                onClick={() => setActiveStep('SHIPPING')}
                            >
                                <MdEdit size={20} />
                            </CustomButton>
                        </div>
                    </CustomCard>

                    {/* Items */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg px-2">Productos ({items.length})</h3>
                        {items.map((item, index) => (
                            <div key={`${item.productId}-${index}`} className="opacity-90 hover:opacity-100 transition-opacity">
                                <CartItem item={item} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Totals */}
                <div className="md:col-span-1 space-y-4">
                    <CustomCard className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 sticky top-4">
                        <h3 className="font-bold text-lg mb-4 text-center text-black/80 dark:text-white/80">Total a Pagar</h3>

                        <div className="space-y-3 text-sm font-semibold mb-6">
                            <div className="flex justify-between">
                                <span className="text-black/60 dark:text-white">Subtotal</span>
                                <span className="text-black/60 dark:text-white">{COP.format(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-black/60 dark:text-white/60">Envío</span>
                                <span className="text-green-500 font-bold">Gratis</span>
                            </div>
                        </div>

                        <CustomDivider className="mb-4 bg-black/40 dark:bg-white/40" />

                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-lg text-black/80 dark:text-white/80">Total</span>
                            <span className="font-black text-xl text-black/80 dark:text-white/80">{COP.format(totalAmount)}</span>
                        </div>

                        <CheckoutNavigation
                            onBack={() => setActiveStep('SHIPPING')}
                            onNext={() => setActiveStep('PAYMENT')}
                            nextLabel="Ir a Pagar"
                            orientation="vertical"
                        />
                    </CustomCard>
                </div>
            </div>
        </div>
    );
};
