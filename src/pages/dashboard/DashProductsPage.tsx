import { TableProduct, DashAddButton } from "@/Components/dashboard";
import { PackagePlus } from "lucide-react";

export const DashProductsPage = () => {
  return (
    <div className="h-full flex flex-col gap-2">
      <DashAddButton
        to="/dashboard/productos/new"
        className="self-end"
        icon={PackagePlus}
      >
        Nuevo Producto
      </DashAddButton>

      <TableProduct />
    </div>
  );
};
