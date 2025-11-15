import { GridImages } from "@/Components/one-product/GridImages";
import { ProductDescription } from "@/Components/one-product/ProductDescription";
import { Loader } from "@/Components/shared/Loader";
import { Separator } from "@/Components/shared/Separator";
import { Tag } from "@/Components/shared/Tag";
import { formatPrice } from "@/helpers";
import { useProduct } from "@/hooks";
import { useCartStore, useCounterStore } from "@/store";
import { LucideMinus, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbTruckDelivery } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";

export const ProductsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentSlug, setCurrentSlug] = useState(slug);

  const { product, isLoading, isError } = useProduct(currentSlug || "");

  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  // Stock: convertir string → number
  const stockNumber = Number(product?.stock || 0);
  const isOutOfStock = stockNumber <= 0;

  // Añadir al carrito
  const addToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: count,
    });

    toast.success("Producto añadido al carrito", {
      position: "bottom-right",
    });
  };

  // Comprar ahora
  const buyNow = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: count,
    });

    navigate("/checkout");
  };

  // Reset slug cuando cambia
  useEffect(() => {
    setCurrentSlug(slug);
  }, [slug]);

  if (isLoading) return <Loader />;

  if (!product || isError)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>Producto no Encontrado</p>
      </div>
    );

  return (
    <>
      <div className="h-fit flex flex-col md:flex-row gap-16 mt-8">
        {/* Galería de Imágenes */}
        <GridImages images={product.images} />

        <div className="flex-1 spacey-5">
          <h1 className="text-3xl font-bold tracking-tigth">{product.name}</h1>

          <div className="flex gap-5 items-center">
            <span className="tracking-wide text-lg font-semibold">
              {formatPrice(product.price)}
            </span>

            {/* Stock */}
            <div className="relative">
              {isOutOfStock && <Tag contentTag="Agotado" />}
            </div>
          </div>

          <Separator />

          {/* Características */}
          <ul className="space-y-2 ml-7 my-10">
            {product.features.map((feature: string) => (
              <li
                key={feature}
                className="text-sm flex items-center gap-2 tracking-tight font-medium"
              >
                <span className="gb-black w-[5px] h-[5px] rounded-full" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Opciones de Compra */}
          {isOutOfStock ? (
            <button className="bg-slate-400 uppercase font-semibold tracking-wides text-xs py-4 rounded-full transition-all duration-300 hover:bg-slate-600">
              Agotado
            </button>
          ) : (
            <>
              {/* Contador */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Cantidad</p>
                <div className="flex gap-8 px-5 border border-slate-200 w-fit rounded-full">
                  <button onClick={decrement} disabled={count === 1}>
                    <LucideMinus size={15} />
                  </button>
                  <span className="text-slate-500 text-sm">{count}</span>
                  <button onClick={increment}>
                    <LucideMinus size={15} />
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3">
                <button
                  className="bg-slate-400 uppercase font-semibold tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:bg-slate-600"
                  onClick={addToCart}
                >
                  Agregar al Carrito
                </button>

                <button
                  className="bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full"
                  onClick={buyNow}
                >
                  Comprar Ahora
                </button>
              </div>
            </>
          )}

          <div className="flex pt-2">
            <div className="flex flex-col gap-1 flex-1 items-center">
              <TbTruckDelivery size={35} />
              <p className="text-xs font-semibold">Envío Bajo Costo</p>
            </div>

            <Link
              to="#"
              className="flex flex-col gap-1 flex-1 items-center justify-center"
            >
              <MessagesSquare size={35} />
              <p className="flex flex-col items-center text-xs">
                <span className="font-semibold">¿Necesitas Ayuda?</span>
                Contáctanos Aquí
              </p>
            </Link>
          </div>
        </div>
      </div>

      <ProductDescription content={product.description} />
    </>
  );
};
