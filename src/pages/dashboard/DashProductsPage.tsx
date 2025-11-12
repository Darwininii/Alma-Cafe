import { TableProduct } from "@/Components/dashboard";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export const DashProductsPage = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      <Link
        to="/dashboard/productos/new"
        className="bg-black text-white flex items-center self-end py-1.5 px-2 rounded-md text-sm gap-1 font-semibold"
      >
        <IoAddCircleOutline className="inline-block" />
        Nuevo Producto
      </Link>

      <TableProduct />
    </div>
  );
};
