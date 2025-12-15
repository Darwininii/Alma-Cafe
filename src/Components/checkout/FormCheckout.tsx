import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { type AddressFormValues, addressSchema } from "../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemsCheckout } from "./ItemsCheckout";
import { useCreateOrder } from "../../hooks";
import { useCartStore } from "../../store/cart.store";
import { InputAddress } from "./InputAddres";
import { motion } from "framer-motion";
import { MdPayments } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { ReceiptText } from "lucide-react";
import { Loader } from "../shared/Loader";

export const FormCheckout = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const { mutate: createOrder, isPending } = useCreateOrder();

  const cleanCart = useCartStore((state) => state.cleanCart);
  const cartItems = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const removeItem = useCartStore((state) => state.removeItem);

  const onSubmit = handleSubmit((data) => {
    // 1. Filtrar items con IDs válidos (UUIDs)
    const validItems = cartItems.filter((item) => {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId);
      if (!isUUID) {
        console.warn(`[FormCheckout] Skipping invalid item: ${item.productId}`);
        // Opcional: limpiar del store también
        removeItem(item.productId);
      }
      return isUUID;
    });

    if (validItems.length === 0) {
      toast.error("Tu carrito contenía items inválidos y ha sido limpiado. Por favor agrega los productos nuevamente.");
      return;
    }

    const orderInput = {
      address: data,
      cartItems: validItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      customerId: 0,
      totalAmount,
    };

    createOrder(orderInput, {
      onSuccess: () => {
        cleanCart();
      },
    });
  });

  if (isPending) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-5 h-screen items-center justify-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 blur-2xl opacity-30 animate-pulse" />
          <Loader className="relative text-black" />
        </div>
        <p className="text-lg font-bold text-black">Procesando tu pedido...</p>
        <p className="text-sm text-black/60">Por favor espera un momento</p>
      </motion.div>
    );
  }

  return (
    <div>
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        {/* Delivery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none rounded-2xl" />

          <div className="relative space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-rose-600 rounded-lg">
                <PiMapPinAreaFill className="text-white" size={22} />
              </div>
              <h3 className="text-2xl font-black text-black">Dirección de Entrega</h3>
            </div>

            <InputAddress
              register={register}
              errors={errors}
              name="addressLine"
              placeholder="Dirección principal"
            />

            <InputAddress
              register={register}
              errors={errors}
              name="state"
              placeholder="Barrio"
            />

            <InputAddress
              register={register}
              errors={errors}
              name="country"
              placeholder="País"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputAddress
                register={register}
                errors={errors}
                name="city"
                placeholder="Ciudad"
              />

              <InputAddress
                register={register}
                errors={errors}
                name="postalCode"
                placeholder="Código Postal (Opcional)"
              />

            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/60 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MdPayments className="text-white" size={20} />
              </div>
              <span className="font-black text-blue-900">Depósito Bancario</span>
            </div>

            <div className="p-6 space-y-2 text-sm text-black/80 bg-white/30">
              <p className="font-bold text-black">
                <ReceiptText size={20} /> Información de Transferencia </p>
              <div className="space-y-1 pl-4">
                <p><span className="font-semibold">Banco:</span> BANCO PICHINCHA</p>
                <p><span className="font-semibold">Razón Social:</span> Alma Café</p>
                <p><span className="font-semibold">RUC:</span> 123456789000</p>
                <p><span className="font-semibold">Tipo de cuenta:</span> Corriente</p>
                <p><span className="font-semibold">Número de cuenta:</span> 1234567890</p>
              </div>
              <p className="text-xs text-black/60 italic pt-2">
                💡 La información será compartida nuevamente una vez finalizada la compra
              </p>
            </div>
          </div>
        </motion.div>

        {/* Order Summary - Mobile Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:hidden relative bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none rounded-2xl" />

          <div className="relative">
            <h3 className="font-black text-2xl text-black mb-6">Resumen del Pedido</h3>
            <ItemsCheckout />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="cursor-pointer group relative bg-gradient-to-r from-black via-gray-900 to-black text-white py-5 font-black text-lg tracking-wide rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <MdPayments size={24} />
            Finalizar Pedido
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-rose-500/80 opacity-1 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </form>
    </div>
  );
};
