import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrder, useUser, useCustomer, useOrders, useImageZoom } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { IoChevronBack, IoChevronForward, IoChevronDown } from "react-icons/io5";
import { CustomPrint } from "../Components/shared/CustomPrint";
import { TransactionReceipt } from "../Components/checkout/TransactionReceipt";
import { formatDate, formatPrice } from "@/helpers";
import { MapPinHouse, Receipt } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CustomButton } from "../Components/shared/CustomButton";
import { CustomClose } from "../Components/shared/CustomClose";
import { CustomPlusMinus } from "../Components/shared/CustomPlusMinus";
import { StatusBadge } from "../Components/shared/StatusBadge";
import type { StatusType } from "../Components/shared/StatusBadge";
import { CustomBack } from "../Components/shared/CustomBack";



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

export const OrderUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(String(id!));
  const { data: allOrders } = useOrders();
  const { session } = useUser();
  const userId = session?.user?.id;
  const { data: customerProfile } = useCustomer(userId!);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isItemsExpanded, setIsItemsExpanded] = useState(true);

  // Hook for image zoom logic
  const {
    zoom,
    panPosition,
    isDragging,
    resetZoom,
    handleZoomIn,
    handleZoomOut,
    handlers,
    containerHandlers
  } = useImageZoom();

  // Ref to track mousedown target for safe backdrop closing
  const mouseDownTarget = useRef<EventTarget | null>(null);

  const closeModal = () => {
    setSelectedImage(null);
    resetZoom();
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    mouseDownTarget.current = e.target;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (mouseDownTarget.current === e.currentTarget) {
      closeModal();
    }
    mouseDownTarget.current = null;
  };

  if (isLoading || !order) return <Loader />;

  const userAvatar = session?.user?.user_metadata?.avatar_url;
  const userInitials = customerProfile?.full_name
    ? customerProfile.full_name[0].toUpperCase()
    : "U";

  const currentIndex = allOrders?.findIndex((o) => String(o.id) === String(id)) ?? -1;
  const nextOrder = currentIndex > 0 ? allOrders?.[currentIndex - 1] : null;
  const prevOrder = currentIndex !== -1 && currentIndex < (allOrders?.length || 0) - 1 ? allOrders?.[currentIndex + 1] : null;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:hidden">
        {/* Header */}
        <div className="mb-8">
          <CustomBack className="mb-6" />

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <CustomButton
              className="flex-1 sm:flex-none border border-black/10 dark:border-white/80 hover:bg-black/80 dark:hover:bg-white/80 dark:hover:text-black/80 dark:hover:font-black"
              onClick={() => prevOrder && navigate(`/account/pedidos/${prevOrder.id}`)}
              disabled={!prevOrder}
              size="sm"
              effect="none"
              leftIcon={IoChevronBack}
              iconSize={20}
            >
              Anterior
            </CustomButton>

            <CustomButton
              className="flex-1 sm:flex-none border border-black/10 dark:border-white/10 hover:bg-black/80 dark:hover:bg-white/80 dark:hover:text-black/80 dark:hover:font-black"
              onClick={() => nextOrder && navigate(`/account/pedidos/${nextOrder.id}`)}
              disabled={!nextOrder}
              size="sm"
              effect="none"
              rightIcon={IoChevronForward}
              iconSize={20}
            >
              Siguiente
            </CustomButton>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-black/80 dark:text-white mb-2">
                Pedido #{id}
              </h1>
              <p className="text-sm text-black/70 dark:text-white/70">{formatDate(order.created_at)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
              <StatusBadge status={order.status} variant={getStatusVariant(order.status)} className="px-4 py-1 text-sm border-black/80 dark:border-white/80" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-[#210F37] rounded-2xl shadow-sm border border-black/20 overflow-hidden">
              <div
                className="px-6 py-4 border-b border-black/20 dark:border-white/20 flex justify-between items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => setIsItemsExpanded(!isItemsExpanded)}
              >
                <h2 className="text-lg font-semibold text-black/80 dark:text-white">Artículos del pedido</h2>
                <motion.div
                  animate={{ rotate: isItemsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IoChevronDown className="text-black/80 dark:text-white/80" size={25} />
                </motion.div>
              </div>

              <AnimatePresence>
                {isItemsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-black/20 dark:divide-white/20">
                      {order.orderItems.map((product, index) => (
                        <div
                          key={index}
                          className="p-6 dark:hover:bg-black/30 cursor-pointer transition-colors hover:bg-black/10"
                          onClick={() => setSelectedImage(product.productImage?.[0] || null)}
                        >
                          <div className="flex gap-4 items-center">
                            {/* Product Image */}
                            <div className="shrink-0">
                              <img
                                src={product.productImage?.[0] || "/placeholder.png"}
                                alt={product.productName}
                                className="h-20 w-20 object-cover rounded-lg border border-black/10 dark:border-white/10 shadow-sm"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-black/80 dark:text-white mb-1 truncate">
                                {product.productName}
                              </h3>
                              <div className="text-sm text-black/60 dark:text-white/60">
                                Price Unitario: <span className="font-semibold text-black/80 dark:text-white/80">{formatPrice(product.price)}</span>
                              </div>
                              <div className="text-sm text-black/60 dark:text-white/60">
                                Cantidad: <span className="font-semibold text-black/80 dark:text-white/80">{product.quantity}</span>
                              </div>
                            </div>

                            {/* Product Subtotal */}
                            <div className="shrink-0 text-right">
                              <p className="text-sm text-black/60 dark:text-white/60 mb-1">Subtotal</p>
                              <p className="text-lg font-black text-black/80 dark:text-white">
                                {formatPrice(product.price * product.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column - Information */}
          <div className="space-y-6">

            {/* Order Receipt (Comprobante Visual) */}
            <div className="bg-white/90 dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-black/20 p-0 overflow-hidden relative">
              {/* Decorative Receipt Header */}
              <div className="bg-black/5 dark:bg-white/5 px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center gap-3">
                <Receipt size={18} className="text-black/70 dark:text-white/70" />
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-wide uppercase text-black/70 dark:text-white/70">Resumen</span>
                  <span className="text-xs font-mono text-black/50 dark:text-white/50">
                    {order.reference || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Details Table */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/60 dark:text-white/60">Fecha</span>
                    <span className="font-medium text-black/90 dark:text-white/90">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60 dark:text-white/60">Método de Pago</span>
                    <span className="font-medium text-black/90 dark:text-white/90">{order.paymentMethod || 'No especificado'}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-black/20 dark:border-white/20 my-4" />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60 dark:text-white/60">Subtotal</span>
                    <span className="font-bold text-black/90 dark:text-white/90">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60 dark:text-white/60">Envío</span>
                    <span className="font-bold text-black/90 dark:text-white/90">{formatPrice(0)}</span>
                  </div>

                  <div className="pt-3 border-t border-black/90 dark:border-white/90 mt-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-black text-black dark:text-white">TOTAL</span>
                      <span className="text-2xl font-black text-black dark:text-white">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Zigzag Bottom Effect (CSS Trick or SVG) - Optional, simpler solid line for now */}
              <div className="h-2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-black/5 to-transparent bg-size-[10px_10px] bg-repeat-x"></div>
            </div>

            {/* Payment Information (Wompi Details) */}
            {(order.transactionId || order.reference) && (
              <div className="bg-white/80 dark:bg-[#210F37] rounded-2xl shadow-sm border border-black/20 p-6">
                <h2 className="text-sm font-bold text-black/50 dark:text-white/50 uppercase tracking-widest mb-4">Información de Transacción</h2>
                <div className="space-y-3 text-sm text-black/80 dark:text-white/80">
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <StatusBadge status={order.status} variant={getStatusVariant(order.status)} className="px-2 py-0.5 text-sm border-black/80 dark:border-white/80" />
                  </div>
                  {order.transactionId && !['Cancelled', 'Cancelado', 'Pending', 'Pendiente'].includes(order.status) && (
                    <div className="flex flex-col">
                      <span className="text-xs opacity-70">ID Transacción</span>
                      <span className="font-mono font-medium">{order.transactionId}</span>
                    </div>
                  )}
                  {order.reference && !['Cancelled', 'Cancelado', 'Pending', 'Pendiente'].includes(order.status) && (
                    <div className="flex flex-col">
                      <span className="text-xs opacity-70">Referencia de Pago</span>
                      <span className="font-mono font-medium">{order.reference}</span>
                    </div>
                  )}
                </div>

                {!['Cancelled', 'Cancelado', 'Pending', 'Pendiente'].includes(order.status) && (
                  <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10">
                    <CustomPrint
                      className="w-full"
                      label="Comprobante"
                    />
                    </div>
                )}
              </div>
            )}


            {/* Shipping Address Card */}
            <div className="bg-white/80 dark:bg-[#210F37] rounded-2xl shadow-sm border border-black/20 dark:border-white/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-black/20 bg-white/50 dark:border-white/20">
                <h2 className="text-lg font-semibold dark:font-bold text-black/80 dark:text-black">Información de envío</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Section */}
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-black/20 dark:border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/50 flex items-center justify-center text-black/80 font-bold border border-black/30 dark:border-white/30">
                        {userInitials}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black/80 dark:text-white/80 uppercase tracking-wider mb-1">Cliente</p>
                    <p className="text-sm font-semibold text-black/80 dark:text-white">{order.customer.full_name}</p>
                    <p className="text-sm text-black/80 dark:text-white break-all">{order.customer.email}</p>
                    {order.customer.phone && (
                        <p className="text-sm text-black/60 dark:text-white/60">{order.customer.phone}</p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-black/50 dark:bg-white/50 w-full" />

                {/* Address Section */}
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/50 flex items-center justify-center text-black/80 border border-black/30 dark:border-white/30">
                      <MapPinHouse size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black/80 dark:text-white/80 uppercase tracking-wider mb-1">Dirección de entrega</p>
                    <div className="text-sm text-black/80 dark:text-white/80 leading-relaxed space-y-1">
                      <div>
                          <span className="font-bold text-xs uppercase opacity-70 block">Dirección</span>
                          <p>{order.address.addressLine}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
                           <div>
                              <span className="font-bold text-xs uppercase opacity-70 block">Ciudad</span>
                              <p>{order.address.city}</p>
                           </div>
                           <div>
                              <span className="font-bold text-xs uppercase opacity-70 block">Barrio</span>
                              <p>{order.address.state}</p>
                           </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
                          {order.address.postalCode && (
                              <div>
                                  <span className="font-bold text-xs uppercase opacity-70 block">C. Postal</span>
                                  <p>{order.address.postalCode}</p>
                              </div>
                          )}
                           <div>
                              <span className="font-bold text-xs uppercase opacity-70 block">País</span>
                              <p>{order.address.country}</p>
                           </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-default"
              onMouseDown={handleContainerMouseDown}
              onClick={handleBackdropClick}
              {...containerHandlers}
            >
              <CustomPlusMinus
                value={`${Math.round(zoom * 100)}%`}
                onDecrease={handleZoomOut}
                onIncrease={handleZoomIn}
                disableDecrease={zoom <= 1}
                disableIncrease={zoom >= 3}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 border border-white/20 px-6 py-2 rounded-full backdrop-blur-md dark:border-white/20 dark:bg-black/60 z-50"
                iconSize={24}
                onClick={(e) => e.stopPropagation()}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <CustomClose
                  onClick={closeModal}
                  className="absolute -top-12 right-0 bg-transparent hover:bg-transparent text-white hover:text-gray-300 border-none w-auto h-auto shadow-none"
                  iconSize={32}
                />
                <img
                  src={selectedImage}
                  alt="Product Zoom"
                  className={`max-w-full max-h-[85vh] object-contain rounded-lg will-change-transform ${isDragging ? 'transition-none' : 'transition-transform duration-200 ease-out'
                    }`}
                  {...handlers}
                  style={{
                    transform: `scale(${zoom}) translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
                    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                    touchAction: 'none'
                  }}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div> {/* Closing the main content div */}

      <TransactionReceipt
        data={{
          reference: order.reference || 'N/A',
          date: order.created_at,
          transactionId: order.transactionId || 'N/A',
          paymentMethod: order.paymentMethod || 'No especificado',
          email: order.customer.email,
          total: Number(order.totalAmount || 0),
          status: order.paymentStatus || 'PENDING'
        }}
      />
    </>
  );
};
