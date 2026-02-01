// IoChevronBack removed as it was only used in CustomButton
import { useParams } from "react-router-dom";
import { Loader } from "../../Components/shared/Loader";
import { formatPrice, formatDate } from "../../helpers";
import { useOrderAdmin } from "@/hooks";
import { CustomBack } from "../../Components/shared/CustomBack";
import { CustomCard } from "../../Components/shared/CustomCard";
import { StatusBadge } from "../../Components/shared/StatusBadge";
import { User, MapPin, Package } from "lucide-react";
import { BiSolidBadgeDollar } from "react-icons/bi";

export const DashboardOrderPage = () => {
  // const navigate = useNavigate(); // Removed unused
  
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderAdmin(id!);

  if (isLoading || !order) return <Loader />;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-20">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg">
        <div className="flex items-center gap-4">
          <CustomBack 
            iconOnly 
            effect="shine"
            className="bg-white/50 hover:bg-black text-black dark:text-white dark:bg-black/30 dark:hover:bg-black hover:text-primary border border-white/20 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-3">
                 <h1 className="font-black tracking-tight text-3xl text-neutral-900 dark:text-white">
                    Pedido #{id?.slice(0, 8)}
                </h1>
                <StatusBadge 
                    status={order.status} 
                    variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : order.status === 'Cancelled' ? 'error' : 'neutral'} 
                    className="text-sm px-3 py-1"
                />
            </div>
           
            <p className="text-neutral-500 font-medium text-sm mt-1">
              Realizado el {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Items Table */}
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-white/10 flex items-center gap-2">
                        <Package className="text-primary w-5 h-5" />
                        <h2 className="font-bold text-lg text-neutral-800 dark:text-gray-100">Productos</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm caption-bottom">
                         <thead className="bg-neutral-100/50 dark:bg-white/5">
                            <tr className="border-b border-white/10 text-left text-neutral-500 dark:text-neutral-400 font-medium">
                                <th className="h-10 px-6 font-medium">Producto</th>
                                <th className="h-10 px-6 font-medium text-center">Cant.</th>
                                <th className="h-10 px-6 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-white/10">
                            {order.orderItems.map((item, index) => (
                                <tr key={index} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-6 align-middle">
                                        <div className="flex items-center gap-4">
                                            <CustomCard 
                                                variant="solid"
                                                padding="none"
                                                rounded="2xl"
                                                className="h-16 w-16 shrink-0 border-white/20 shadow-sm"
                                            >
                                                <img
                                                    src={item.productImage ? item.productImage[0] : ""}
                                                    alt={item.productName}
                                                    className="h-full w-full object-contain p-1"
                                                />
                                            </CustomCard>
                                            <span className="font-bold text-neutral-700 dark:text-gray-200 line-clamp-2">
                                                {item.productName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 px-6 align-middle text-center font-medium">
                                        x{item.quantity}
                                    </td>
                                    <td className="p-4 pr-6 align-middle text-right font-bold text-neutral-900 dark:text-white">
                                        {formatPrice(item.price * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                  </div>
                  {/* Summary Footer */}
                   <div className="bg-neutral-50/50 dark:bg-black/20 p-6 flex flex-col gap-3 border-t border-white/10">
                        <div className="flex justify-between text-sm text-neutral-500">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-neutral-500">
                            <span>Envío</span>
                            <span className="text-green-600 font-medium">Gratis</span>
                        </div>
                         <div className="w-full h-px bg-neutral-200 dark:bg-white/10 my-1" />
                        <div className="flex justify-between text-lg font-black text-neutral-900 dark:text-white">
                            <span>Total</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                   </div>
              </div>
          </div>

          {/* Right Column: Customer & Payment Info */}
          <div className="space-y-6">
              {/* Customer Info */}
               <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-white/10 pb-3">
                        <User className="text-primary w-5 h-5" />
                        <h2 className="font-bold text-lg text-neutral-800 dark:text-gray-100">Cliente</h2>
                    </div>
                     <div className="space-y-3">
                        <p className="font-bold text-base text-neutral-900 dark:text-white">{order.customer.full_name}</p>
                        
                        <div>
                            <span className="font-bold text-xs uppercase opacity-70 block mb-1">Correo</span>
                            <p className="text-sm text-neutral-500 break-all">{order.customer.email}</p>
                        </div>

                        {order.customer.phone && (
                            <div>
                                <span className="font-bold text-xs uppercase opacity-70 block mb-1">Celular</span>
                                <p className="text-sm text-neutral-400 font-mono">{order.customer.phone}</p>
                            </div>
                        )}
                    </div>
               </div>

                {/* Shipping Info */}
               <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-white/10 pb-3">
                        <MapPin className="text-primary w-5 h-5" />
                        <h2 className="font-bold text-lg text-neutral-800 dark:text-gray-100">Envío</h2>
                    </div>
                     <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                        <div>
                             <span className="font-bold text-xs uppercase opacity-70 block mb-1">Dirección</span>
                             <p>{order.address.addressLine}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                             <div>
                                 <span className="font-bold text-xs uppercase opacity-70 block mb-1">Ciudad</span>
                                 <p>{order.address.city}</p>
                             </div>
                             <div>
                                 <span className="font-bold text-xs uppercase opacity-70 block mb-1">Barrio</span>
                                 <p>{order.address.state}</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {order.address.postalCode && (
                                <div>
                                    <span className="font-bold text-xs uppercase opacity-70 block mb-1">C. Postal</span>
                                    <p>{order.address.postalCode}</p>
                                </div>
                            )}
                             <div>
                                <span className="font-bold text-xs uppercase opacity-70 block mb-1">País</span>
                                <p className="font-bold">{order.address.country}</p>
                             </div>
                        </div>
                    </div>
               </div>

                {/* Payment Info */}
               <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-white/10 pb-3">
                        <BiSolidBadgeDollar className="text-primary w-5 h-5" />
                        <h2 className="font-bold text-lg text-neutral-800 dark:text-gray-100">Pago</h2>
                    </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Estado</span>
                             <StatusBadge 
                                status={order.status} 
                                variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : order.status === 'Cancelled' ? 'error' : 'neutral'} 
                            />
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Método</span>
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{order.paymentMethod || 'N/A'}</span>
                        </div>
                        {order.reference && order.status !== 'Cancelled' && (
                             <div className="pt-2">
                                <span className="text-xs text-neutral-400 block mb-1">Referencia</span>
                                <code className="bg-neutral-100 dark:bg-white/10 px-2 py-1 rounded text-xs text-black font-mono block w-full truncate">
                                    {order.reference}
                                </code>
                            </div>
                        )}
                    </div>
               </div>
          </div>
      </div>
    </div>
  );
};
