import { CardProduct } from "@/Components/products/CardProduct";
import { ContainerFilter } from "@/Components/products/ContainerFilter";
import { useFilteredProducts } from "@/hooks";
import { Pagination } from "@/Components/shared/Pagination";
import type { Product } from "@/interfaces";
import { useState } from "react";
import { Loader } from "@/Components/shared/Loader";
import { useSearchParams } from "react-router-dom";

export const TiendaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  
  // Custom setPage to sync with URL
  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: products,
    isLoading,
    totalProducts,
  } = useFilteredProducts({
    page,
    brands: selectedBrands,
    search: searchTerm,
  });

  // ✔ Función para obtener 1 sola imagen
  const getFirstImage = (p: Product) => {
    if (Array.isArray(p.images) && p.images.length > 0) {
      return p.images[0];
    }

    if (typeof p.images === "string" && (p.images as string).length > 0) {
      return p.images;
    }

    return "/img/default-product.jpg";
  };

  return (
    <>
      <h1 className="text-5xl font-bold text-center mb-12 text-black dark:text-white/80">
        Nuestros Productos
      </h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* FILTROS */}
        <ContainerFilter
          setSelectedBrands={setSelectedBrands}
          selectedBrands={selectedBrands}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12">
          {/* LISTA DE PRODUCTOS */}
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4">
              {(products || []).map((product, index) => (
                <CardProduct
                  key={product.id || index}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  img={getFirstImage(product as Product)}
                  price={product.price}
                  stock={product.stock}
                  tag={product.tag as "Nuevo" | "Promoción" | null}
                  discount={product.discount}
                  priority={index < 4}
                />
              ))}
              {!isLoading && (products || []).length === 0 && (
                <p className="text-center font-bold col-span-full py-10 text-black dark:text-white">No se encontraron productos.</p>
              )}
            </div>
          )}

          {/* PAGINACIÓN */}
          <Pagination
            totalItems={totalProducts}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
};
