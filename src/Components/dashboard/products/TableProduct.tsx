import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteProduct, useProducts, useAllProducts } from "../../../hooks";
import { Loader } from "../../shared/Loader";
import { formatPrice } from "../../../helpers";
import { Pagination } from "../../shared/Pagination";
import { CustomButton } from "../../shared/CustomButton";
import { CustomDeleteButton } from "../../shared/CustomDeleteButton";
import { MdEditSquare } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { CustomModal } from "../../shared/CustomModal";
import { StatusBadge } from "../../shared/StatusBadge";
import Fuse from "fuse.js";
import { CustomInput } from "@/Components/shared/CustomInput";
import { Search } from "lucide-react";

const tableHeaders = [
  "",
  "Nombre / Slug",
  "Precio",
  "Stock",
  "Etiqueta",
  "Acciones",
];

export const TableProduct = () => {
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Search Logic (Fuse.js)
  const { products: paginatedProducts, isLoading: isLoadingPaginated, totalProducts: totalServerProducts } = useProducts({
    page: searchTerm ? 1 : page,
  });

  const { products: allProducts, isLoading: isLoadingAll } = useAllProducts();
  const { mutate, isPending } = useDeleteProduct();

  // Pre-process products for Fuse (add searchableStatus)
  const productsForSearch = allProducts?.map(product => {
      let status = "Neutro";
      const stockVal = Number(product.stock);
      const isNumeric = !isNaN(stockVal);
      
      if (product.stock === "Agotado") status = "Agotado Sin Stock";
      else if (product.stock === "Disponible") status = "Disponible Activo";
      else if (isNumeric) {
          if (stockVal === 0) status = "Agotado Sin Stock";
          else if (stockVal < 10) status = "Bajo Stock Alerta";
          else status = "Disponible Activo";
      }

      return {
          ...product,
          searchableStatus: status
      }
  }) || [];

  const fuse = new Fuse(productsForSearch, {
    keys: ["name", "slug", "brand", "tag", "price", "stock", "searchableStatus"],
    threshold: 0.3, 
  });

  const filteredProducts = searchTerm 
    ? fuse.search(searchTerm).map(result => result.item) 
    : paginatedProducts;

  const totalItems = searchTerm ? (filteredProducts?.length || 0) : (totalServerProducts || 0);

  const itemsPerPage = 12; 
  const displayedProducts = searchTerm 
    ? filteredProducts?.slice((page - 1) * itemsPerPage, page * itemsPerPage) 
    : paginatedProducts;

  const isLoading = searchTerm ? isLoadingAll : isLoadingPaginated;

  const confirmDelete = () => {
    if (productToDelete) {
      mutate(productToDelete);
      setProductToDelete(null);
    }
  };

  const getStockStatus = (stock: number | string | null) => {
      if (stock === "Agotado") return "error";
      if (stock === "Disponible") return "success";
      
      const val = Number(stock);
      if (!isNaN(val)) {
        if (val === 0) return "error";
        if (val < 10) return "warning";
        return "success";
      }
      
      return "neutral";
  };

  if (isLoading && !displayedProducts) return <Loader />;

  return (
    <>
      <div className="flex flex-col flex-1 border border-white/20 rounded-3xl p-6 sm:p-8 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[70vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="font-black text-3xl tracking-tight text-neutral-900 dark:text-white">
              Productos
            </h1>
            <p className="text-base mt-2 font-medium text-neutral-500 dark:text-neutral-400">
              Gestiona el inventario de tu Ecommerce
            </p>
          </div>

           {/* Search and New Product */}
           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-end">
                <div className="relative w-full sm:w-64">
                    <CustomInput
                        icon={<Search className="h-5 w-5" />}
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        wrapperClassName="h-[38px] py-1"
                        className="h-full py-0"
                    />
                </div>

                <Link to="/dashboard/productos/new">
                    <CustomButton
                        effect="shine"
                        iconSize={18}
                        className="bg-primary hover:bg-primary/90 text-black dark:text-white font-bold shadow-lg shadow-primary/20 w-full sm:w-auto"
                        rightIcon={TiPlus}
                    >
                        Nuevo
                    </CustomButton>
                </Link>
           </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-2">
           <div className="text-sm text-neutral-500 font-medium">
               Mostrando {displayedProducts?.length || 0} de {totalItems} productos
           </div>
        </div>

        <div className="relative w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
          <table className="text-sm w-full caption-bottom">
            <thead className="bg-neutral-900/5 dark:bg-white/5 border-b border-white/10">
              <tr className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                {tableHeaders.map((header, index) => (
                  <th 
                    key={index} 
                    className={`h-12 px-6 first:pl-8 last:pr-8 whitespace-nowrap ${index > 1 ? 'text-center' : 'text-left'}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedProducts?.map((product) => {
                const stockVal = Number(product.stock);
                const isNumericStock = !isNaN(stockVal); 
                
                return (
                  <tr
                    key={product.id}
                    className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="p-4 pl-8 w-20">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10 bg-white shadow-sm">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    <td className="p-4 px-6 align-middle">
                        <div className="flex flex-col">
                            <span className="font-bold text-neutral-900 dark:text-white text-base">
                                {product.name}
                            </span>
                            <span className="text-xs text-neutral-500 font-mono mt-0.5">
                                /{product.slug}
                            </span>
                        </div>
                    </td>

                    <td className="p-4 px-6 align-middle font-semibold text-neutral-700 dark:text-neutral-200 text-center">
                      {formatPrice(product.price)}
                    </td>

                    <td className="p-4 px-6 align-middle text-center">
                         <div className="flex justify-center">
                             <StatusBadge
                                 status={`${product.stock} ${isNumericStock ? 'u.' : ''}`}
                                 variant={getStockStatus(product.stock)}
                             />
                         </div>
                    </td>

                    <td className="p-4 px-6 align-middle text-center">
                        <div className="flex justify-center">
                            <StatusBadge
                                status={product.tag || "Sin etiqueta"}
                                variant={
                                   product.tag === "Nuevo" ? "info" :
                                   product.tag === "Promoción" ? "success" :
                                   "neutral"
                                }
                            />
                        </div>
                    </td>

                    <td className="p-4 px-6 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/dashboard/productos/editar/${product.slug}`}>
                          <CustomButton
                            size="icon"
                            variant="ghost"
                            effect="shine"
                            className="w-8 h-8 hover:bg-blue-100 
                            text-blue-800 bg-indigo-100
                            hover:text-blue-600 dark:hover:bg-blue-900/20 
                            dark:bg-sky-950
                            dark:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            centerIcon={MdEditSquare}
                            iconSize={18}
                            title="Editar"
                          />
                        </Link>

                        <CustomDeleteButton
                          onClick={() => setProductToDelete(product.id)}
                          className="w-8 h-8 rounded-md"
                          iconSize={18}
                          effect="shine"
                          title="Eliminar"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <Pagination page={page} setPage={setPage} totalItems={totalItems} />
        </div>
      </div>

        <CustomModal
            isOpen={!!productToDelete}
            onClose={() => setProductToDelete(null)}
            onConfirm={confirmDelete}
            title="¿Eliminar producto?"
            description="Esta acción moverá el producto a la papelera (soft delete). Podrás restaurarlo contactando a soporte."
            variant="danger"
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            isLoading={isPending}
        />
    </>
  );
};
