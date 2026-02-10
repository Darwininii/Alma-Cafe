import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../actions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["product"],
      });
      toast.success("Producto actualizado");
      navigate("/dashboard/productos");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Ocurrió un error al actualizar el producto");
    },
  });

  return {
    mutate,
    isPending,
  };
};
