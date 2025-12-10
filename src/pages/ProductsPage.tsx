import { GridImages } from "@/Components/one-product/GridImages";
import { ProductDescription } from "@/Components/one-product/ProductDescription";
import { Loader } from "@/Components/shared/Loader";
import { Separator } from "@/Components/shared/Separator";
import { Tag } from "@/Components/shared/Tag";
import { formatPrice } from "@/helpers";
import { useProduct } from "@/hooks";
import { useCartStore, useCounterStore } from "@/store";
import { motion } from "framer-motion";
import { BadgeMinus, BadgePlus, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { RiMotorbikeFill } from "react-icons/ri";
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

  // Stock: verificar si está agotado
  const isOutOfStock = product?.stock === "Agotado";

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
      <div className="flex font-black justify-center items-center h-[80vh]">
        <p>Producto no Encontrado</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <div className="h-fit flex flex-col md:flex-row gap-8 md:gap-16 mt-8">
        {/* Galería de Imágenes */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <GridImages
            images={product.images}
          />
        </motion.div>

        {/* Detalles del Producto */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1 space-y-6 bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-xl"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-black drop-shadow-md">{product.name}</h1>

            <div className="flex gap-4 items-center">
              <span className="text-3xl font-bold bg-clip-text text-black/80 bg-gradient-to-r from-orange-200 to-amber-100">
                {formatPrice(product.price)}
              </span>

              {/* Tags */}
              <div className="relative flex gap-2">
                {isOutOfStock && <Tag contentTag="Agotado" />}
                {!isOutOfStock && product.tag && <Tag contentTag={product.tag as "Nuevo" | "Promoción"} />}
              </div>
            </div>

          </div>

          <Separator className="border-white/20" />

          {/* Características */}
          <ul className="space-y-3 pl-4">
            {product.features.map((feature: string) => (
              <motion.li
                key={feature}
                className="text-sm flex items-center gap-3 font-medium text-gray-100"
                whileHover={{ x: 5 }}
              >
                <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
                {feature}
              </motion.li>
            ))}
          </ul>

          {/* Opciones de Compra */}
          {isOutOfStock ? (
            <button className="w-full bg-gray-600/50 text-gray-300 font-bold py-4 rounded-xl cursor-not-allowed border border-gray-600">
              Producto Agotado
            </button>
          ) : (
            <div className="space-y-6 pt-4">
              {/* Contador modernizado */}
              <div className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/10">
                <span className="font-black text-white/80">Cantidad</span>
                <div className="flex items-center gap-6 bg-white/90 text-black px-4 py-2 rounded-xl shadow-inner">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={decrement}
                    disabled={count === 1}
                    className="cursor-pointer p-1 hover:text-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <BadgeMinus size={18} />
                  </motion.button>
                  <span className="text-lg font-bold w-4 text-center">{count}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={increment}
                    className="cursor-pointer p-1 hover:text-orange-600 transition-colors"
                  >
                    <BadgePlus size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all cursor-pointer"
                  onClick={addToCart}
                >
                  <FaShoppingCart size={20} />
                  Agregar al Carrito
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-black/80 to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg  hover:shadow-black/40 transition-all cursor-pointer border border-white/10"
                  onClick={buyNow}
                >
                  <MdPayments size={20} />
                  Comprar Ahora
                </motion.button>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-black/50">
            <div className="flex flex-col gap-1 items-center justify-center p-3 flex-1 bg-white/5 rounded-xl border border-black/50 hover:bg-black/20 transition-colors cursor-help">
              <RiMotorbikeFill size={24} className="text-black/80" />
              <p className="text-[10px] md:text-xs font-semibold text-black/80 text-center">Envío Seguro</p>
            </div>

            <Link
              to="#"
              className="flex flex-col gap-1 items-center justify-center p-3 flex-1 bg-white/5 rounded-xl border border-black/50 hover:bg-black/20 transition-colors"
            >
              <MessagesSquare size={24} className="text-black/80" />
              <p className="text-[10px] md:text-xs font-semibold text-black/80 text-center">
                Soporte 24/7
              </p>
            </Link>
          </div>
        </motion.div>
      </div>

      <ProductDescription content={product.description} />
    </motion.div>
  );
};
