import { useState, useRef, useEffect } from "react";
import { formatDate, formatPrice } from "@/helpers";
import Fuse from "fuse.js";
import { useChangeStatusOrder, useUser, useRoleUser, useAllOrders } from "@/hooks";
import { useNavigate} from "react-router-dom";
import { Pagination } from "@/Components/shared/Pagination";
import { Loader } from "@/Components/shared/Loader";
import { CustomButton } from "@/Components/shared/CustomButton";
import { StatusBadge } from "@/Components/shared/StatusBadge";
import { CustomInput } from "@/Components/shared/CustomInput";
import { Search, Filter } from "lucide-react";
import "cally";



const tableHeaders = ["Referencia", "Cliente", "Fecha", "Estado", "Total", "Acciones"];

const statusOptions = [
  { value: "Pending", label: "Pendiente", variant: "warning" },
  { value: "Paid", label: "Pagado", variant: "success" },
  { value: "Shipped", label: "Enviado", variant: "info" },
  { value: "Delivered", label: "Entregado", variant: "success" },
  { value: "Cancelled", label: "Cancelado", variant: "error" },
];

export const TableOrdersAdmin = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  
  // State to control the month being viewed
  const [viewDate, setViewDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Calendar Ref for event listening
  const calendarRangeRef = useRef<any>(null);

  // Fetch ALL orders for client-side search
  const { orders: allOrders, isLoading } = useAllOrders(); 
  const { mutate } = useChangeStatusOrder();

  // Permission Check
  const { session } = useUser();
  const { data: role } = useRoleUser(session?.user.id || "");
  const canEdit = role === 'admin' || role === 'superAdmin';

  // Attach event listener for cally 'change' event
  useEffect(() => {
     const el = calendarRangeRef.current;
     if (!el) return;

     const handleChange = (e: any) => {
         const value = e.target.value || "";
         const [start, end] = value.split("/");
         setDateRange({ start: start || "", end: end || "" });
         setPage(1);
     };

     el.addEventListener("change", handleChange);
     return () => {
         el.removeEventListener("change", handleChange);
     };
  }, []);

  const handleStatusChange = (id: number, status: string) => {
    mutate({ id, status });
  };

  const handleMonthChange = (direction: 'next' | 'prev') => {
      const date = new Date(viewDate);
      // Determine direction
      const change = direction === 'next' ? 1 : -1;
      // create new date 1st of next/prev month
      const newDate = new Date(date.getFullYear(), date.getMonth() + change, 1);
      setViewDate(newDate.toISOString().split("T")[0]);
  };
  
  // 1. First, apply strict filters (Status + Date)
  const preFilteredOrders = allOrders?.filter(order => {
      // Status Filter
      if (statusFilter !== "all" && order.status !== statusFilter) return false;

      // Date Filter
      if (dateRange.start) {
          const orderDate = new Date(order.created_at).toISOString().split('T')[0];
          if (orderDate < dateRange.start) return false;
      }
      if (dateRange.end) {
          const orderDate = new Date(order.created_at).toISOString().split('T')[0];
          if (orderDate > dateRange.end) return false;
      }

      return true;
  }) || [];

  // 2. Then apply Fuzzy Search on the filtered results
  const fuse = new Fuse(preFilteredOrders, {
      keys: ["id", "customers.full_name", "customers.email", "status", "total_amount"],
      threshold: 0.3,
  });

  const finalOrders = searchTerm 
      ? fuse.search(searchTerm).map(result => result.item)
      : preFilteredOrders;

  // Client-side Pagination
  const itemsPerPage = 10;
  const totalItems = finalOrders.length;
  const displayedOrders = finalOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);


  if (isLoading && !displayedOrders) return <Loader />;
  if (!allOrders) return <div className="p-4 text-center">No hay órdenes disponibles.</div>;

  return (
    <div className="flex flex-col flex-1 border border-white/20 rounded-3xl p-6 sm:p-8 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[70vh]">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="font-black text-3xl tracking-tight text-neutral-900 dark:text-white">
            Órdenes
          </h1>
          <p className="text-base mt-2 font-medium text-neutral-500 dark:text-neutral-400">
            Gestiona el estado y seguimiento de los pedidos
          </p>
        </div>

        {/* Search & Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-end">
             <div className="relative w-full md:w-72">
                <CustomInput
                    icon={<Search className="h-5 w-5" />}
                    placeholder="Buscar pedido, cliente, total..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                />
            </div>
            <CustomButton 
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "solid" : "outline"}
                className={showFilters ? "bg-neutral-800 text-white border-neutral-800" : "border-neutral-300 dark:border-white/20"}
                leftIcon={Filter} 
            >
                Filtros
            </CustomButton>
        </div>
      </div>

      {/* Advanced Filters Section */}
      {showFilters && (
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex flex-col gap-4">
                  
                  {/* Status Tabs */}
                  <div>
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Estado</label>
                      <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => { setStatusFilter("all"); setPage(1); }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                statusFilter === "all" 
                                ? "bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg" 
                                : "bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10"
                            }`}
                        >
                            Todos
                        </button>
                        {statusOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    statusFilter === opt.value
                                    ? `ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ${
                                        opt.variant === 'success' ? 'bg-green-500 text-white ring-green-500' :
                                        opt.variant === 'warning' ? 'bg-yellow-500 text-white ring-yellow-500' :
                                        opt.variant === 'error' ? 'bg-red-500 text-white ring-red-500' :
                                        'bg-blue-500 text-white ring-blue-500'
                                    }`
                                    : "bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                      </div>
                  </div>

                  {/* Date Range using Cally */}
                  <div className="flex flex-col gap-2 w-full sm:w-auto animate-in fade-in zoom-in duration-300 items-center sm:items-start">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block w-full text-left">Fecha</label>
                      <div className="p-4 bg-white dark:bg-black/40 border border-neutral-200 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-md w-fit mx-auto">
                        <calendar-range 
                            ref={calendarRangeRef}
                            value={`${dateRange.start}/${dateRange.end}`} 
                            class="text-neutral-800 dark:text-neutral-200"
                        >
                            {/* Custom Header for Calendar */}
                            <div className="flex items-center justify-between mb-4 gap-4">
                                <CustomButton 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={(e) => { e.preventDefault(); handleMonthChange('prev'); }}
                                    className="h-8 w-8 p-0 rounded-full border-neutral-200 dark:border-white/10"
                                >
                                    {"<"}
                                </CustomButton>

                                <div className="flex-1 flex flex-col items-center">
                                    <span className="text-sm font-bold capitalize">
                                        {/* Display Current Month/Year based on viewDate */}
                                        {new Date(viewDate).toLocaleDateString("es-ES", { month: 'long', year: 'numeric' })}
                                    </span>
                                    {(dateRange.start || dateRange.end) && (
                                     <button 
                                        onClick={(e) => {
                                            e.preventDefault(); 
                                            e.stopPropagation();
                                            setDateRange({ start: "", end: "" });
                                            setPage(1);
                                        }}
                                        className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wide mt-1"
                                     >
                                        Limpiar Filtros
                                     </button>
                                    )}
                                </div>

                                <CustomButton 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={(e) => { e.preventDefault(); handleMonthChange('next'); }}
                                    className="h-8 w-8 p-0 rounded-full border-neutral-200 dark:border-white/10"
                                >
                                    {">"}
                                </CustomButton>
                            </div>
                            
                            <style>{`
                                calendar-range {
                                    --color-accent: #000;
                                    --color-text-on-accent: #fff;
                                }
                                .dark calendar-range {
                                    --color-accent: #fff;
                                    --color-text-on-accent: #000;
                                }
                                calendar-month {
                                    --font-family: inherit;
                                }
                                /* Hide default header and buttons */
                                calendar-month::part(button) {
                                    display: none;
                                }
                                calendar-month::part(header) {
                                    display: none; 
                                }
                            `}</style>
                            
                            {/* Pass startDate prop to control the month view */}
                            <calendar-month startDate={viewDate}></calendar-month>
                        </calendar-range>
                      </div>
                  </div>

              </div>
          </div>
      )}

      <div className="relative w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
        <table className="text-sm w-full caption-bottom">
          <thead className="bg-neutral-900/5 dark:bg-white/5 border-b border-white/10">
            <tr className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              {tableHeaders.map((header, index) => (
                <th key={index} className="h-12 px-6 text-left first:pl-8 last:pr-8 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {displayedOrders?.map((order) => {
                 const currentStatusConfig = statusOptions.find(opt => opt.value === order.status);
                 
                return (
              <tr
                key={order.id}
                className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
              >
                {/* Referencia (ID) */}
                <td className="p-4 pl-8 font-mono text-xs text-neutral-500">
                    {order.id.toString().slice(0, 8)}...
                </td>

                {/* Cliente */}
                <td className="p-4 px-6 font-medium tracking-tighter flex flex-col gap-1">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 text-base">
                    {order.customers?.full_name}
                  </span>
                  <span className="text-neutral-500 text-xs">{order.customers?.email}</span>
                </td>

                {/* Fecha */}
                <td className="p-4 px-6 font-medium text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  {formatDate(order.created_at)}
                </td>

                {/* Estado con Select */}
                <td className="p-4 px-6">
                  <div className="relative inline-block">
                    {canEdit ? (
                        <select
                        value={order.status}
                        className={`appearance-none rounded-full py-1.5 px-3 pr-8 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all border bg-white dark:bg-black/20 ${
                             currentStatusConfig?.variant === 'success' ? 'border-green-200 text-green-700' :
                             currentStatusConfig?.variant === 'warning' ? 'border-yellow-200 text-yellow-700' :
                             currentStatusConfig?.variant === 'error' ? 'border-red-200 text-red-700' :
                             'border-blue-200 text-blue-700'
                        }`}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                        {statusOptions.map((option) => (
                            <option value={option.value} key={option.value}>
                            {option.label}
                            </option>
                        ))}
                        </select>
                    ) : (
                         <StatusBadge status={currentStatusConfig?.label || order.status} variant={currentStatusConfig?.variant as any || "neutral"} />
                    )}
                  </div>
                </td>

                {/* Total */}
                <td className="p-4 px-6 font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                  {formatPrice(order.total_amount)}
                </td>
                
                {/* Acciones */}
                <td className="p-4 pr-8">
                     <CustomButton
                        size="sm"
                         variant="ghost"
                        className="text-primary hover:text-primary/80"
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
