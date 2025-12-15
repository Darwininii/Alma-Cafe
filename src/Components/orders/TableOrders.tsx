import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatPrice } from "@/helpers";
import type { OrderItemSingle } from "@/interfaces";
import { Pagination } from "../shared/Pagination";
import { OrderStatusBadge } from "../shared/OrderStatusBadge";

interface Props {
  orders: OrderItemSingle[];
}

const tableHeaders = ["ID", "Fecha", "Estado", "Total"];

export const TableOrders = ({ orders }: Props) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Pagination Logic
  const totalItems = orders.length;
  const startIndex = (page - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);



  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative w-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black/10 dark:bg-black/20 backdrop-blur-sm shadow-sm">
        <table className="text-sm w-full caption-bottom text-black dark:text-white/80">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10">
            <tr className="text-sm font-bold text-black/70 dark:text-white/70">
              {tableHeaders.map((header, index) => (
                <th key={index} className="h-12 px-6 text-left first:pl-8 last:pr-8">
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
                <td className="p-4 font-medium">
                  {formatDate(order.created_at)}
                </td>
                <td className="p-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="p-4 pr-8 font-bold text-black dark:text-white">
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
