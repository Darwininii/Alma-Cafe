import React from "react";
import { Link } from "react-router-dom";
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
  stock: string | null; // <-- ahora se usa directo
}

export const CardProduct = ({ img, name, price, slug, stock }: Props) => {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = stock === "Agotado";

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isOutOfStock) {
      toast.error("Producto agotado", {
        position: "bottom-right",
      });
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

  // Lens effect
  const [lensPos, setLensPos] = React.useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLensPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="relative max-w-sm bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Etiqueta de Stock */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 z-20">
          <Tag contentTag="Agotado" />
        </div>
      )}

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
        <div className="flex gap-3 mt-5">
          <Button
            className={`flex items-center justify-center rounded-full transition-all duration-300 ease-out 
            px-4 py-2 cursor-pointer 
            ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary text-black hover:scale-105 hover:ring-2 ring-black active:scale-95"
            }`}
            disabled={isOutOfStock}
            onClick={handleAddClick}
          >
            <MdOutlineAddShoppingCart className="text-xl text-black" />
          </Button>

          <Link to={`/productos/${slug}`}>
            <Button
              className="text-black border border-primary rounded-full ring-1 hover:ring-[1.5px] px-4 py-2
              hover:shadow-md transition-all duration-300 ease-out hover:scale-105 active:scale-95"
            >
              Ver más
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
