import { getProductBySlug } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/interfaces";

export const useProduct = (slug: string) => {
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
        const data = await getProductBySlug(slug);
        return data as unknown as Product;
    },
    retry: false,
  });

  return {
    product,
    isError,
    isLoading,
  };
};
