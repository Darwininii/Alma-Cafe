import { searchProducts } from "@/actions";
import { formatPrice } from "@/helpers";
import { type Product } from "@/interfaces";
import { useGlobalStore } from "@/store/global.store";
import { MdDeleteForever } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaSearch } from "react-icons/fa";

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
      <div className="py-5 px-7 flex gap-10 items-center border-b border-white/20">
        <form
          className="flex gap-3 items-center flex-1"
          onSubmit={handleSearch}
        >
          <FaSearch size={22} className="text-black" />
          <input
            type="text"
            placeholder="¿Qué buscas?"
            className="outline-none w-full text-sm bg-transparent placeholder:text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  <button
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/20 transition-colors"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="h-16 w-16 bg-white/50 rounded-lg p-2 flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-left flex-1">
                      <p className="text-sm font-semibold text-black group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-black">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 text-center py-8">
              No se encontraron resultados
            </p>
          )
        ) : (
          // Recent Products
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                <FaClock size={18} />
                Vistos recientemente
              </h3>
              {recentProducts.length > 0 && (
                <button
                  onClick={clearRecentProducts}
                  className="cursor-pointer text-black hover:text-red-600/80 transition-colors"
                  title="Limpiar historial"
                >
                  <MdDeleteForever size={25} />
                </button>
              )}
            </div>

            {recentProducts.length > 0 ? (
              <ul className="space-y-2">
                {recentProducts.map((product) => (
                  <li className="group" key={product.id}>
                    <button
                      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="h-16 w-16 bg-white/40 rounded-lg p-2 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <div className="flex flex-col gap-1 text-left flex-1">
                        <p className="text-sm font-semibold text-black group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-sm font-bold text-black">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-black text-center py-8">
                No has visto ningún producto recientemente
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
