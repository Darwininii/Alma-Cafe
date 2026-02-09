import { useState, useMemo } from "react";
import { formatDate, formatPrice } from "@/helpers";
import Fuse from "fuse.js";
import { useChangeStatusOrder, useUser, useRoleUser, useAllOrders } from "@/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "@/Components/shared/Pagination";
import { Loader } from "@/Components/shared/Loader";
import { CustomButton } from "@/Components/shared/CustomButton";
import { StatusBadge } from "@/Components/shared/StatusBadge";
import { CustomSelect } from "@/Components/shared/CustomSelect";
import { TbReceiptOff } from "react-icons/tb";
import { CustomFiltered } from "@/Components/shared/CustomFiltered";
import { IoMdMail } from "react-icons/io";
import { FaPhone, FaEye } from "react-icons/fa6";

const tableHeaders = ["Referencia", "Cliente", "Datos", "Envío", "Fecha", "Estado", "Total", "Acciones"];

const statusOptions = [
  { value: "Pending", label: "Pendiente", variant: "warning" },
  { value: "Paid", label: "Pagado", variant: "success" },
  { value: "Shipped", label: "Enviado", variant: "info" },
  { value: "Cancelled", label: "Cancelado", variant: "error" },
];

export const TableOrdersAdmin = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");

  const setPage = (newPage: number) => {
     setSearchParams(prev => {
         prev.set("page", newPage.toString());
         return prev;
     });
  };
   
  const [searchTerm, setSearchTerm] = useState("");
  
  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>(["all"]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  
  // Fetch ALL orders for client-side search
  const { orders: allOrders, isLoading } = useAllOrders(); 
  const { mutate } = useChangeStatusOrder();

  // Permission Check
  const { session } = useUser();
  const { data: role } = useRoleUser(session?.user.id || "");
  const canEdit = role === 'admin' || role === 'superAdmin';

  const handleStatusChange = (id: number, status: string) => {
    mutate({ id, status });
  };



  const handleClearAllFilters = () => {
      setStatusFilter(["all"]);
      setDateRange(null);
      setPage(1);
  };

  const toggleStatusFilter = (status: string) => {
      setPage(1);
      if (status === "all") {
          setStatusFilter(["all"]);
          return;
      }

      setStatusFilter(prev => {
          // If purely switching from "all" to something else, clear "all" first
          let newFilters = prev.includes("all") ? [] : [...prev];

          if (newFilters.includes(status)) {
              newFilters = newFilters.filter(s => s !== status);
          } else {
              newFilters.push(status);
          }

          // If no filters left, or if all options are selected, revert to "all"
          if (newFilters.length === 0 || newFilters.length === statusOptions.length) {
              return ["all"];
          }

          return newFilters;
      });
  };

  const getStatusStyles = (status: string) => {
      const opt = statusOptions.find(o => o.value === status);
      const variant = opt?.variant;
      switch(variant) {
          case 'success': return "bg-green-500 text-white dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30 shadow-lg shadow-green-500/20 border-transparent ring-green-500";
          case 'warning': return "bg-yellow-500 text-white dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30 shadow-lg shadow-yellow-500/20 border-transparent ring-yellow-500";
          case 'error': return "bg-red-500 text-white dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30 shadow-lg shadow-red-500/20 border-transparent ring-red-500";
          case 'info': return "bg-blue-500 text-white dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30 shadow-lg shadow-blue-500/20 border-transparent ring-blue-500";
          default: return "";
      }
  };
  
  // 1. Filter Logic (Memoized for performance and stability)
  const filteredOrders = useMemo(() => {
    if (!allOrders) return [];

    return allOrders.filter(order => {
        // Status Filter
        if (!statusFilter.includes("all") && !statusFilter.includes(order.status)) {
            return false;
        }

        // Date Filter
        if (dateRange) {
            // Use local date string comparison to match the Calendar's generic YYYY-MM-DD
            const orderDate = new Date(order.created_at).toLocaleDateString('en-CA');
            
            if (dateRange.start && orderDate < dateRange.start) return false;
            if (dateRange.end && orderDate > dateRange.end) return false;
        }

        return true;
    });
  }, [allOrders, statusFilter, dateRange]);

  // 2. Fuzzy Search (Memoized)
  const fuse = useMemo(() => {
    // Transform data to include localized status
    const ordersForSearch = filteredOrders.map(order => {
        const statusOption = statusOptions.find(opt => opt.value === order.status);
        return {
            ...order,
            searchableStatus: statusOption ? statusOption.label : order.status
        };
    });

      return new Fuse(ordersForSearch, {
          keys: ["id", "customers.full_name", "customers.email", "status", "searchableStatus", "total_amount"],
          threshold: 0.3,
      });
  }, [filteredOrders]);

  const finalOrders = useMemo(() => {
      if (!searchTerm) return filteredOrders;
      return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, filteredOrders, fuse]);

  // Client-side Pagination
  const itemsPerPage = 10;
  const totalItems = finalOrders.length;
  const displayedOrders = finalOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);


  if (isLoading && !displayedOrders) return <Loader />;
  if (!allOrders) return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] p-8 border border-white/20 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-neutral-100 dark:bg-white/5 shadow-inner">
              <TbReceiptOff className="w-10 h-10 text-neutral-400 dark:text-neutral-500 opacity-80" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">
              No hay órdenes disponibles
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium text-center max-w-md">
              No se han encontrado registros de órdenes en este momento.
          </p>
      </div>
  );

  return (
    <div className="flex flex-col flex-1 border border-black/20 rounded-3xl p-6 sm:p-8 bg-white/20 dark:bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[70vh]">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-black dark:via-white/80 to-transparent opacity-50"/>

        {/* Search & Filter Component with Title as Children */}
        <CustomFiltered 
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
                setSearchTerm(term);
                setPage(1);
            }}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            statusFilter={statusFilter}
            toggleStatusFilter={toggleStatusFilter}
            dateRange={dateRange}
            setDateRange={(range) => {
                setDateRange(range);
                setPage(1);
            }}
            handleClearAllFilters={handleClearAllFilters}
            statusOptions={statusOptions}
            title="Estado de la orden"
            showDateFilter={true}
        >
            <div>
              <h1 className="font-black text-3xl tracking-tight text-neutral-900 dark:text-white">
                Órdenes
              </h1>
              <p className="text-base mt-2 font-medium text-black/60 dark:text-neutral-400">
                Gestiona el estado y seguimiento de los pedidos
              </p>
            </div>
        </CustomFiltered>

      <div className="relative w-full overflow-x-auto rounded-2xl border border-black/20 bg-black/5 dark:bg-white/5 dark:border-white/10 pb-4">
        <table className="text-sm w-full min-w-[1000px] caption-bottom">
          <thead className="bg-neutral-900/5 dark:bg-white/5 border-b border-black/20">
            <tr className="text-sm font-bold text-black dark:text-neutral-300">
              {tableHeaders.map((header, index) => (
                <th key={index} className={`h-12 px-3 first:pl-4 last:pr-4 whitespace-nowrap text-center`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-black/20">
            {displayedOrders?.map((order) => {
                 const currentStatusConfig = statusOptions.find(opt => opt.value === order.status);
                 
                return (
              <tr
                key={order.id}
                className="group hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200"
              >
                {/* Referencia (ID) */}
                <td className="p-3 pl-4 font-semibold text-xs text-black dark:text-white/80 text-center whitespace-nowrap">
                    {order.id.toString().slice(0, 8)}...
                </td>

                {/* Cliente */}
                <td className="p-3 px-2 font-medium tracking-tighter text-center whitespace-nowrap align-middle">
                  <span className="font-bold text-black dark:text-white text-base">
                    {order.customers?.full_name}
                  </span>
                </td>

                <td className="p-3 px-2 font-medium tracking-tighter text-center whitespace-nowrap">
                   <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-1.5 justify-center">
                        <IoMdMail className="w-3.5 h-3.5 text-black dark:text-white" />
                        <span className="text-black dark:text-white/80 text-xs break-all max-w-[150px]">{order.customers?.email}</span>
                      </div>
                      {order.customers?.phone && (
                          <div className="flex items-center gap-1.5 justify-center">
                            <FaPhone className="w-3.5 h-3.5 text-black dark:text-white" />
                            <span className="text-black dark:text-white/80 text-xs font-semibold">{order.customers?.phone}</span>
                          </div>
                      )}
                   </div>
                </td>

                {/* Envío */}
                <td className="p-3 px-2 text-xs text-black dark:text-white text-center min-w-[160px] whitespace-nowrap">
                     {order.address && (
                         <div className="flex flex-col gap-0.5 items-center">
                             <span className="font-semibold text-black dark:text-white truncate max-w-[160px]" title={order.address.address_line}>{order.address.address_line}</span>
                             <span>{order.address.city} - {order.address.state}</span>
                             {order.address.postal_code && <span>CP: {order.address.postal_code}</span>}
                             <span className="uppercase text-[10px] font-bold text-black dark:text-white">{order.address.country}</span>
                         </div>
                     )}
                </td>

                {/* Fecha */}
                <td className="p-3 px-2 font-medium text-black dark:text-white whitespace-nowrap text-center">
                  {formatDate(order.created_at)}
                </td>

                {/* Estado con Select */}
                <td className="p-3 px-2 text-center whitespace-nowrap">
                  <div className="relative inline-block">
                    {canEdit && order.status !== 'Pending' && order.status !== 'Cancelled' ? (
                        <div className="w-32">
                            <CustomSelect
                                options={statusOptions.filter(opt => {
                                    // If Paid, allow moving to Shipped. 
                                    // If Shipped, maybe allow reverting to Paid? Or just stay Shipped.
                                    // User said "only leave Shipped".
                                    // We show the current status + target statuses.
                                    if (order.status === 'Paid') return opt.value === 'Paid' || opt.value === 'Shipped';
                                    if (order.status === 'Shipped') return opt.value === 'Shipped' || opt.value === 'Paid';
                                    return true; 
                                })}
                                value={order.status}
                                onChange={(val) => handleStatusChange(order.id, val)}
                                className={getStatusStyles(order.status)}
                            />
                        </div>
                    ) : (
                         <StatusBadge status={currentStatusConfig?.label || order.status} variant={currentStatusConfig?.variant as any || "neutral"} />
                    )}
                  </div>
                </td>

                {/* Total */}
                <td className="p-3 px-2 font-bold text-neutral-900 dark:text-white whitespace-nowrap text-center">
                  {formatPrice(order.total_amount)}
                </td>
                
                {/* Acciones */}
                <td className="p-3 pr-4 text-center whitespace-nowrap">
                      <CustomButton
                         size="sm"
                         variant="outline"
                         effect="shine"
                         iconClass="w-3.5 h-3.5"
                         leftIcon={FaEye}
                         className="rounded-full bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/20 border-2 hover:border-black dark:hover:border-white hover:text-white dark:hover:text-black hover:bg-black dark:hover:bg-white/90 text-black/80 dark:text-white/80 transition-all font-semibold text-xs px-4 py-1.5"
                         onClick={() => navigate(`/dashboard/ordenes/${order.id}`)}
                      >
                          Ver detalles
                      </CustomButton>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      
       {/* Paginación */}
      <div className="mt-8">
          <Pagination page={page} setPage={setPage} totalItems={totalItems} itemsPerPage={itemsPerPage} />
      </div>
    </div>
  );
};
