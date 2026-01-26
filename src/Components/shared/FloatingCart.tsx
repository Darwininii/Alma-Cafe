import { useGlobalStore } from "@/store/global.store";
import { useCartStore } from "@/store";
import { RiShoppingBag3Line, RiShoppingBag3Fill } from "react-icons/ri";
import { CustomButton } from "./CustomButton";
import { CustomBadge } from "./CustomBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const FloatingCart = () => {
  const openSheet = useGlobalStore((state) => state.openSheet);
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);
  
  // State to trigger "bump" animation when items change
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (totalItemsInCart > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItemsInCart]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ 
             scale: isBumping ? 1.1 : 1, 
             opacity: 1,
             y: 0
           }}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative">
            <CustomButton
              onClick={() => openSheet("cart")}
              size="icon"
              effect="shine"
              effectColor="bg-white/20"
              className="w-14 h-14 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/20 dark:shadow-white/10 hover:shadow-xl hover:shadow-black/30 dark:hover:shadow-white/20 border border-white/10 dark:border-black/5 overflow-hidden"
              aria-label="Abrir carrito"
            >
              <AnimatePresence mode="wait">
                {totalItemsInCart > 0 ? (
                  <motion.div
                    key="filled"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RiShoppingBag3Fill size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="outline"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RiShoppingBag3Line size={24} />
                  </motion.div>
                 )}
              </AnimatePresence>
            </CustomButton>

            <AnimatePresence>
              {totalItemsInCart > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 pointer-events-none"
                >
                  <CustomBadge
                    count={totalItemsInCart}
                    className="w-6 h-6 bg-rose-600 text-white border-2 border-white dark:border-black text-xs font-bold shadow-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};