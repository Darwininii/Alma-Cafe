import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../actions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Producto creado exitosamente");
      // Navegar a la lista para ver las imágenes reales de Supabase
      setTimeout(() => navigate("/dashboard/productos"), 1000);
    },
    onError: (error) => {
      toast.error("Ocurrió un error al crear el producto");
      console.log(error);
    },
  });

  return {
    mutate,
    isPending,
  };
};
