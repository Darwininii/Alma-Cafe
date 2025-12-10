import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrder, useUser, useCustomer } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { IoChevronBack } from "react-icons/io5";
import { formatDate, formatPrice } from "@/helpers";
import { MapPinHouse, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const OrderUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(Number(id!));
  const { session } = useUser();
  const userId = session?.user?.id;
  const { data: customerProfile } = useCustomer(userId!);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading || !order) return <Loader />;

  // Helper to translate status
  const getStatusInSpanish = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pendiente";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Helper to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "completado":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const userAvatar = session?.user?.user_metadata?.avatar_url;
  const userInitials = customerProfile?.full_name
    ? customerProfile.full_name[0].toUpperCase()
    : "U";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          className="group inline-flex items-center gap-2 text-sm text-black hover:text-black/70 transition-colors mb-6 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoChevronBack className="group-hover:-translate-x-1 transition-transform text-black/70" size={20} />
          <span className="font-medium text-black/70">Volver a pedidos</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black/80 mb-2">
              Pedido #{id}
            </h1>
            <p className="text-sm text-black/70">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {getStatusInSpanish(order.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-black/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-black/20">
              <h2 className="text-lg font-semibold text-black/80">Artículos del pedido</h2>
            </div>

            <div className="divide-y divide-black/20">
              {order.orderItems.map((product, index) => (
                <div
                  key={index}
                  className="p-6 hover:bg-stone-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedImage(product.productImage?.[0] || null)}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.productImage?.[0] || "/placeholder.png"}
                        alt={product.productName}
                        className="h-24 w-24 object-cover rounded-xl border border-black/20"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-black/80 mb-1 truncate">
                        {product.productName}
                      </h3>
                      <p className="text-sm text-black/80 mb-3">
                        Precio unitario: {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-black/80">
                          Cantidad: <span className="font-medium text-black/80">{product.quantity}</span>
                        </span>
                      </div>
                    </div>

                    {/* Product Total */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-lg font-semibold text-black/80">
                        {formatPrice(product.price * product.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Address */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/20 p-6">
            <h2 className="text-lg font-semibold text-black/80 mb-4">Resumen del pedido</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-black/80">Subtotal</span>
                <span className="font-medium text-black/80">{formatPrice(order.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/80">Envío (Standard)</span>
                <span className="font-medium text-black/80">{formatPrice(0)}</span>
              </div>

              <div className="pt-3 border-t border-black/20">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-black/80">Total</span>
                  <span className="text-xl font-bold text-black/80">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Card - Redesigned */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/20  overflow-hidden">
            <div className="px-6 py-4 border-b border-black/20 bg-white/50">
              <h2 className="text-lg font-semibold text-black/80">Información de envío</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Section */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-black/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-black/80 font-bold border border-black/10">
                      {userInitials}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-black/80 uppercase tracking-wider mb-1">Cliente</p>
                  <p className="text-sm font-semibold text-black/80">{order.customer.full_name}</p>
                  <p className="text-sm text-black/80">{order.customer.email}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-black/50 w-full" />

              {/* Address Section */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-black/80">
                    <MapPinHouse size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-black/80 uppercase tracking-wider mb-1">Dirección de entrega</p>
                  <div className="text-sm text-black/80 leading-relaxed">
                    <p className="font-medium text-black/80">{order.address.addressLine}</p>
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
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-default"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
              </button>
              <img
                src={selectedImage}
                alt="Product Zoom"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
