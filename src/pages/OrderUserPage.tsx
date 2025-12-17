import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrder, useUser, useCustomer, useOrders, useImageZoom } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { IoChevronBack, IoChevronForward, IoChevronDown } from "react-icons/io5";
import { formatDate, formatPrice } from "@/helpers";
import { MapPinHouse } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CustomButton } from "../Components/shared/CustomButton";
import { CustomClose } from "../Components/shared/CustomClose";
import { CustomPlusMinus } from "../Components/shared/CustomPlusMinus";
import { OrderStatusBadge } from "../Components/shared/OrderStatusBadge";

export const OrderUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(Number(id!));
  const { data: allOrders } = useOrders(); // Fetch all orders for navigation
  const { session } = useUser();
  const userId = session?.user?.id;
  const { data: customerProfile } = useCustomer(userId!);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);
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

  const closeModal = () => {
    setSelectedImage(null);
    resetZoom();
  };

  if (isLoading || !order) return <Loader />;



  const userAvatar = session?.user?.user_metadata?.avatar_url;
  const userInitials = customerProfile?.full_name
    ? customerProfile.full_name[0].toUpperCase()
    : "U";

  // Navigation Logic
  // List is sorted descending by date (Newest first).
  // Next Button -> Newer Order (Higher ID) -> Lower Index
  // Prev Button -> Older Order (Lower ID) -> Higher Index
  const currentIndex = allOrders?.findIndex((o) => o.id === Number(id)) ?? -1;
  const nextOrder = currentIndex > 0 ? allOrders?.[currentIndex - 1] : null; // Newer
  const prevOrder = currentIndex !== -1 && currentIndex < (allOrders?.length || 0) - 1 ? allOrders?.[currentIndex + 1] : null; // Older

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <CustomButton
          className="group inline-flex items-center gap-2 text-sm text-black dark:text-amber-500 dark:hover:text-amber-600 hover:text-black/70 hover:font-black transition-colors mb-6 cursor-pointer bg-transparent py-2 px-2 shadow-none border-none h-auto hover:bg-transparent"
          onClick={() => navigate("/account/pedidos")}
          effect="bounce"
          leftIcon={IoChevronBack}
          iconSize={20}
        >
          <span className="font-medium text-black/70 dark:text-amber-500 dark:hover:text-amber-600 hover:font-black">Volver a Pedidos</span>
        </CustomButton>

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
          <div>
            <OrderStatusBadge status={order.status} className="px-4 py-1 text-sm" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={product.productImage?.[0] || "/placeholder.png"}
                              alt={product.productName}
                              className="h-24 w-24 object-cover rounded-xl border border-black/20 dark:border-white/20"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-black/80 dark:text-white mb-1 truncate">
                              {product.productName}
                            </h3>
                            <p className="text-sm text-black/80 dark:text-white/80 font-bold mb-3">
                              Precio unitario: {formatPrice(product.price)}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-black/80 dark:text-white/80">
                                Cantidad: <span className="font-bold text-black/80 dark:text-white/80">{product.quantity}</span>
                              </span>
                            </div>
                          </div>

                          {/* Product Total */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-lg font-black text-black/80 dark:text-white/80">
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

        {/* Right Column - Summary & Address */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white/80 dark:bg-[#210F37] rounded-2xl shadow-sm border border-black/20 p-6">
            <h2 className="text-lg font-bold text-black/80 dark:text-white mb-4">Resumen del pedido</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-black/80 dark:text-white/80">Subtotal</span>
                <span className="font-bold text-black/80 dark:text-white/80">{formatPrice(order.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/80 dark:text-white/80">Envío (Estándar)</span>
                <span className="font-bold text-black/80 dark:text-white/80">{formatPrice(0)}</span>
              </div>

              <div className="pt-3 border-t border-black/20 dark:border-white/20">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-black/80 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-black/80 dark:text-white">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Card - Redesigned */}
          <div className="bg-white/80 dark:bg-[#210F37] rounded-2xl shadow-sm border border-black/20 dark:border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-black/20 bg-white/50 dark:border-white/20">
              <h2 className="text-lg font-semibold dark:font-bold text-black/80 dark:text-black">Información de envío</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Section */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
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
                  <p className="text-sm text-black/80 dark:text-white">{order.customer.email}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-black/50 dark:bg-white/50 w-full" />

              {/* Address Section */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/50 flex items-center justify-center text-black/80 border border-black/30 dark:border-white/30">
                    <MapPinHouse size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-black/80 dark:text-white/80 uppercase tracking-wider mb-1">Dirección de entrega</p>
                  <div className="text-sm text-black/80 dark:text-white/80 leading-relaxed">
                    <p className="font-medium text-black/80 dark:text-white">{order.address.addressLine}</p>
                    <p>{order.address.city}, {order.address.state}</p>
                    {order.address.postalCode && <p>{order.address.postalCode}</p>}
                    <p>{order.address.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-default"
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
            >
              <CustomClose
                onClick={closeModal}
                className="absolute -top-12 right-0 bg-transparent hover:bg-transparent text-white hover:text-gray-300 border-none w-auto h-auto shadow-none"
                iconSize={32}
              />
              <img
                src={selectedImage}
                alt="Product Zoom"
                className="max-w-full max-h-[85vh] object-contain rounded-lg transition-transform duration-200 ease-out"
                onClick={(e) => e.stopPropagation()}
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
    </div>
  );
};
