import { MdDeleteForever, MdPayments } from "react-icons/md";
import { CartItem } from "./CartItem";
import { useCartStore, useGlobalStore } from "@/store";
import { formatPrice } from "@/helpers";
import { CustomButton } from "./CustomButton";
import { FaCartFlatbed } from "react-icons/fa6";
import { CustomBadge } from "./CustomBadge";

export const Cart = () => {
  const closeSheet = useGlobalStore((state) => state.closeSheet);

  const cartItems = useCartStore((state) => state.items);
  const cleanCart = useCartStore((state) => state.cleanCart);
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);
  const totalAmount = useCartStore((state) => state.totalAmount);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-7 flex justify-between items-center border-b border-white/20 dark:border-white/10">
        <span className="flex gap-3 items-center font-black text-black dark:text-white/70">
          <FaCartFlatbed size={24} />
          <CustomBadge
            count={totalItemsInCart}
            className="w-5 h-5 bg-black dark:bg-yellow-600 text-white dark:text-black font-bold"
          />
          {totalItemsInCart === 1 ? 'Artículo' : 'Artículos'}
        </span>
      </div>

      {/* Lista de productos Añadidos al Carrito */}
      {totalItemsInCart > 0 ? (
        <>
          <div className="p-7 overflow-auto flex-1">
            <ul className="space-y-9">
              {cartItems.map((item) => (
                <CartItem item={item} key={item.productId} />
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="px-7 py-4 border-t border-white/20 dark:border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-black dark:text-white/70">Total:</span>
              <span className="text-2xl font-black text-black dark:text-white/70">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* Botones Acción */}
          <div className="py-5 px-5">
            <CustomButton
              to="/checkout"
              className="w-full bg-black dark:bg-white/70 font-black text-white dark:text-black py-3.5 hover:bg-gradient-to-r from-black/80 dark:from-white/50 to-rose-600 rounded-full shadow-md hover:shadow-black/40 transition-all duration-300"
              size="lg"
              leftIcon={MdPayments}
              effect="shine"
              effectColor="black"
            >
              Comprar
            </CustomButton>
            <CustomButton
              className="mt-3 w-full font-black text-black dark:text-black border border-black/70 dark:border-white/70 rounded-full py-3 hover:bg-red-300/80 dark:hover:bg-red-900/40 hover:text-red-800/80 dark:hover:text-red-400 hover:border-red-800/80 dark:hover:border-red-600 transition-all duration-300"
              onClick={cleanCart}
              size="lg"
              leftIcon={MdDeleteForever}
              effect="shine"
            >
              Limpiar Carrito
            </CustomButton>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-7">
          <p className="text-sm font-bold tracking-tight text-black dark:text-white">
            Su Carrito Está Vacío
          </p>
          <CustomButton
            to="/productos"
            className="py-4 bg-black dark:bg-white/70 font-black rounded-full hover:bg-gradient-to-r from-black/80 to-rose-600 dark:hover:from-white/80 dark:hover:to-rose-600 text-white dark:text-black px-7 text-xs uppercase tracking-widest"
            onClick={closeSheet}
            effect="shine"
            effectColor="white"
          >
            Empieza a Comprar
          </CustomButton>
        </div>
      )}
    </div>
  );
};
