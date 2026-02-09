import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDate, formatPrice } from "@/helpers";
import type { OrderItemSingle } from "@/interfaces";
import { Pagination } from "../shared/Pagination";
import { StatusBadge } from "../shared/StatusBadge";
import type { StatusType } from "../shared/StatusBadge";

interface Props {
  orders: OrderItemSingle[];
}

const tableHeaders = ["ID", "Fecha", "Estado", "Total"];

const getStatusVariant = (status: string): StatusType => {
  switch (status) {
    case 'Paid': return 'success';
    case 'Delivered': return 'success';
    case 'Shipped': return 'info';
    case 'Pending': return 'warning';
    case 'Cancelled': return 'error';
    default: return 'neutral';
  }
};

export const TableOrders = ({ orders }: Props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");

  const setPage = (newPage: number) => {
     setSearchParams(prev => {
         prev.set("page", newPage.toString());
         return prev;
     });
  };
  const itemsPerPage = 12;

  // Pagination Logic
  const totalItems = orders.length;
  const startIndex = (page - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);



  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative w-full overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 bg-black/10 dark:bg-black/20 backdrop-blur-sm shadow-sm">
        <table className="text-sm w-full caption-bottom text-black dark:text-white/80">
          <thead className="bg-black/10 dark:bg-white/10 border-b border-black/10 dark:border-white/10">
            <tr className="text-sm font-bold text-black/70 dark:text-white/70">
              {tableHeaders.map((header, index) => (
                <th 
                  key={index} 
                  className={cn(
                    "h-12 px-6 first:pl-8 last:pr-8",
                    header === "Estado" || header === "Total" || header === "Fecha" ? "text-center" : "text-left"
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {currentOrders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                onClick={() => navigate(`/account/pedidos/${order.id}`)}
              >
                <td className="p-4 pl-8 font-medium font-mono text-black/60 dark:text-white/60">
                  #{order.id}
                </td>
                <td className="p-4 font-medium text-center">
                  {formatDate(order.created_at)}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center">
                    <StatusBadge status={order.status} variant={getStatusVariant(order.status)} />
                  </div>
                </td>
                <td className="p-4 pr-8 font-bold text-black dark:text-white text-center">
                  {formatPrice(order.total_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalItems > itemsPerPage && (
        <Pagination
          totalItems={totalItems}
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};
