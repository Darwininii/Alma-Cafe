// pages/TiendaPage.tsx

import { CardProduct } from "@/Components/products/CardProduct";
import { ContainerFilter } from "@/Components/products/ContainerFilter";
import { useFilteredProducts } from "@/hooks";
import { Pagination } from "@/Components/shared/Pagination";
import type { Product } from "@/interfaces";
import { useState } from "react";

export const TiendaPage = () => {
  const [page, setPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const {
    data: products,
    isLoading,
    totalProducts,
  } = useFilteredProducts({
    page,
    brands: selectedBrands,
  });

  if (isLoading || !products)
    return <p className="text-center text-slate-900 mt-20">Cargando...</p>;

  // ❌ ELIMINADO: prepareProducts
  const productsToRender = products as Product[];

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
      <h1 className="text-5xl font-semibold text-center mb-12">
        Nuestros Productos
      </h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* FILTROS */}
        <ContainerFilter
          setSelectedBrands={setSelectedBrands}
          selectedBrands={selectedBrands}
        />

        <div className="col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12">
          {/* LISTA DE PRODUCTOS */}
          <div className="grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4">
            {productsToRender.map((product, index) => (
              <CardProduct
                key={product.id || index}
                name={product.name}
                slug={product.slug}
                img={getFirstImage(product)}
                price={product.price}
                stock={product.stock} // <--- ✔ STOCK DIRECTO
                // ❌ ELIMINADO colors, variants, products[]
              />
            ))}
          </div>

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
