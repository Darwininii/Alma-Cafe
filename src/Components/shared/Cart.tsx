import { ShoppingBagIcon } from "lucide-react";
import { RiSecurePaymentLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { CartItem } from "./CartItem";
import { useCartStore, useGlobalStore } from "@/store";

export const Cart = () => {
  const closeSheet = useGlobalStore((state) => state.closeSheet);

  const cartItems = useCartStore((state) => state.items);
  const cleanCart = useCartStore((state) => state.cleanCart);
  const totalItemsInCart = useCartStore((state) => state.totalItemsInCart);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-7 flex justify-between items-center border-b border-slate-200">
        <span className="flex gap-3 items-center font-semibold">
          <ShoppingBagIcon size={20} /> {totalItemsInCart} articculos
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

          {/* Botones Acción */}
          <div className="mt-4 py-7">
            <Link
              to="/checkout"
              className="w-full bg-black text-white py-3.5 rounded-full flex items-center justify-center gap-3"
            >
              <RiSecurePaymentLine size={24} />
              Continuar con la Compra
            </Link>
            <button
              className="mt-3 w-full text-black border border-black rounded-full py-3"
              onClick={cleanCart}
            >
              Limpiar Carrito
            </button>
          </div>
        </>
      ) : (
        <div className="flex clex-col items-center justify-center h-full gap-7">
          <p className="text-sm font-medium tracking-tight">
            Su Carro Está Vacío
          </p>
          <Link
            to="/productos"
            className="py-4 bg-black rounded-full text-white px-7 text-xs uppercase tracking-widest font-semibold"
            onClick={closeSheet}
          >
            Empieza a Comprar
          </Link>
        </div>
      )}
    </div>
  );
};
