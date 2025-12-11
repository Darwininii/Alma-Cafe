import { formatPrice } from "../../helpers";
import { useCartStore } from "../../store/cart.store";
import { RiMotorbikeFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { BadgeDollarSign, BadgeMinus, BadgePlus } from "lucide-react";
import { MdDeleteForever } from "react-icons/md";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-black">Tu Pedido</h2>
        <span className="text-sm font-semibold text-black/60">
          {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {/* Items List */}
      <ul className="space-y-4">
        {cartItems.map((item, index) => (
          <motion.li
            key={item.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-2 border-black/50 shadow-lg hover:shadow-xl hover:bg-white/50 transition-all duration-300"
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-700/30 via-transparent to-transparent pointer-events-none rounded-2xl" />

            <div className="relative space-y-3">
              <div className="flex items-center gap-4">
                {/* Image with quantity badge */}
                <div className="relative flex-shrink-0">
                  <div className="w-25 h-25 bg-white/60 rounded-2xl p-2 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-gradient-to-br from-black to-pink-700/80 text-white flex items-center justify-center text-xs font-black shadow-lg border-2 border-black"
                  >
                    {item.quantity}
                  </motion.span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black text-sm line-clamp-2 mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black/60 font-medium">
                      {formatPrice(item.price)} c/u
                    </span>
                    <span className="text-lg font-black text-black">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-white/40">
                <div className="flex items-center gap-3 bg-black/10 px-3 py-2 rounded-2xl border border-2 border-black/60">
                  <button
                    type="button"
                    onClick={() => handleDecrement(item.productId, item.quantity)}
                    disabled={item.quantity === 1}
                    className="cursor-pointer text-black hover:text-red-600/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Disminuir cantidad"
                  >
                    <BadgeMinus size={18} />
                  </button>
                  <span className="text-black text-sm font-bold min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleIncrement(item.productId, item.quantity)}
                    className="cursor-pointer text-black hover:text-green-100 transition-colors"
                    title="Aumentar cantidad"
                  >
                    <BadgePlus size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item.productId)}
                  className="cursor-pointer text-black hover:text-red-600/80 transition-colors p-2"
                  title="Eliminar producto"
                >
                  <MdDeleteForever size={24} />
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Summary Section */}
      <div className="space-y-4 pt-4 border-t-2 border-white/40">
        {/* Shipping */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-xl border border-2 border-green-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-600/80 rounded-lg">
              <RiMotorbikeFill className="text-black" size={20} />
            </div>
            <span className="text-sm font-bold text-black">Envío</span>
          </div>
          <span className="text-sm font-black text-black uppercase tracking-wide">
            ¡Gratis!
          </span>
        </div>

        {/* Total */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative bg-gradient-to-br from-black via-gray-900 p-6 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-pink-600/50 animate-pulse" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-1">
                Total a Pagar
              </p>
              <p className="text-4xl font-black text-white">
                {formatPrice(totalAmount)}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <BadgeDollarSign size={45} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
