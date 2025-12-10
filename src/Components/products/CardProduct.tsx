import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/helpers";
import { Button } from "@/Components/shared/Button";
import { Tag } from "../shared/Tag";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";

interface Props {
  img: string;
  name: string;
  price: number;
  slug: string;
  stock: string | null;
  tag?: "Nuevo" | "Promoción" | null;
}

export const CardProduct = ({ img, name, price, slug, stock, tag }: Props) => {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = stock === "Agotado";

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isOutOfStock) {
      return;
    }

    addItem({
      productId: slug,
      name,
      image: img,
      price,
      quantity: 1,
    });

    toast.success("Producto añadido al carrito", {
      position: "bottom-right",
    });
  };

  return (
    <div className="group relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 shadow-lg shadow-black/5">
      {/* Inner glow for glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none rounded-2xl" />

      {/* Etiquetas */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isOutOfStock && <Tag contentTag="Agotado" />}
        {!isOutOfStock && tag && <Tag contentTag={tag} />}
      </div>

      {/* Imagen con zoom effect */}
      <Link to={`/productos/${slug}`} className="block">
        <div className={`relative h-72 w-full overflow-hidden bg-white/5 flex items-center justify-center p-6 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}>
          <img
            src={img}
            alt={name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-3 bg-white/30 backdrop-blur-lg border-t border-white/20">
        <Link to={`/productos/${slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 min-h-[3.5rem] mt-1">
            {name}
          </h3>
        </Link>

        <p className="text-2xl font-black text-gray-900 tracking-tight">
          {formatPrice(price)}
        </p>

        {/* Botones */}
        <div className="flex gap-3 mt-2">
          <Button
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-sm
            ${isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-black cursor-pointer text-white hover:bg-primary hover:text-white hover:scale-110 active:scale-95 shadow-lg shadow-black/10"
              }`}
            disabled={isOutOfStock}
            onClick={handleAddClick}
            aria-label="Agregar al carrito"
            title={isOutOfStock ? "Agotado" : "Agregar al carrito"}
          >
            <FaShoppingCart className="text-xl" />
          </Button>

          <Link to={`/productos/${slug}`} className="flex-1">
            <Button
              className="w-full cursor-pointer text-black bg-white/80 backdrop-blur-sm border border-primary/50 rounded-full px-4 py-2
              hover:bg-primary hover:border-primary transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-md"
            >
              Ver más
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
