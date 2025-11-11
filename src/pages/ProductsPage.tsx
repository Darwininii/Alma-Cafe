import { GridImages } from "@/Components/one-product/GridImages";
import { ProductDescription } from "@/Components/one-product/ProductDescription";
import { Loader } from "@/Components/shared/Loader";
import { Separator } from "@/Components/shared/Separator";
import { Tag } from "@/Components/shared/Tag";
import { formatPrice } from "@/helpers";
import { useProduct } from "@/hooks/products/useProduct";
import { type VariantProduct } from "@/interfaces";
import { useCartStore } from "@/store";
import { useCounterStore } from "@/store/counter.store";
import { LucideMinus, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbTruckDelivery } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";

export const ProductsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentSlug, setCurrentSlug] = useState(slug);

  const { product, isLoading, isError } = useProduct(currentSlug || "");

  const [selectedVariant, setSelectedVariant] = useState<VariantProduct | null>(
    null
  );

  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  //Obtener el Stock
  const isOutOfStock = selectedVariant?.stock === 0;

  // Función para añadir al carrito
  const addToCart = () => {
    if (selectedVariant) {
      addItem({
        variantId: selectedVariant.id,
        productId: product?.id || "",
        name: product?.name || "",
        image: product?.images[0] || "",
        price: selectedVariant.price,
        quantity: count,
      });
      toast.success("Producto añadido al carrito", {
        position: "bottom-right",
      });
    }
  };
  // Comprar Ahora
  const buyNow = () => {
    if (selectedVariant) {
      addItem({
        variantId: selectedVariant.id,
        productId: product?.id || "",
        name: product?.name || "",
        image: product?.images[0] || "",
        price: selectedVariant.price,
        quantity: count,
      });

      navigate("/checkout");
    }
  };

  // Resetear el slug actual cuando cambia en la URL
  useEffect(() => {
    setCurrentSlug(slug);

    // Reiniciar variante seleccionada
    setSelectedVariant(null);
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
        {/* Galería de Imagenes */}
        <GridImages images={product.images} />

        <div className="flex-1 spacey-5">
          <h1 className="text-3xl font-bold tracking-tigth">{product.name}</h1>

          <div className="flex gap-5 items-center">
            <span className="tracking-wide text-lg font-semibold">
              {formatPrice(selectedVariant?.price || product.variants[0].price)}
            </span>

            {/* Stock */}
            <div className="relative">
              {/* Agotado */}
              {isOutOfStock && <Tag contentTag="Agotado" />}
            </div>
          </div>

          <Separator />
          {/* Caracteristicas */}
          <ul className="space-y-2 ml-7 my-10">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="text-sm flex items-center gap-2 tracking-tight font-medium"
              >
                <span className="gb-black w-[5px] h-[5px] rounded-full " />
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

              {/* Botones de Acción */}
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

      {/* Descripción */}
      <ProductDescription content={product.description} />
    </>
  );
};
