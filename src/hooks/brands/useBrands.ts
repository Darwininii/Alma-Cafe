import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/actions/brand";
import type { BrandInput } from "@/interfaces/brand.interface";
import { toast } from "react-hot-toast";

export const useBrands = () => {
    const queryClient = useQueryClient();

    const { data: brands, isLoading, error } = useQuery({
        queryKey: ["brands"],
        queryFn: getBrands,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const createBrandMutation = useMutation({
        mutationFn: createBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            toast.success("Marca creada correctamente");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const updateBrandMutation = useMutation({
        mutationFn: ({ id, brand }: { id: string; brand: BrandInput }) =>
            updateBrand(id, brand),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            toast.success("Marca actualizada correctamente");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteBrandMutation = useMutation({
        mutationFn: deleteBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            toast.success("Marca eliminada correctamente");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return {
        brands,
        isLoading,
        error,
        createBrand: createBrandMutation.mutateAsync,
        updateBrand: updateBrandMutation.mutateAsync,
        deleteBrand: deleteBrandMutation.mutateAsync,
        isCreating: createBrandMutation.isPending,
        isUpdating: updateBrandMutation.isPending,
        isDeleting: deleteBrandMutation.isPending,
    };
};
