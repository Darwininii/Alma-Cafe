import { formatDate, formatPrice, getStatusColor } from "@/helpers";
import { useChangeStatusOrder } from "@/hooks";
import type { OrderWithCustomer } from "@/interfaces/order.interface";
import { useNavigate } from "react-router-dom";

const tableHeaders = ["Cliente", "Fecha", "Estado", "Total"];

const statusOptions = [
  { value: "Pending", label: "Pendiente" },
  { value: "Paid", label: "Pagado" },
  { value: "Shipped", label: "Enviado" },
  { value: "Delivered", label: "Entregado" },
];

interface Props {
  orders: OrderWithCustomer[];
}

export const TableOrdersAdmin = ({ orders }: Props) => {
  const navigate = useNavigate();

  const { mutate } = useChangeStatusOrder();

  const handleStatusChange = (id: number, status: string) => {
    mutate({ id, status });
  };

  return (
    <div className="flex flex-col flex-1 border border-white/20 rounded-3xl p-8 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-black text-3xl tracking-tight text-neutral-900 dark:text-white">
            Órdenes Recientes
          </h1>
          <p className="text-base mt-2 font-medium text-neutral-500 dark:text-neutral-400">
            Gestiona el estado y seguimiento de los pedidos
          </p>
        </div>
      </div>

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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="group hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                onClick={() => navigate(`/dashboard/ordenes/${order.id}`)}
              >
                <td className="p-4 pl-8 font-medium tracking-tighter flex flex-col gap-1">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 text-base">
                    {order.customers?.full_name}
                  </span>
                  <span className="text-neutral-500 text-xs">{order.customers?.email}</span>
                </td>
                <td className="p-4 font-medium text-neutral-600 dark:text-neutral-400">
                  {formatDate(order.created_at)}
                </td>
                <td className="p-4 font-medium tracking-tighter">
                  <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      className={`appearance-none rounded-full py-1.5 px-3 pr-8 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all border ${getStatusColor(
                        order.status
                      )}`}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option value={option.value} key={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="p-4 pr-8 font-bold text-neutral-900 dark:text-white">
                  {formatPrice(order.total_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
