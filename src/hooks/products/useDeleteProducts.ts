import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../../actions";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Producto eliminado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Ocurrió un error al eliminar el producto");
    },
  });

  return {
    mutate,
    isPending,
  };
};
