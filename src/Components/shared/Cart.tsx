
import { RiShoppingBag3Fill } from "react-icons/ri";
import { MdDeleteForever, MdPayments } from "react-icons/md";
import { Link } from "react-router-dom";
import { CartItem } from "./CartItem";
import { useCartStore, useGlobalStore } from "@/store";
import { formatPrice } from "@/helpers";

export const Cart = () => {
  const closeSheet = useGlobalStore((state) => state.closeSheet);

  const cartItems = useCartStore((state) => state.items);
  const cleanCart = useCartStore((state) => state.cleanCart);
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);
  const totalAmount = useCartStore((state) => state.totalAmount);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-7 flex justify-between items-center border-b border-white/20">
        <span className="flex gap-3 items-center font-black text-black">
          <RiShoppingBag3Fill size={20} /> {totalItemsInCart} Artículos
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
          <div className="px-7 py-4 border-t border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-black">Total:</span>
              <span className="text-2xl font-black text-black">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* Botones Acción */}
          <div className="py-5 px-5">
            <Link
              to="/checkout"
              className="w-full bg-black font-black text-white py-3.5 hover:bg-gradient-to-r from-black/80 to-rose-600 rounded-full flex items-center justify-center gap-3 hover:shadow-black/40 transition-colors cursor-pointer"
            >
              <MdPayments size={24} />
              Comprar
            </Link>
            <button
              className="mt-3 w-full font-black text-black border border-black/70 rounded-full py-3 hover:bg-red-300/80 hover:text-red-800/80 hover:border-red-800/80 transition-colors cursor-pointer flex items-center justify-center gap-2"
              onClick={cleanCart}
            >
              <MdDeleteForever size={20} />
              Limpiar Carrito
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-7">
          <p className="text-sm font-black tracking-tight text-black">
            Su Carrito Está Vacío
          </p>
          <Link
            to="/productos"
            className="py-4 bg-black font-black rounded-full hover:bg-gradient-to-r from-black/80 to-rose-600 text-white px-7 text-xs uppercase tracking-widest transition-colors cursor-pointer"
            onClick={closeSheet}
          >
            Empieza a Comprar
          </Link>
        </div>
      )}
    </div>
  );
};
