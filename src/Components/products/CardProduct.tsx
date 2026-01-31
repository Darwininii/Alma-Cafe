import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/helpers";
import { CustomButton } from "@/Components/shared/CustomButton";
import { CustomCard } from "@/Components/shared/CustomCard";
import { Tag } from "../shared/Tag";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";
import { FaPlus, FaShoppingCart } from "react-icons/fa";

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
    e.stopPropagation(); // Prevent navigation when clicking add

    if (isOutOfStock) return;

    addItem({
      productId: id,
      name,
      image: img,
      price,
      quantity: 1,
    });

    toast.success("Producto añadido", {
      icon: <FaShoppingCart />,
    });
  };

  return (
    <article itemScope itemType="https://schema.org/Product" className="h-full">
      <CustomCard
        variant="glass"
        padding="none"
        hoverEffect="lift"
        className="group relative h-full flex flex-col overflow-hidden transition-all duration-500 rounded-3xl border-black/10 border-2 dark:border-white/5 dark:bg-zinc-900"
      >
        {/* Enlace principal */}
        <Link to={`/productos/${slug}`} className="flex-1 flex flex-col relative">
          
          {/* Etiquetas (SEO excluded visual only) */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {isOutOfStock ? (
               <Tag contentTag="Agotado" />
            ) : (
               tag && <Tag contentTag={tag} />
            )}
          </div>

          {/* Imagen Container - Aspecto cuadrado visual */}
          <div className="relative aspect-square w-full p-6 flex items-center justify-center bg-white/20 dark:bg-black/20 overflow-hidden">
             
             {/* Background glow effect on hover */}
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

             <img
               src={img}
               alt={name}
               itemProp="image"
               className={`w-full h-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 z-10 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
             />

             {/* FAB - Floating Action Button */}
             <div className="absolute bottom-3 right-3 z-30">
                <CustomButton
                  size="icon"
                  onClick={handleAddClick}
                  disabled={isOutOfStock}
                  className={`rounded-full w-10 h-10 shadow-lg shadow-black/10 dark:shadow-black/30 transition-all duration-300 ${
                    isOutOfStock 
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                      : "bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white hover:scale-110 active:scale-95"
                  }`}
                  role="button"
                  aria-label={isOutOfStock ? "Producto agotado" : "Añadir al carrito"}
                  effect="none" // Custom scale effect used above
                >
                  {isOutOfStock ? <FaShoppingCart size={14} /> : <FaPlus size={16} />}
                </CustomButton>
             </div>
          </div>

          {/* Info Section */}
          <div className="p-4 flex flex-col justify-between grow bg-white dark:bg-transparent">
             <div className="mb-1">
                <h3 
                  itemProp="name" 
                  className="text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-primary transition-colors"
                >
                  {name}
                </h3>
             </div>
             
             <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="flex items-center justify-between mt-2">
                <meta itemProp="availability" content={isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"} />
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Precio</span>
                <span itemProp="price" className="text-lg font-black text-zinc-900 dark:text-white">
                   {formatPrice(price)}
                </span>
                <meta itemProp="priceCurrency" content="COP" />
             </div>
          </div>

        </Link>
      </CustomCard>
    </article>
  );
};
