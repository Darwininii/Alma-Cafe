import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CustomInput } from "@/Components/shared/CustomInput";
import { CustomButton } from "@/Components/shared/CustomButton";
import type { Brand, BrandInput } from "@/interfaces/brand.interface";
import { IoClose } from "react-icons/io5";

interface Props {
    brandToEdit?: Brand | null;
    onSubmit: (data: BrandInput) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export const BrandForm = ({ brandToEdit, onSubmit, onCancel, isLoading }: Props) => {
    const { register, handleSubmit, setValue, watch } = useForm<BrandInput>({
        defaultValues: {
            name: "",
            slug: "",
            keywords: [],
        },
    });

    const [keywordsInput, setKeywordsInput] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const nameValue = watch("name");

    useEffect(() => {
        if (brandToEdit) {
            setValue("name", brandToEdit.name);
            setValue("slug", brandToEdit.slug);
            setKeywords(brandToEdit.keywords || []);
        }
    }, [brandToEdit, setValue]);

    useEffect(() => {
        // Auto-generate slug from name if not editing
        if (!brandToEdit && nameValue) {
            setValue("slug", nameValue.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
        }
    }, [nameValue, brandToEdit, setValue])


    const handleAddKeyword = () => {
        if (!keywordsInput.trim()) return;
        if (keywords.includes(keywordsInput.trim())) return;

        const newKeywords = [...keywords, keywordsInput.trim()];
        setKeywords(newKeywords);
        setKeywordsInput("");
    };

    const removeKeyword = (keywordToRemove: string) => {
        setKeywords(keywords.filter(k => k !== keywordToRemove));
    };

    const onFormSubmit = (data: BrandInput) => {
        onSubmit({ ...data, keywords });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddKeyword();
        }
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                {brandToEdit ? "Editar Marca" : "Nueva Marca"}
            </h2>

            <div className="space-y-4">
                <CustomInput
                    label="Nombre de la Marca"
                    placeholder="Ej: Café Quindio"
                    {...register("name", { required: true })}
                    containerClassName="w-full"
                    className="text-black dark:text-white"
                />

                <CustomInput
                    label="Slug"
                    placeholder="ej: cafe-quindio"
                    {...register("slug", { required: true })}
                    containerClassName="w-full"
                    className="text-black dark:text-white"
                    readOnly={!!brandToEdit} // Slug usually shouldn't change to avoid breaking URLs, but editable is fine too.
                />

                <div>
                    <label className="text-sm text-neutral-500 mb-2 block">Variaciones / Palabras Clave (Enter para agregar)</label>
                    <div className="flex gap-2 mb-2">
                        <CustomInput
                            placeholder="Ej: cafe, tinto, coffee"
                            value={keywordsInput}
                            onChange={(e) => setKeywordsInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            containerClassName="w-full"
                            className="text-black dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={handleAddKeyword}
                            className="bg-black/10 dark:bg-white/10 p-2 rounded-xl text-black dark:text-white hover:bg-black/20 transition-colors"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {keywords.map(k => (
                            <span key={k} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {k}
                                <button type="button" onClick={() => removeKeyword(k)} className="hover:text-red-500"><IoClose /></button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <CustomButton
                    type="button"
                    onClick={onCancel}
                    className="bg-transparent border border-neutral-500 text-neutral-500 hover:bg-neutral-500/10"
                >
                    Cancelar
                </CustomButton>
                <CustomButton
                    type="submit"
                    className="bg-primary hover:bg-primary/80 text-white"
                    disabled={isLoading}
                >
                    {isLoading ? "Guardando..." : "Guardar"}
                </CustomButton>
            </div>
        </form>
    );
};

import { FaPlus } from "react-icons/fa6";
