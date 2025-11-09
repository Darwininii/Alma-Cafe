import { getRandomProducts, getRecentProducts } from "@/actions";
import { useQueries } from "@tanstack/react-query";

export const useHomeProducts = () => {
  const results = useQueries({
    //[resultadoQuery1, resultadoQuery2]
    queries: [
      {
        queryKey: ["recentProducts"],
        queryFn: getRecentProducts,
      },
      {
        queryKey: ["popularProducts"],
        queryFn: getRandomProducts,
      },
    ],
  });

  const [recentProductsResults, popularProductsResults] = results;

  // Combinar los estados de las consultas
  const isLoading =
    recentProductsResults.isLoading || popularProductsResults.isLoading;
  const isError =
    recentProductsResults.isError || popularProductsResults.isError;

  return {
    recentProducts: recentProductsResults.data || [],
    popularProducts: popularProductsResults.data || [],
    isLoading,
    isError,
  };
};
