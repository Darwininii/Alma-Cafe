// IoChevronBack removed as it was only used in CustomButton
import { useParams } from "react-router-dom";
import { Loader } from "../../Components/shared/Loader";
import { formatPrice, formatDate } from "../../helpers";
import { useOrderAdmin } from "@/hooks";
import { CustomBack } from "../../Components/shared/CustomBack";
import { CustomCard } from "../../Components/shared/CustomCard";
import { StatusBadge } from "../../Components/shared/StatusBadge";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { FaCartFlatbed, FaUser } from "react-icons/fa6";
import { CustomDivider } from "../../Components/shared/CustomDivider";
import { MdOutlinePersonPinCircle } from "react-icons/md";

export const DashboardOrderPage = () => {
  // const navigate = useNavigate(); // Removed unused
  
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderAdmin(id!);

  if (isLoading || !order) return <Loader />;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-20">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg">
        <div className="flex items-center gap-4">
          <CustomBack 
            iconOnly 
            effect="shine"
            className="bg-black hover:bg-black text-white dark:text-white dark:bg-black/30 dark:hover:bg-black hover:text-primary border border-white/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-3">
                 <h1 className="font-black tracking-tight text-3xl text-black/80 dark:text-white">
                    Pedido #{id?.slice(0, 8)}
                </h1>
                <StatusBadge 
                    status={order.status} 
                    variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : order.status === 'Cancelled' ? 'error' : 'neutral'} 
                    className="text-sm px-3 py-1"
                />
            </div>
           
            <p className="text-black/60 dark:text-white/60 font-medium text-sm mt-1">
              Realizado el {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Items Table */}
              <div className="bg-white/20 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-black/20 dark:border-white/20 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-black/20 dark:border-white/20 flex items-center gap-2">
                        <FaCartFlatbed className="text-black dark:text-white w-5 h-5" />
                        <h2 className="font-bold text-lg text-black dark:text-white">Productos</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm caption-bottom">
                         <thead className="bg-white/20 dark:bg-white/5">
                            <tr className="border-b border-black/20 dark:border-white/20 text-left text-black dark:text-white font-medium">
                                <th className="h-10 px-6 font-medium">Producto</th>
                                <th className="h-10 px-6 font-medium text-center">Cant.</th>
                                <th className="h-10 px-6 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-black/20 dark:divide-white/20">
                            {order.orderItems.map((item, index) => (
                                <tr key={index} className="hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                                    <td className="p-4 pl-6 align-middle">
                                        <div className="flex items-center gap-4">
                                            <CustomCard 
                                                variant="solid"
                                                padding="none"
                                                rounded="2xl"
                                                className="h-16 w-16 shrink-0 border-black/20 dark:border-white/20 shadow-sm"
                                            >
                                                <img
                                                    src={item.productImage ? item.productImage[0] : ""}
                                                    alt={item.productName}
                                                    width="64"
                                                    height="64"
                                                    className="h-full w-full object-contain p-1"
                                                />
                                            </CustomCard>
                                            <span className="font-bold text-black dark:text-white line-clamp-2">
                                                {item.productName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 px-6 align-middle text-center font-bold text-black dark:text-white">
                                        x{item.quantity}
                                    </td>
                                    <td className="p-4 pr-6 align-middle text-right font-bold text-black dark:text-white">
                                        {formatPrice(item.price * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                  </div>
                  {/* Summary Footer */}
                   <div className="bg-white/20 dark:bg-black/20 p-6 flex flex-col gap-3 border-t border-black/20 dark:border-white/20">
                        <div className="flex justify-between text-sm font-semibold text-black/70 dark:text-white/70">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-black/70 dark:text-white/70">
                            <span>Envío</span>
                            <span className="text-green-600 font-bold">Gratis</span>
                        </div>
                         <CustomDivider className="my-1 bg-black/40 dark:bg-white/40 border" />
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
               <div className="bg-white/20 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-black dark:text-white w-5 h-5" />
                        <h2 className="font-bold text-lg text-black dark:text-white">Cliente</h2>
                    </div>
                     <CustomDivider className="my-1 bg-black/40 dark:bg-white/40 border" />
                     <div className="space-y-3">
                        <p className="font-bold text-base text-black dark:text-white">{order.customer.full_name}</p>
                        
                        <div>
                            <span className="font-bold text-xs uppercase text-black/60 dark:text-white/60 block mb-1">Correo</span>
                            <p className="text-sm text-black dark:text-white font-semibold break-all">{order.customer.email}</p>
                        </div>

                        {order.customer.phone && (
                            <div>
                                <span className="font-bold text-xs uppercase text-black/60 dark:text-white/60 block mb-1">Celular</span>
                                <p className="text-sm text-black font-semibold dark:text-white font-mono">{order.customer.phone}</p>
                            </div>
                        )}
                    </div>
               </div>

                {/* Shipping Info */}
               <div className="bg-white/20 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <MdOutlinePersonPinCircle className="text-black dark:text-white" size={28} />
                        <h2 className="font-bold text-lg text-black dark:text-white">Envío</h2>
                    </div>
                     <CustomDivider className="my-1 bg-black/40 dark:bg-white/40 border" />
                     <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                        <div>
                             <span className="font-bold text-xs uppercase text-black/60 dark:text-white/60 block mb-1">Dirección</span>
                             <p className="text-sm text-black font-semibold dark:text-white">{order.address.addressLine}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                             <div>
                                 <span className="font-bold text-xs uppercase text-black/60 dark:text-white/60 block mb-1">Ciudad</span>
                                 <p className="text-sm text-black font-semibold dark:text-white">{order.address.city}</p>
                             </div>
                             <div>
                                 <span className="font-bold text-xs uppercase text-black/60 dark:text-white/60 block mb-1">Barrio</span>
                                 <p className="text-sm text-black font-semibold dark:text-white">{order.address.state}</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {order.address.postalCode && (
                                <div>
                                    <span className="font-bold text-xs uppercase text-black/60 dark:text-white/60 block mb-1">C. Postal</span>
                                    <p className="text-sm text-black font-semibold dark:text-white">{order.address.postalCode}</p>
                                </div>
                            )}
                             <div>
                                <span className="font-bold text-xs uppercase text-black/60 dark:text-white/60 block mb-1">País</span>
                                <p className="text-sm text-black font-semibold dark:text-white">{order.address.country}</p>
                             </div>
                        </div>
                    </div>
               </div>

                {/* Payment Info */}
               <div className="bg-white/20 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <BiSolidBadgeDollar className="text-black dark:text-white" size={28} />
                        <h2 className="font-bold text-lg text-black dark:text-white">Pago</h2>
                    </div>
                     <CustomDivider className="my-1 bg-black/40 dark:bg-white/40 border" />
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-black/80 dark:text-white/80">Estado</span>
                             <StatusBadge 
                                status={order.status} 
                                variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : order.status === 'Cancelled' ? 'error' : 'neutral'} 
                            />
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-black/80 dark:text-white/80">Método</span>
                            <span className="font-semibold text-black dark:text-white">{order.paymentMethod || 'N/A'}</span>
                        </div>
                        {order.reference && order.status !== 'Cancelled' && (
                             <div className="pt-2">
                                <span className="text-xs font-semibold text-black/80 dark:text-white/80 block mb-1">Referencia</span>
                                <code className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded text-xs text-black dark:text-white font-mono block w-full truncate">
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
