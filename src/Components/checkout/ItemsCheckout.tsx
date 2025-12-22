import { formatPrice } from "../../helpers";
import { useCartStore } from "../../store/cart.store";
import { RiMotorbikeFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { BadgeDollarSign } from "lucide-react";
import { CustomPlusMinus } from "../shared/CustomPlusMinus";
import { CustomDeleteButton } from "../shared/CustomDeleteButton";
import { MdDeleteForever } from "react-icons/md";
import { CustomCard } from "../shared/CustomCard";
import { CustomBadge } from "../shared/CustomBadge";

export const ItemsCheckout = () => {
  const cartItems = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleIncrement = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  return (
    <div className="space-y-4">
      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4">
        {cartItems.map((item, index) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CustomCard
              variant="ghost"
              padding="sm"
              hoverEffect="glow"
              className="bg-black/10 dark:bg-zinc-900 backdrop-blur-md border border-zinc-700 hover:shadow-xl hover:border-zinc-600 transition-all duration-300 h-full"
            >
              {/* Inner accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 via-transparent to-transparent pointer-events-none rounded-2xl" />

              <div className="relative space-y-2 md:space-y-3">
                {/* Image with quantity badge */}
                <div className="relative">
                  <div className="w-full aspect-square bg-white/10 dark:bg-zinc-800 rounded-xl p-2 md:p-3 flex items-center justify-center border border-black/40 dark:border-zinc-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <CustomBadge
                    count={item.quantity}
                    className="absolute -right-1 -top-1 md:-right-2 md:-top-2 w-6 h-6 md:w-7 md:h-7"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-0.5 md:space-y-1">
                  <h3 className="font-bold text-white/90 dark:text-white text-xs md:text-sm line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] md:text-xs">
                    <span className="text-white/60 font-medium">
                      {formatPrice(item.price)} c/u
                    </span>
                    <span className="text-sm md:text-base font-black text-white/90 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/50 dark:border-zinc-700">
                  <CustomPlusMinus
                    value={item.quantity}
                    onDecrease={() => handleDecrement(item.productId, item.quantity)}
                    onIncrease={() => handleIncrement(item.productId, item.quantity)}
                    disableDecrease={item.quantity === 1}
                    className="flex-1 max-w-[120px] bg-black/50 dark:bg-zinc-800 border dark:border-zinc-700"
                  />

                  <CustomDeleteButton
                    onClick={() => handleRemove(item.productId)}
                    title="Eliminar producto"
                    centerIcon={MdDeleteForever}
                    iconSize={18}
                    className="shrink-0 w-9 h-9 md:w-10 md:h-10 dark:bg-red-900/50 border dark:border-red-700 dark:hover:bg-red-800"
                  />
                </div>
              </div>
            </CustomCard>
          </motion.div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-300 dark:border-zinc-700">
        {/* Shipping */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 dark:from-emerald-700 dark:via-emerald-800 dark:to-green-800 rounded-xl border-2 border-emerald-600 dark:border-emerald-700 shadow-md">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 dark:bg-emerald-900/50 rounded-lg">
              <RiMotorbikeFill className="text-white" size={20} />
            </div>
            <span className="text-sm font-bold text-white">Envío</span>
          </div>
          <span className="text-sm font-black text-white uppercase tracking-wide">
            ¡Gratis!
          </span>
        </div>

        {/* Total */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-black  p-6 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/30 via-primary/20 to-transparent dark:from-zinc-200/20 dark:via-primary/10 animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-30 uppercase tracking-wider mb-1">
                Total a Pagar
              </p>
              <p className="text-3xl md:text-4xl font-black text-white">
                {formatPrice(totalAmount)}
              </p>
            </div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 dark:bg-zinc-900/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <BadgeDollarSign size={40} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
