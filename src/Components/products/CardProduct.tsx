import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/helpers";
import { CustomButton } from "@/Components/shared/CustomButton";
import { CustomCard } from "@/Components/shared/CustomCard";
import { Tag } from "../shared/Tag";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";
import { FaShoppingCart, FaEye } from "react-icons/fa";

interface Props {
  id: string;
  img: string;
  name: string;
  price: number;
  slug: string;
  stock: string | null;
  tag?: "Nuevo" | "Promoción" | null;
}

export const CardProduct = ({ id, img, name, price, slug, stock, tag }: Props) => {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = stock === "Agotado";

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isOutOfStock) {
      return;
    }

    addItem({
      productId: id,
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
    <CustomCard
      variant="glass"
      padding="none"
      hoverEffect="lift"
      className="group relative h-full flex flex-col justify-between overflow-visible transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 border-white/20 dark:border-white/10 dark:bg-zinc-900/60"
    >
      {/* Background Decor (Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Etiquetas */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isOutOfStock && <Tag contentTag="Agotado" />}
        {!isOutOfStock && tag && <Tag contentTag={tag} />}
      </div>

      {/* Imagen Section */}
      <Link to={`/productos/${slug}`} className="block relative pt-6 px-6 pb-2 flex-grow">
        <div className={`relative h-64 w-full flex items-center justify-center ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}>
          <img
            src={img}
            alt={name}
            className="max-h-full w-auto object-contain drop-shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 z-10"
          />
        </div>
      </Link>

      {/* Contenido Info */}
      <div className="p-6 relative z-20 bg-gradient-to-t from-white/80 via-white/40 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent rounded-b-2xl backdrop-blur-[2px]">
        <Link to={`/productos/${slug}`} className="block group/title">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight line-clamp-2 min-h-[3rem] tracking-tight group-hover/title:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="mt-4 flex items-end justify-between items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Precio</span>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              {formatPrice(price)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Details Button (Icon only on mobile, text on desktop usually, but let's go icon mostly for card compaction or cleaner look) */}
            <Link to={`/productos/${slug}`}>
              <CustomButton
                size="icon"
                effect="shine"
                className="rounded-full bg-black/10 dark:bg-white/50 border border-black/10 dark:border-white/10 hover:bg-black/90 hover:text-white dark:hover:bg-white/70 dark:text-black dark:hover:text-black text-black"
                title="Ver detalles"
              >
                <FaEye size={18} />
              </CustomButton>
            </Link>

            {/* Add to Cart Button */}
            <CustomButton
              size="icon"
              effect="magnetic"
              className={`rounded-full shadow-lg ${isOutOfStock
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white border-none"
                }`}
              disabled={isOutOfStock}
              onClick={handleAddClick}
              title={isOutOfStock ? "Agotado" : "Agregar al carrito"}
            >
              <FaShoppingCart size={18} />
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomCard>
  );
};
