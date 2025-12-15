import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type ProductFormValues, productSchema } from "../../../lib/validators";
import { IoIosArrowBack } from "react-icons/io";
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
    const features = data.features.map((feature) => feature.value);

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
          <CustomButton
            size="icon"
            effect="magnetic"
            className="bg-white/50 hover:bg-white text-neutral-600 hover:text-black border border-white/20 shadow-sm"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack size={20} />
          </CustomButton>
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
            className="bg-transparent border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
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
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-max flex-1"
        onSubmit={onSubmit}
      >
        <SectionFormProduct
          titleSection="Información Principal"
          className="lg:col-span-2 lg:row-span-2"
        >
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
          <FeaturesInput control={control} errors={errors} />
        </SectionFormProduct>

        <SectionFormProduct titleSection="Identificación">
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
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Inventario y Precios"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputForm
              type="number"
              label="Precio ($)"
              name="price"
              placeholder="0.00"
              register={register}
              errors={errors}
              required
              className="font-mono"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 ml-1">Estado del Stock</label>
              <div className="relative">
                <select
                  className="w-full h-10 bg-white dark:bg-black/50 border border-neutral-200 dark:border-white/20 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                  {...register("stock")}
                >
                  <option value="Disponible">🟢 Disponible</option>
                  <option value="Agotado">🔴 Agotado</option>
                </select>
              </div>
              {errors.stock && (
                <p className="text-red-500 text-xs ml-1">{errors.stock.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300 ml-1">Etiqueta Promocional</label>
              <div className="relative">
                <select
                  className="w-full h-10 bg-white dark:bg-black/50 border border-neutral-200 dark:border-white/20 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                  {...register("tag")}
                >
                  <option value="">Ninguna</option>
                  <option value="Nuevo">✨ Nuevo</option>
                  <option value="Promoción">🔥 Promoción</option>
                </select>
              </div>
              {errors.tag && (
                <p className="text-red-500 text-xs ml-1">{errors.tag.message}</p>
              )}
            </div>
          </div>
        </SectionFormProduct>

        <SectionFormProduct titleSection="Galería de Imágenes">
          <UploaderImages errors={errors} setValue={setValue} watch={watch} />
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Descripción Detallada"
          className="col-span-full"
        >
          <Editor
            setValue={setValue}
            errors={errors}
            initialContent={product?.description as JSONContent}
          />
        </SectionFormProduct>

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
