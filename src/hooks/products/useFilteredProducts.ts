import { getFilteredProducts } from "@/actions";
import { useQuery } from "@tanstack/react-query";

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
    queryFn: () => getFilteredProducts({ page, brands, search }),
    retry: false,
  });

  return {
    data: data?.data,
    isLoading,
    totalProducts: data?.count ?? 0,
  };
};
