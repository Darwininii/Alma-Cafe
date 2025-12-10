import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import { FormCheckout } from "../Components/checkout/FormCheckout";
import { ItemsCheckout } from "../Components/checkout/ItemsCheckout";
import { useUser } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { useEffect } from "react";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";
import { TbShoppingCartSearch } from "react-icons/tb";

export const CheckoutPage = () => {
  const totalItems = useCartStore((state) => state.totalItemsInCart);

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
      className="min-h-screen bg-gradient-to-br "
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Premium Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-[100px] backdrop-blur-xl text-black flex items-center justify-center flex-col px-10 border-b-2 border-transparent shadow-lg sticky top-0 z-50"
      >
        <Link
          to="/"
          className="text-4xl font-bold self-center tracking-tighter transition-all md:text-5xl md:self-start hover:scale-105 duration-300"
        >
          <p className="bg-gradient-to-r from-black/80 via-black to-black/80 bg-clip-text text-transparent">
            Alma
            <span className="bg-gradient-to-r from-black/80 to-rose-600 bg-clip-text text-transparent">
              Café
            </span>
          </p>
        </Link>
      </motion.header>

      <main className="w-full h-full flex relative">
        {totalItems === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-8 w-full"
            style={{
              height: "calc(100vh - 100px)",
            }}
          >
            {/* Empty cart icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-32 h-32 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-black/40 shadow-2xl">
                <TbShoppingCartSearch size={60} className="text-black" />
              </div>
            </div>

            <div className="text-center space-y-3">
              <p className="text-2xl font-black text-black">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-black/80 font-medium">
                ¡Agrega productos para continuar con tu compra!
              </p>
            </div>

            <Link
              to="/productos"
              className="group relative py-4 px-8 bg-gradient-to-r from-black to-gray-800 rounded-full text-white text-sm uppercase tracking-widest font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Empezar a Comprar</span>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full md:w-[50%] p-6 md:p-10 overflow-y-auto"
              style={{
                maxHeight: "calc(100vh - 100px)",
              }}
            >
              <FormCheckout />
            </motion.div>

            {/* Items Summary Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br backdrop-blur-xl w-[50%] sticky top-[100px] right-0 p-6 md:p-10 hidden md:block border-l-2 border-white/60 shadow-2xl overflow-y-auto"
              style={{
                maxHeight: "calc(100vh - 100px)",
              }}
            >
              <ItemsCheckout />
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};
