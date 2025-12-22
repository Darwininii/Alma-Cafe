import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import { FormCheckout } from "../Components/checkout/FormCheckout";
import { useUser } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { useEffect } from "react";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";
import { TbShoppingCartSearch } from "react-icons/tb";
import { CustomTitle } from "../Components/shared/CustomTitle";
import { CustomButton } from "../Components/shared/CustomButton";
import { CustomBack } from "../Components/shared/CustomBack";
import { useGlobalStore } from "../store/global.store";
import { FaShoppingBag } from "react-icons/fa";
import { CustomBadge } from "../Components/shared/CustomBadge";
import { Sheet } from "../Components/shared/Sheet";

export const CheckoutPage = () => {
  const totalItems = useCartStore((state) => state.totalItemsInCart);
  const openSheet = useGlobalStore((state) => state.openSheet);
  const isSheetOpen = useGlobalStore((state) => state.isSheetOpen);
  const { isLoading } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  if (isLoading) return <Loader />;

  return (
    <div
      className="min-h-screen bg-linnear-to-br "
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Premium Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-[100px] backdrop-blur-xl flex items-center justify-between px-6 md:px-10 shadow-lg sticky top-0 z-50"
      >
        <CustomTitle asLink className="text-3xl md:text-4xl" />

        <CustomBack to="/productos" />
      </motion.header>

      <main className="w-full h-full relative">
        {totalItems === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-8 w-full px-6"
            style={{
              height: "calc(100vh - 100px)",
            }}
          >
            {/* Empty cart icon */}
            <div className="relative">
              <TbShoppingCartSearch size={120} className="text-zinc-400 dark:text-zinc-600" />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-zinc-800 dark:text-zinc-200">
                Tu Carrito Está Vacío
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
                ¡Agrega productos increíbles y comienza tu experiencia de compra!
              </p>
            </div>

            <CustomButton
              to="/productos"
              effect="shine"
              className="py-4 px-8 bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 rounded-full text-white dark:text-zinc-900 text-sm uppercase tracking-widest font-bold shadow-xl hover:shadow-2xl"
            >
              Empezar a Comprar
            </CustomButton>
          </motion.div>
        ) : (
          <>
            {/* Form Section - Now Full Width */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-10"
            >
              <FormCheckout />
            </motion.div>

            {/* Floating Button to Open Sheet */}
            <div className="fixed bottom-6 right-6 z-40">
              <CustomButton
                onClick={() => openSheet("checkout")}
                effect="shine"
                size="lg"
                className="bg-linner-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 font-black text-black/80 hover:text-black dark:text-white rounded-full shadow-2xl hover:shadow-zinc-900/50 dark:hover:shadow-zinc-100/50 px-5 py-3.5 border-none h-auto"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <FaShoppingBag size={25} />
                    <CustomBadge
                      count={totalItems}
                      className="absolute -top-2 -right-2 w-5 h-5 text-[10px]"
                    />
                  </div>

                </div>
              </CustomButton>
            </div>
          </>
        )}
      </main>

      {/* Sheet Component */}
      {isSheetOpen && <Sheet />}
    </div>
  );
};
