import { useQuery } from "@tanstack/react-query";
import { getOrderByIdAdmin } from "../../actions";

export const useOrderAdmin = (id: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["order", "admin", id],
    queryFn: () => getOrderByIdAdmin(id), // Assuming id is passed as string, wait, the hook takes number. The DB uses UUID.
    // The previous code had (id: number) but getOrderById takes string orderId.
    // Let's check parameters types in action.
    enabled: !!id,
    retry: false,
  });

  return {
    data,
    isLoading,
  };
};
