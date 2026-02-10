import { formatPrice } from "@/helpers";
import { type Product, type ProductTag } from "@/interfaces";
import { useGlobalStore } from "@/store/global.store";
import { CustomDeleteButton } from "./CustomDeleteButton";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaSearch } from "react-icons/fa";
import { CustomInput } from "./CustomInput";
import { MdDeleteForever } from "react-icons/md";
import { CustomButton } from "./CustomButton";
import { CustomBadge } from "./CustomBadge";
import { PriceDisplay } from "./PriceDisplay";
import { useAllProducts } from "@/hooks/products/useAllProducts";
import Fuse from "fuse.js";

interface RecentProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
  tag?: ProductTag;
  stock?: string | null;
}

const RECENT_PRODUCTS_KEY = "recent-products";
const MAX_RECENT = 8;

/** Calcula si un producto tiene descuento activo */
const computeDiscount = (
  price: number,
  discount?: number,
  tag?: ProductTag
) => {
  const hasDiscount = tag === "Promoción" && (discount ?? 0) > 0;
  const finalPrice = hasDiscount
    ? price - price * ((discount ?? 0) / 100)
    : price;
  return { hasDiscount, finalPrice, discountValue: hasDiscount ? discount! : 0 };
};

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar todos los productos para búsqueda con Fuse.js
  const { products: allProducts } = useAllProducts();

  // Instancia de Fuse.js (se re-crea solo si cambian los productos)
  const fuse = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return null;
    return new Fuse(allProducts as Product[], {
      keys: ["name", "brand"],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [allProducts]);

  // Cargar productos recientes desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_PRODUCTS_KEY);
    if (stored) {
      try {
        setRecentProducts(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading recent products:", e);
      }
    }
  }, []);

  // Auto-search con debounce usando Fuse.js
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      if (fuse) {
        const results = fuse
          .search(searchTerm)
          .slice(0, 20)
          .map((r) => r.item);
        setSearchResults(results);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, fuse]);

  // Auto-focus el input al montar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleProductClick = (product: Product | RecentProduct) => {
    // Determinar la imagen
    const imageUrl =
      "images" in product
        ? Array.isArray(product.images)
          ? product.images[0]
          : product.images
        : product.image;

    // Agregar a productos recientes con todos los campos necesarios
    const newRecent: RecentProduct[] = [
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: imageUrl,
        discount: product.discount,
        tag: product.tag,
        stock: product.stock,
      },
      ...recentProducts.filter((p) => p.id !== product.id),
    ].slice(0, MAX_RECENT);

    setRecentProducts(newRecent);
    localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(newRecent));

    navigate(`/productos/${product.slug}`);
    closeSheet();
  };

  const clearRecentProducts = () => {
    setRecentProducts([]);
    localStorage.removeItem(RECENT_PRODUCTS_KEY);
  };

  const showingResults = searchTerm.trim() !== "";

  return (
    <div className="flex flex-col h-full">
      <div className="py-5 px-7 flex gap-10 items-center border-b border-white/20 dark:border-white/10 shrink-0">
        <form
          className="flex-1"
          onSubmit={(e) => e.preventDefault()}
        >
          <CustomInput
            ref={inputRef}
            type="text"
            placeholder="¿Qué buscas?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch size={18} className="text-black/80 dark:text-white/80" />}
            containerClassName="w-full rounded-2xl"
            wrapperClassName="bg-white/5 backdrop-blur-sm border border-black/30 dark:border-white/30 hover:border-black/70 dark:hover:border-white/70 transition-colors"
            className="text-black dark:text-white"
          />
        </form>
      </div>

      <div className="p-5 flex-1 min-h-0 overflow-y-auto">
        {showingResults ? (
          // Resultados de búsqueda
          searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((product) => {
                const { hasDiscount, finalPrice, discountValue } =
                  computeDiscount(product.price, product.discount, product.tag);
                const isOutOfStock = product.stock === "Agotado";

                return (
                  <li className="group/item" key={product.id}>
                    <CustomButton
                      className="flex cursor-pointer items-center gap-3 w-full p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/20 transition-colors bg-black/10 dark:bg-white/10 border-none shadow-none h-auto"
                      onClick={() => handleProductClick(product)}
                      effect="bounce"
                      effectColor="hover:text-black"
                    >
                      {/* Imagen */}
                      <div className="relative h-16 w-16 bg-white/0 dark:bg-white/30 rounded-lg p-2 shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          width="64"
                          height="64"
                          className={`h-full w-full object-contain mix-blend-multiply ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                        />
                        {/* Discount circle */}
                        {hasDiscount && (
                          <div className="absolute -top-1 -right-1 z-10 flex items-center justify-center bg-red-600 text-white w-7 h-7 rounded-full shadow-md">
                            <span className="text-[8px] font-black leading-none">-{discountValue}%</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-1 text-left flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-semibold text-white/80 dark:text-white/70 group-hover/item:text-black transition-colors line-clamp-2 dark:group-hover/item:text-pink-600 group-hover/item:font-black">
                            {product.name}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isOutOfStock ? (
                            <CustomBadge label="Agotado" color="red" animate={false} />
                          ) : (
                            product.tag && (
                              <CustomBadge
                                label={product.tag}
                                color={product.tag === "Nuevo" ? "green" : "amber"}
                                animate={false}
                              />
                            )
                          )}
                        </div>

                        {/* Precio */}
                        <PriceDisplay
                          originalPrice={product.price}
                          finalPrice={finalPrice}
                          discount={discountValue}
                          hasDiscount={hasDiscount}
                          variant="md"
                        />
                      </div>
                    </CustomButton>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm font-black dark:text-white/85 text-center py-8">
              No se encontraron resultados
            </p>
          )
        ) : (
          // Productos recientes
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-black dark:text-white/70 flex items-center gap-2">
                <FaClock size={18} className="text-black dark:text-white/70" />
                Vistos recientemente
              </h3>
              {recentProducts.length > 0 && (
                <CustomDeleteButton
                  onClick={clearRecentProducts}
                  title="Limpiar historial"
                  className="w-8 h-8 p-0"
                  centerIcon={MdDeleteForever}
                  iconSize={22}
                  effect="bounce"
                />
              )}
            </div>

            {recentProducts.length > 0 ? (
              <ul className="space-y-2">
                {recentProducts.map((product) => {
                  const { hasDiscount, finalPrice, discountValue } =
                    computeDiscount(product.price, product.discount, product.tag);
                  const isOutOfStock = product.stock === "Agotado";

                  return (
                    <li className="group" key={product.id}>
                      <CustomButton
                        className="flex items-center gap-3 w-full p-2 rounded-lg bg-black/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors cursor-pointer border-none shadow-none h-auto"
                        onClick={() => handleProductClick(product)}
                        effect="bounce"
                      >
                        {/* Imagen */}
                        <div className="relative h-16 w-16 bg-white/40 dark:bg-white/30 rounded-lg p-2 shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            width="64"
                            height="64"
                            className={`h-full w-full object-contain mix-blend-multiply ${isOutOfStock ? "grayscale opacity-60" : ""}`}
                          />
                          {/* Discount circle */}
                          {hasDiscount && (
                            <div className="absolute -top-1 -right-1 z-10 flex items-center justify-center bg-red-600 text-white w-7 h-7 rounded-full shadow-md">
                              <span className="text-[8px] font-black leading-none">-{discountValue}%</span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-1 text-left flex-1">
                          <p className="font-semibold text-white dark:text-white/70 transition-colors line-clamp-2 group-hover:text-black dark:group-hover:text-pink-600 group-hover:font-black">
                            {product.name}
                          </p>

                          {/* Tags */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isOutOfStock ? (
                              <CustomBadge label="Agotado" color="red" animate={false} />
                            ) : (
                              product.tag && (
                                <CustomBadge
                                  label={product.tag}
                                  color={product.tag === "Nuevo" ? "green" : "amber"}
                                  animate={false}
                                />
                              )
                            )}
                          </div>

                          {/* Precio */}
                          <PriceDisplay
                            originalPrice={product.price}
                            finalPrice={finalPrice}
                            discount={discountValue}
                            hasDiscount={hasDiscount}
                            variant="md"
                          />
                        </div>
                      </CustomButton>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-black dark:text-white/70 text-center py-8">
                No has visto ningún producto recientemente
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
