import { Link } from "react-router-dom";
import { useOrders } from "../hooks";
import { Loader } from "../Components/shared/Loader";
import { TableOrders } from "../Components/orders/TableOrders";

export const OrdersUserPage = () => {
  const { data: orders, isLoading } = useOrders();

  if (isLoading || !orders) return <Loader />;

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex gap-2">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <span className="w-6 h-6 rounded-full bg-black/70 text-white font-black text-[13px] flex justify-center items-center mt-1">
          {orders.length}
        </span>
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
