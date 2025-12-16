import { Link, useNavigate, useParams } from "react-router-dom";
import { CustomTitle } from "../Components/shared/CustomTitle";
import { useOrder, useUser } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { formatPrice } from "../helpers";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";
import { BadgeCheck, ShoppingBag } from "lucide-react";
import { TiChevronRight } from "react-icons/ti";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { IoCopyOutline, IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";

export const GraciasPage = () => {
    const { id } = useParams<{ id: string }>();
    const [isHoveringCopy, setIsHoveringCopy] = useState(false);

    const { data, isLoading, isError } = useOrder(Number(id));
    const { isLoading: isLoadingSession } = useUser();

    const navigate = useNavigate();

    const handleCopyBankInfo = () => {
        const bankInfo = `Banco: BANCO PICHINCHA\nTipo: Corriente\nCuenta: 1234567890\nRUC: 123456789000`;
        navigator.clipboard.writeText(bankInfo);
        toast.success("Copiado", {
            position: "bottom-right",
            duration: 2000,
        });
    };

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_OUT" || !session) {
                navigate("/login");
            }
        });
    }, [navigate]);

    if (isError)
        return (
            <div className="h-screen flex items-center justify-center text-red-500 font-bold dark:bg-black dark:text-red-400">
                Error al cargar la orden
            </div>
        );

    if (isLoading || !data || isLoadingSession) return <Loader />;

    return (
        <div className="min-h-screen text-black dark:text-white transition-colors duration-300 overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative container mx-auto px-4 py-8 lg:py-12 flex flex-col items-center max-w-4xl">
                {/* Header Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <CustomTitle asLink className="text-3xl" />
                </motion.div>

                {/* Main Success Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
                >
                    {/* Status Header */}
                    <div className="bg-black/5 dark:bg-white/5 p-8 text-center border-b border-black/5 dark:border-white/10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.2,
                            }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4"
                        >
                            <BadgeCheck size={40} strokeWidth={2.5} />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            ¡Gracias, {data.customer.full_name.split(" ")[0]}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Tu pedido ha sido confirmado exitosamente.
                        </p>
                    </div>

                    <div className="p-6 md:p-10 grid gap-10 md:grid-cols-2">
                        {/* Left Column: Bank Info & Instructions */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <span className="w-1 h-6 bg-rose-600 rounded-full" />
                                    Instrucciones de Pago
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Para completar tu compra, por favor realiza la transferencia a
                                    la siguiente cuenta. Tu pedido será procesado una vez
                                    confirmado el pago.
                                </p>

                                <div
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-stone-800 dark:to-stone-900 rounded-2xl p-5 border border-black/5 dark:border-white/5 relative group cursor-pointer hover:border-rose-500/30 transition-colors"
                                    onClick={handleCopyBankInfo}
                                    onMouseEnter={() => setIsHoveringCopy(true)}
                                    onMouseLeave={() => setIsHoveringCopy(false)}
                                >
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Banco
                                            </span>
                                            <span className="font-semibold">BANCO PICHINCHA</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Tipo
                                            </span>
                                            <span className="font-semibold">Corriente</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Cuenta
                                            </span>
                                            <span className="font-semibold font-mono tracking-wider">
                                                1234567890
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                RUC
                                            </span>
                                            <span className="font-semibold font-mono">
                                                123456789000
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute top-1 right-1 group-hover:opacity-100 transition-opacity">
                                        {isHoveringCopy ? (
                                            <IoCopy size={20} className="text-rose-600" />
                                        ) : (
                                            <IoCopyOutline size={20} className="text-yellow-500" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <span className="w-1 h-6 bg-rose-600 rounded-full" />
                                    Detalles de Envío
                                </h3>
                                <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                                    <p className="font-medium text-black dark:text-white">
                                        {data.address.addressLine}
                                    </p>
                                    <p>
                                        {data.address.city}, {data.address.state}
                                    </p>
                                    <p>
                                        {data.address.country}
                                        {data.address.postalCode
                                            ? ` - ${data.address.postalCode}`
                                            : ""}
                                    </p>
                                    <p className="mt-2 text-xs uppercase tracking-wider text-gray-400">
                                        Método: Estandar
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="bg-gray-50/50 dark:bg-white/5 rounded-2xl p-6 border border-black/5 dark:border-white/5 h-fit">
                            <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
                                Resumen del Pedido
                                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-full">
                                    #{id}
                                </span>
                            </h3>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {data.orderItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-lg p-2 flex items-center justify-center border border-black/5 dark:border-white/5 shrink-0">
                                            <img
                                                src={item.productImage ? item.productImage[0] : ""}
                                                alt={item.productName}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">
                                                {item.productName}
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.quantity} x {formatPrice(item.price)}
                                                </p>
                                                <p className="font-medium text-sm">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Subtotal
                                    </span>
                                    <span>{formatPrice(data.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-black dark:text-white pt-2">
                                    <span>Total a Pagar</span>
                                    <span className="text-xl">
                                        {formatPrice(data.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 dark:bg-stone-900/50 p-6 md:p-8 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                            ¿Dudas? Contáctanos a{" "}
                            <a
                                href="mailto:ventas@almaccafe.com"
                                className="text-rose-600 hover:underline"
                            >
                                ventas@almaccafe.com
                            </a>
                        </p>

                        <Link
                            to="/productos"
                            className="group relative flex items-center gap-2 bg-black dark:bg-white/80 text-white dark:text-black px-8 py-3 rounded-full font-black text-sm tracking-wide hover:shadow-lg hover:shadow-rose-500/80 transition-all duration-300 active:scale-95"
                        >
                            <ShoppingBag size={18} className="group-hover:hidden" />
                            <RiShoppingBag3Fill size={18} className="hidden group-hover:block" />
                            <span>SEGUIR COMPRANDO</span>
                            <TiChevronRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
