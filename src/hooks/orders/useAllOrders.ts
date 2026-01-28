import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../actions";

export const useAllOrders = ({ page, searchTerm = "" }: { page?: number, searchTerm?: string } = {}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders", "admin", page, searchTerm],
    queryFn: () => getAllOrders({ page, searchTerm }),
    placeholderData: (previousData) => previousData, 
  });

  return {
    orders: data?.data,
    totalOrders: data?.count,
    isLoading,
  };
};
