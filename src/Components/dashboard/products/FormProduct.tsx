import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { type ProductFormValues, productSchema } from "../../../lib/validators";
import { CustomBack } from "../../shared/CustomBack";
import { useNavigate, useParams } from "react-router-dom";
import { SectionFormProduct } from "./SectionFormProduct";
import { InputForm } from "./InputForm";
import { FeaturesInput } from "./FeaturesInput";
import { useEffect } from "react";
import { generateSlug } from "../../../helpers";
import { UploaderImages } from "./UploaderImages";
import { Editor } from "./Editor";
import { useCreateProduct, useProduct, useUpdateProduct } from "../../../hooks";
import type { JSONContent } from "@tiptap/react";
import { Loader } from "@/Components/shared/Loader";
import { CustomButton } from "@/Components/shared/CustomButton";
import { CustomSelect } from "@/Components/shared/CustomSelect";

interface Props {
  titleForm: string;
}

export const FormProduct = ({ titleForm }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const { slug } = useParams<{ slug: string }>();

  const { product, isLoading } = useProduct(slug || "");
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdatePending } =
    useUpdateProduct(product?.id || "");

  const navigate = useNavigate();

  useEffect(() => {
    if (product && !isLoading) {
      setValue("name", product.name);
      setValue("slug", product.slug);
      setValue("brand", product.brand);
      setValue(
        "features",
        product.features.map((f: string) => ({ value: f }))
      );
      setValue("description", product.description as JSONContent);
      setValue("images", product.images);
      setValue("price", product.price);
      setValue("stock", product.stock || "Disponible");
      setValue("tag", product.tag || undefined);
    }
  }, [product, isLoading, setValue]);

  const onSubmit = handleSubmit((data) => {
    const features = data.features.map((feature: { value: string }) => feature.value);

    // Casting explícito para asegurar compatibilidad de tipos
    const productData = {
      id: product?.id,
      name: data.name,
      brand: data.brand,
      slug: data.slug,
      price: data.price,
      stock: data.stock,
      tag: (data.tag === "" ? null : data.tag) as "Nuevo" | "Promoción" | null,
      images: data.images,
      description: data.description,
      features,
    };

    if (slug) {
      updateProduct(productData);
    } else {
      createProduct(productData);
    }
  });

  const watchName = watch("name");

  useEffect(() => {
    if (!watchName) return;

    const generatedSlug = generateSlug(watchName);
    setValue("slug", generatedSlug, { shouldValidate: true });
  }, [watchName, setValue]);

  if (isPending || isUpdatePending || isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-8 relative max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg">
        <div className="flex items-center gap-4">
          <CustomBack 
            iconOnly 
            effect="shine"
            className="bg-white/50 hover:bg-black text-black dark:text-white dark:bg-black/30 dark:hover:bg-black hover:text-primary border border-white/20 shadow-sm"
          />
          <div>
            <h2 className="font-black tracking-tight text-3xl capitalize text-neutral-900 dark:text-white">
              {titleForm}
            </h2>
            <p className="text-neutral-500 font-medium text-sm">
              {slug ? "Edita la información del producto" : "Crea un nuevo producto para tu catálogo"}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <CustomButton
            effect="shine"
            effectColor="rgba(239, 68, 68, 0.2)"
            className="bg-transparent border border-black/20 dark:border-white/20 text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={() => navigate(-1)}
            type="button"
          >
            Cancelar
          </CustomButton>
          <CustomButton
            effect="shine"
            effectColor="rgba(255,255,255,0.5)"
            className="bg-primary text-white shadow-lg shadow-primary/30"
            onClick={onSubmit}
          >
            Guardar Producto
          </CustomButton>
        </div>
      </div>

      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-max flex-1 pb-24 lg:pb-0"
        onSubmit={onSubmit}
      >
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
            <SectionFormProduct
            titleSection="Información Básica"
            className="w-full"
            >
                <div className="grid gap-6">
                    <InputForm
                        type="text"
                        placeholder="Ej: Café Especial - Origen Tolima"
                        label="Nombre del Producto"
                        name="name"
                        register={register}
                        errors={errors}
                        required
                        className="font-bold text-lg"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputForm
                        type="text"
                        label="Slug (URL)"
                        name="slug"
                        placeholder="cafe-especial-origen-tolima"
                        register={register}
                        errors={errors}
                        />

                        <InputForm
                        type="text"
                        label="Marca"
                        name="brand"
                        placeholder="Alma Café"
                        register={register}
                        errors={errors}
                        required
                        />
                    </div>
                </div>
            </SectionFormProduct>

             <SectionFormProduct
                titleSection="Características"
                className="w-full"
            >
                <FeaturesInput control={control as any} errors={errors} />
            </SectionFormProduct>

             <SectionFormProduct
                titleSection="Descripción y Detalles"
                className="w-full"
              >
                <Editor
                    setValue={setValue}
                    errors={errors}
                    initialContent={product?.description as JSONContent}
                />
            </SectionFormProduct>
             
        </div>

        {/* Right Column: Key Details */}
        <div className="space-y-8 flex flex-col">
             <SectionFormProduct titleSection="Galería">
                <UploaderImages errors={errors} setValue={setValue} watch={watch} />
            </SectionFormProduct>

            <SectionFormProduct
            titleSection="Inventario y Precios"
            >
                <div className="grid grid-cols-1 gap-6">
                    <InputForm
                    type="number"
                    label="Precio ($)"
                    name="price"
                    placeholder="0.00"
                    register={register}
                    errors={errors}
                    required
                    className="font-mono text-lg"
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 ml-1">Disponibilidad</label>
                         <Controller
                            control={control}
                            name="stock"
                            render={({ field }) => (
                                <CustomSelect
                                    placeholder="Seleccionar..."
                                    options={[
                                        { value: "Disponible", label: "Disponible" },
                                        { value: "Agotado", label: "Agotado" },
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.stock?.message}
                                />
                            )}
                         />
                    </div>

                    <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 ml-1">Etiqueta</label>
                     <Controller
                        control={control}
                        name="tag"
                        render={({ field }) => (
                            <CustomSelect
                                placeholder="Sin etiqueta"
                                options={[
                                    { value: "", label: "Sin etiqueta" },
                                    { value: "Nuevo", label: "Nuevo" },
                                    { value: "Promoción", label: "Promoción" },
                                ]}
                                value={field.value || ""}
                                onChange={field.onChange}
                                error={errors.tag?.message}
                            />
                        )}
                     />
                    </div>
                </div>
            </SectionFormProduct>
        </div>

        {/* Mobile Action Bar */}
        <div className="lg:hidden flex gap-3 fixed bottom-4 right-4 left-4 z-40 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl">
          <CustomButton
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            className="flex-1 bg-primary text-white"
            type="submit"
            effect="shine"
          >
            Guardar
          </CustomButton>
        </div>
      </form>
    </div>
  );
};
