import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/actions";

export const useAllProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", "all"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    products: data,
    isLoading,
    error,
  };
};
