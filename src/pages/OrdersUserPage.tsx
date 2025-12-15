import { Link } from "react-router-dom";
import { useOrders } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { TableOrders } from "../Components/orders/TableOrders";
import { CustomBadge } from "../Components/shared/CustomBadge";

export const OrdersUserPage = () => {
  const { data: orders, isLoading } = useOrders();

  if (isLoading || !orders) return <Loader />;

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex gap-2">
        <h1 className="text-3xl font-bold dark:text-white/90 text-black">Pedidos</h1>
        <CustomBadge
          count={orders.length}
          className="w-6 h-6 bg-black/70 text-white font-black text-[13px] mt-1"
        />
      </div>

      {orders.length === 0 ? (
        <>
          <p className="text-slate-600 text-[13px]">
            Todavía no has hecho ningún pedido
          </p>
          <Link
            to="/celulares"
            className="bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full px-8"
          >
            Empezar a comprar
          </Link>
        </>
      ) : (
        <TableOrders orders={orders} />
      )}
    </div>
  );
};
