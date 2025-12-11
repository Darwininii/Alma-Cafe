import { useNavigate } from "react-router-dom";
import { formatDate, formatPrice, getStatus } from "@/helpers";
import type { OrderItemSingle } from "@/interfaces";

interface Props {
  orders: OrderItemSingle[];
}

const tableHeaders = ["ID", "Fecha", "Estado", "Total"];

export const TableOrders = ({ orders }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full">
      <table className="text-sm w-full caption-bottom overflow-auto">
        <thead className="border-b border-black/50 pb-3">
          <tr className="text-sm font-bold">
            {tableHeaders.map((header, index) => (
              <th key={index} className="h-12 px-4 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="[&_tr:last-child]:border-0 rounded-xl overflow-hidden">
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className={`cursor-pointer bg-black/10 hover:bg-black/20 transition-colors duration-200 ${index === orders.length - 1 ? "" : "border-b border-gray-300"}`}
              onClick={() => navigate(`/account/pedidos/${order.id}`)}
            >
              <td className={`p-4 font-medium tracking-tighter ${index === 0 ? "rounded-tl-xl" : ""} ${index === orders.length - 1 ? "rounded-bl-xl" : ""}`}>
                {order.id}
              </td>
              <td className="p-4 font-medium tracking-tighter">
                {formatDate(order.created_at)}
              </td>
              <td className="p-4 font-medium tracking-tighter">
                {getStatus(order.status)}
              </td>
              <td className={`p-4 font-medium tracking-tighter ${index === 0 ? "rounded-tr-xl" : ""} ${index === orders.length - 1 ? "rounded-br-xl" : ""}`}>
                {formatPrice(order.total_amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
