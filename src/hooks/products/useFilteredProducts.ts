import { getFilteredProducts } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/interfaces";

export const useFilteredProducts = ({
  page,
  brands,
  search,
}: {
  page: number;
  brands: string[];
  search?: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["filteredProducts", page, brands, search],
    queryFn: async () => {
        const response = await getFilteredProducts({ page, brands, search });
        return {
            ...response,
            data: response.data as unknown as Product[],
        };
    },
    retry: false,
  });

  return {
    data: data?.data,
    isLoading,
    totalProducts: data?.count ?? 0,
  };
};
