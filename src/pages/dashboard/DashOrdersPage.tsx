import { useAllOrders } from "@/hooks";
import { TableOrdersAdmin } from "../../Components/dashboard";
import { Loader } from "../../Components/shared/Loader";

export const DashOrdersPage = () => {
  const { data, isLoading } = useAllOrders();

  if (isLoading || !data) return <Loader />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Órdenes</h1>

      <TableOrdersAdmin orders={data} />
    </div>
  );
};
