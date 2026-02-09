import { GridImages } from "@/Components/one-product/GridImages";
import { ProductDescription } from "@/Components/one-product/ProductDescription";
import { Loader } from "@/Components/shared/Loader";
import { Separator } from "@/Components/shared/Separator";
import { CustomBadge } from "@/Components/shared/CustomBadge";
import { CustomButton } from "@/Components/shared/CustomButton";
import { CustomCard } from "@/Components/shared/CustomCard";
import { formatPrice } from "@/helpers";
import { useProduct } from "@/hooks";
import { useCartStore, useCounterStore } from "@/store";
import { motion } from "framer-motion";
import { CustomPlusMinus } from "@/Components/shared/CustomPlusMinus";
import { MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";
import { MdPayments, MdLocalOffer } from "react-icons/md";
import { RiMotorbikeFill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { CustomBack } from "@/Components/shared/CustomBack";

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
      <div className="pt-4">
        <CustomBack onClick={() => navigate(-1)} />
      </div>

      <div className="h-fit flex flex-col lg:flex-row gap-8 lg:gap-16 mt-6 md:mt-8">
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
          className="flex-1"
        >
          <CustomCard
            variant="glass"
            padding="lg"
            rounded="3xl"
            className="space-y-6 h-full border-white/20 shadow-xl"
          >
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white/80 drop-shadow-md">{product.name}</h1>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {product.tag === "Promoción" && product.discount && product.discount > 0 ? (
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-bold text-black/40 dark:text-white/40 line-through decoration-red-600/60 decoration-2">
                           {formatPrice(product.price)}
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl md:text-6xl font-black text-red-600 dark:text-red-500 drop-shadow-sm">
                                {formatPrice(product.price - (product.price * (product.discount / 100)))}
                            </span>
                            <div className="flex flex-col items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg border border-red-200 dark:border-red-900/50">
                                <MdLocalOffer size={24} />
                                <span className="text-xs font-black">-{product.discount}%</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                      {formatPrice(product.price)}
                    </span>
                )}

                {/* Tags */}
                <div className="relative flex gap-2 h-fit self-start md:self-auto mt-2 md:mt-0">
                  {isOutOfStock && <CustomBadge label="Agotado" color="red" />}
                  {!isOutOfStock && product.tag && <CustomBadge label={product.tag} color={product.tag === "Nuevo" ? "green" : "amber"} />}
                </div>
              </div>

            </div>

            <Separator className="border-white/20" />

            {/* Características */}
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-black/5 dark:border-white/5">
              <h2 className="text-sm font-bold text-black/60 dark:text-white/60 mb-3 uppercase tracking-wider">Características</h2>
              <ul className="space-y-3">
                {product.features.map((feature: string) => (
                  <motion.li
                    key={feature}
                    className="text-sm flex items-start gap-3 font-medium text-black/80 dark:text-gray-200"
                    whileHover={{ x: 5 }}
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(234,88,12,0.6)]" />
                    <span className="leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Opciones de Compra */}
            {isOutOfStock ? (
              <CustomButton
                disabled
                className="w-full bg-gray-600/50 text-gray-300 font-bold py-4 rounded-xl cursor-not-allowed border border-gray-600 pointer-events-none"
                size="lg"
                effect="none"
              >
                Producto Agotado
              </CustomButton>
            ) : (
              <div className="space-y-6 pt-4">
                {/* Contador modernizado */}
                <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-2 pr-4 pl-6 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-sm">
                  <span className="font-bold text-black/70 dark:text-white/80 text-sm uppercase tracking-wider">Cantidad</span>
                  <CustomPlusMinus
                    value={count}
                    onDecrease={decrement}
                    onIncrease={increment}
                    disableDecrease={count === 1}
                    className="bg-black/10 dark:bg-white/10 border-none shadow-sm h-10"
                    iconSize={20}
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <CustomButton
                    className="w-full sm:flex-1 bg-white text-black font-bold py-4 md:py-5 rounded-xl shadow-lg hover:bg-gray-100 border-none text-base md:text-lg"
                    onClick={addToCart}
                    leftIcon={FaShoppingCart}
                    iconSize={24}
                    size="lg"
                    effect="bounce"
                  >
                    Agregar al Carrito
                  </CustomButton>

                  <CustomButton
                    className="w-full sm:flex-1 bg-linear-to-r from-black/80 to-rose-600 text-white font-bold py-4 md:py-5 rounded-xl shadow-lg hover:shadow-black/40 border border-white/10 text-base md:text-lg"
                    onClick={buyNow}
                    leftIcon={MdPayments}
                    iconSize={24}
                    size="lg"
                    effect="shine"
                  >
                    Comprar Ahora
                  </CustomButton>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-black/10 dark:border-white/10">
              <CustomButton
                className="flex-1 flex-col h-auto py-3 gap-1 bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-black/80 dark:text-white/80 shadow-none min-h-[80px]"
                effect="none"
                title="Envío Seguro"
              >
                <RiMotorbikeFill size={24} className="mb-1" />
                <span className="text-[10px] sm:text-xs font-bold">Envío Seguro</span>
              </CustomButton>

              <CustomButton
                href={`https://wa.me/571234567890?text=${encodeURIComponent(
                  `Hola, quiero saber más a cerca del producto: '${product.name}'.`
                )}`}
                target="_blank"
                className="flex-1 flex-col h-auto py-3 gap-1 bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-black/80 dark:text-white/80 shadow-none min-h-[80px]"
                effect="none"
                title="Contactar Soporte"
              >
                <MessagesSquare size={24} className="mb-1" />
                <span className="text-[10px] sm:text-xs font-bold">
                  Soporte 24/7
                </span>
              </CustomButton>
            </div>
          </CustomCard>
        </motion.div>
      </div>

      <ProductDescription content={product.description} />
    </motion.div>
  );
};
