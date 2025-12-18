import { useState } from "react";
import { useBrands } from "@/hooks";
import { Loader } from "@/Components/shared/Loader";
import type { Brand, BrandInput } from "@/interfaces/brand.interface";
import { CustomButton } from "@/Components/shared/CustomButton";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { BrandForm } from "@/Components/dashboard/brands/BrandForm";
import { DashAddButton } from "@/Components/dashboard/DashAddButton";

export const BrandsPage = () => {
    const { brands, isLoading, createBrand, updateBrand, deleteBrand, isCreating, isUpdating } = useBrands();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const handleSubmit = async (data: BrandInput) => {
        try {
            if (editingBrand) {
                await updateBrand({ id: editingBrand.id, brand: data });
            } else {
                await createBrand(data);
            }
            setIsFormOpen(false);
            setEditingBrand(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de eliminar esta marca?")) {
            await deleteBrand(id);
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingBrand(null);
    };

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-black dark:text-white">Gestión de Marcas</h1>
                {!isFormOpen && (
                    <DashAddButton
                        onClick={() => setIsFormOpen(true)}
                        icon={FaPlus}
                    >
                        Nueva Marca
                    </DashAddButton>
                )}
            </div>

            {isFormOpen ? (
                <BrandForm
                    brandToEdit={editingBrand}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isCreating || isUpdating}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brands?.map((brand) => (
                        <div
                            key={brand.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-black dark:text-white">{brand.name}</h3>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CustomButton
                                        onClick={() => handleEdit(brand)}
                                        className="bg-transparent text-blue-400 hover:bg-blue-400/20 hover:text-blue-500 border-none"
                                        size="icon"
                                        centerIcon={FaEdit}
                                        title="Editar marca"
                                    />
                                    <CustomButton
                                        onClick={() => handleDelete(brand.id)}
                                        className="bg-transparent text-red-400 hover:bg-red-400/20 hover:text-red-500 border-none"
                                        size="icon"
                                        centerIcon={FaTrash}
                                        title="Eliminar marca"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Slug: {brand.slug}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {brand.keywords?.map((keyword, idx) => (
                                        <span key={idx} className="text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md text-neutral-600 dark:text-neutral-300 border border-black/5 dark:border-white/5">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {brands?.length === 0 && (
                        <div className="col-span-full py-10 text-center text-neutral-500">
                            No hay marcas registradas. ¡Crea una nueva!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
