import React from "react";
import { Link } from "react-router-dom";
import type { VariantProduct } from "@/interfaces";
import { formatPrice } from "@/helpers";
import { Button } from "@/Components/shared/Button";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { Tag } from "../shared/Tag";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";

interface Props {
  img: string;
  name: string;
  price: number;
  slug: string;
  variants: VariantProduct[];
}

export const CardProduct = ({ img, name, price, slug, variants }: Props) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (selectedVariant && selectedVariant.stock > 0) {
      addItem({
        variantId: selectedVariant.id,
        productId: slug,
        name,
        image: img,
        price: selectedVariant.price,
        quantity: 1,
      });
      toast.success("Producto añadido al carrito", {
        position: "bottom-right",
      });
    } else {
      toast.error("Producto agotado", {
        position: "bottom-right",
      });
    }
  };

  const stock = selectedVariant?.stock || 0;

  const [lensPos, setLensPos] = React.useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({ x, y });
  };

  return (
    <div className="relative max-w-sm bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Imagen con efecto Lens */}
      <Link to={`/productos/${slug}`}>
        <div
          className="relative h-64 w-full overflow-hidden cursor-crosshair group"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowLens(true)}
          onMouseLeave={() => setShowLens(false)}
        >
          <img
            src={img}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          {showLens && (
            <div
              className="absolute w-32 h-32 rounded-full border-2 border-white shadow-lg pointer-events-none"
              style={{
                top: `${lensPos.y - 64}px`,
                left: `${lensPos.x - 64}px`,
                backgroundImage: `url(${img})`,
                backgroundSize: "200% 200%",
                backgroundPosition: `${lensPos.x / 2}px ${lensPos.y / 2}px`,
              }}
            />
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{formatPrice(price)}</p>

        {/* Botones */}
        <div className="flex gap-3 mt-5 ">
          <Link to={`/productos/${slug}`}>
            <div className="p-0.5 rounded-full bg-linear-to-r from-white via-black to-white hover:animate-gradient-x">
              <Button
                variant="default"
                size="md"
                effect="none"
                className="flex items-center justify-center bg-primary text-black rounded-full transition-all duration-300 ease-out hover:scale-105 hover:ring-2 ring-black bg-white active:scale-95 cursor-pointer"
              >
                <MdOutlineAddShoppingCart
                  className="
                text-xl text-black transition-transform duration-300
                group-hover:rotate-12
                hover:scale-125 hover:text-black"
                />
              </Button>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="md"
            effect="expandIcon"
            className="text-black border border-primary rounded-full ring-1 hover:ring-[1.5px]
            hover:shadow-md transition-all duration-300 ease-out
            hover:scale-105 active:scale-95"
          >
            Ver más
          </Button>
        </div>
      </div>

      {/* Stock */}
      <div className="absolute top-2 left-2">
        {stock === 0 && <Tag contentTag="Agotado" />}
      </div>
    </div>
  );
};
