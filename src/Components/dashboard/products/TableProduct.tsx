import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteProduct, useProducts } from "../../../hooks";
import { Loader } from "../../shared/Loader";
import { formatDate, formatPrice } from "../../../helpers";
import { Pagination } from "../../shared/Pagination";
import { ProduTableProduct } from "./ProduTableProduct";
import { CustomButton } from "../../shared/CustomButton";
import { CustomDeleteButton } from "../../shared/CustomDeleteButton";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

const tableHeaders = [
  "",
  "Nombre",
  "Precio",
  "Stock",
  "Fecha de creación",
  "Acciones",
];

export const TableProduct = () => {
  const [page, setPage] = useState(1);

  const { products, isLoading, totalProducts } = useProducts({
    page,
  });
  const { mutate, isPending } = useDeleteProduct();

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      mutate(id);
    }
  };

  if (!products || isLoading || !totalProducts || isPending) return <Loader />;

  return (
    <div className="flex flex-col flex-1 border border-white/20 rounded-3xl p-8 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[70vh]">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-black text-3xl tracking-tight text-neutral-900 dark:text-white">
            Productos
          </h1>
          <p className="text-base mt-2 font-medium text-neutral-500 dark:text-neutral-400">
            Gestiona tus productos y mira las estadísticas de tus ventas
          </p>
        </div>

        <div className="bg-primary/10 text-primary px-4 py-1 rounded-full font-bold text-sm border border-primary/20">
          Total: {totalProducts}
        </div>
      </div>

      {/* Tabla */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="text-sm w-full caption-bottom">
          <thead className="bg-neutral-900/5 dark:bg-white/5 border-b border-white/10">
            <tr className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              {tableHeaders.map((header, index) => (
                <th key={index} className="h-14 px-6 text-left first:pl-8 last:pr-8">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product, index) => {
              return (
                <tr
                  key={index}
                  className="group hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="p-4 pl-8 align-middle sm:table-cell">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-white/10 bg-white">
                      <img
                        src={
                          product.images[0] ||
                          "https://ui.shadcn.com/placeholder.svg"
                        }
                        alt="Imagen Product"
                        loading="lazy"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  </td>
                  <ProduTableProduct content={product.name} />
                  <ProduTableProduct
                    content={formatPrice(product.price)}
                  />
                  <ProduTableProduct
                    content={product.stock || "0"}
                  />
                  <ProduTableProduct content={formatDate(product.created_at)} />
                  <td className="p-4 pr-8 align-middle">
                    <div className="flex items-center gap-2">
                      <Link to={`/dashboard/productos/editar/${product.slug}`}>
                        <CustomButton
                          size="icon"
                          effect="magnetic"
                          className="w-9 h-9 bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white border border-blue-500/20"
                          centerIcon={MdEditSquare}
                          iconSize={22}
                          title="Editar producto"
                        />
                      </Link>

                      <CustomDeleteButton
                        onClick={() => handleDeleteProduct(product.id)}
                        className="w-9 h-9 border border-red-500/20"
                        size="icon"
                        centerIcon={MdDeleteForever}
                        iconSize={22}
                        title="Eliminar producto"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="mt-6">
        <Pagination page={page} setPage={setPage} totalItems={totalProducts} />
      </div>
    </div>
  );
};
