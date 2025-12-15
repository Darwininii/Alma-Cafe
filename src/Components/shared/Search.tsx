import { searchProducts } from "@/actions";
import { formatPrice } from "@/helpers";
import { type Product } from "@/interfaces";
import { useGlobalStore } from "@/store/global.store";
import { CustomDeleteButton } from "./CustomDeleteButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaSearch } from "react-icons/fa";
import { Input } from "./Input";
import { MdDeleteForever } from "react-icons/md";
import { CustomButton } from "./CustomButton";

interface RecentProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
}

const RECENT_PRODUCTS_KEY = "recent-products";
const MAX_RECENT = 8;

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  const closeSheet = useGlobalStore((state) => state.closeSheet);
  const navigate = useNavigate();

  // Load recent products from localStorage
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      const products = await searchProducts(searchTerm);
      setSearchResults(products);
    }
  };

  const handleProductClick = (product: Product | RecentProduct) => {
    // Determine the image based on product type
    const imageUrl = 'images' in product
      ? (Array.isArray(product.images) ? product.images[0] : product.images)
      : product.image;

    // Add to recent products
    const newRecent = [
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: imageUrl,
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
    <>
      <div className="py-5 px-7 flex gap-10 items-center border-b border-white/20 dark:border-white/10">
        <form
          className="flex-1"
          onSubmit={handleSearch}
        >
          <Input
            type="text"
            placeholder="¿Qué buscas?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch size={18} />}
            containerClassName="w-full"
            className="bg-transparent border-none text-black dark:text-white"
          />
        </form>
      </div>

      <div className="p-5">
        {showingResults ? (
          // Search Results
          searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((product) => (
                <li className="group" key={product.id}>
                  <CustomButton
                    className="flex cursor-pointer items-center gap-3 w-full p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/20 transition-colors bg-black/10 dark:bg-white/10 border-none shadow-none h-auto"
                    onClick={() => handleProductClick(product)}
                    effect="bounce"
                  >
                    <div className="h-16 w-16 bg-white/0 dark:bg-white/30 rounded-lg p-2 flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left flex-1">
                      <p className="text-sm font-semibold text-black dark:text-white/70 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-black dark:text-white/70">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </CustomButton>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-black dark:text-white/85 text-center py-8">
              No se encontraron resultados
            </p>
          )
        ) : (
          // Recent Products
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
                />
              )}
            </div>

            {recentProducts.length > 0 ? (
              <ul className="space-y-2">
                {recentProducts.map((product) => (
                  <li className="group" key={product.id}>
                    <CustomButton
                      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors cursor-pointer bg-transparent border-none shadow-none h-auto"
                      onClick={() => handleProductClick(product)}
                      effect="bounce"
                    >
                      <div className="h-16 w-16 bg-white/40 dark:bg-white/30 rounded-lg p-2 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-left flex-1">
                        <p className="font-semibold text-black dark:text-white/70 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-sm font-bold text-black dark:text-white">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </CustomButton>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-black dark:text-white/70 text-center py-8">
                No has visto ningún producto recientemente
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
