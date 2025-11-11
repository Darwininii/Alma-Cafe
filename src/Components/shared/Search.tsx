import { searchProducts } from "@/actions";
import { formatPrice } from "@/helpers";
import { type Product } from "@/interfaces";
import { useGlobalStore } from "@/store/global.store";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const closeSheet = useGlobalStore((state) => state.closeSheet);

  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      const products = await searchProducts(searchTerm);
      setSearchResults(products);
    }
  };

  return (
    <>
      <div className="py-5 px-7 flex gap-10 items-center border-b border-slate-200">
        <form
          className="flex gap-3 items-center flex-1"
          onSubmit={handleSearch}
        >
          <SearchIcon size={22} />
          <input
            type="text"
            placeholder="¿Qué busca?"
            className="outline-none w-full text-sm "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* RESULTADOS DE Busqueda */}
      <div className="p-5">
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((product) => (
              <li className="py-2 group" key={product.id}>
                <button
                  className="flex items-center gap-3"
                  onClick={() => {
                    navigate(`/celulares/${product.slug}`);
                    closeSheet();
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-20 w-20 object-contain p-3"
                  />

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold group-hover:underline">
                      {product.name}
                    </p>

                    <p className="text-sm font-medium text-gray-600">
                      {formatPrice(product.variants[0].price)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No se encontraron resultados</p>
        )}
      </div>
    </>
  );
};
