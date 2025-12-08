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
      setValue("tag", product.tag || null);
    }
  }, [product, isLoading, setValue]);

  const onSubmit = handleSubmit((data) => {
    const features = data.features.map((feature) => feature.value);

    const productData = {
      id: product?.id,
      name: data.name,
      brand: data.brand,
      slug: data.slug,
      price: data.price,
      stock: data.stock,
      tag: data.tag || null,
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
    <div className="flex flex-col gap-6 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            className="bg-white p-1.5 rounded-md shadow-sm border border-slate-200 transition-all group hover:scale-105"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowBack
              size={18}
              className="transition-all group-hover:scale-125"
            />
          </button>
          <h2 className="font-bold tracking-tight text-2xl capitalize">
            {titleForm}
          </h2>
        </div>
      </div>

      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-max flex-1"
        onSubmit={onSubmit}
      >
        <SectionFormProduct
          titleSection="Detalles del Producto"
          className="lg:col-span-2 lg:row-span-2"
        >
          <InputForm
            type="text"
            placeholder="Ejemplo: Café Colombiano Premium"
            label="nombre"
            name="name"
            register={register}
            errors={errors}
            required
          />
          <FeaturesInput control={control} errors={errors} />
        </SectionFormProduct>

        <SectionFormProduct>
          <InputForm
            type="text"
            label="Slug"
            name="slug"
            placeholder="cafe-colombiano-premium"
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
          titleSection="Precio y Stock"
          className="lg:col-span-2"
        >
          <InputForm
            type="number"
            label="Precio"
            name="price"
            placeholder="5000"
            register={register}
            errors={errors}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Stock</label>
            <select
              className="border border-slate-200 rounded-md p-3"
              {...register("stock")}
            >
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
            </select>
            {errors.stock && (
              <p className="text-red-500 text-xs">{errors.stock.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tag (Opcional)</label>
            <select
              className="border border-slate-200 rounded-md p-3"
              {...register("tag")}
            >
              <option value="">Ninguno</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Promoción">Promoción</option>
            </select>
            {errors.tag && (
              <p className="text-red-500 text-xs">{errors.tag.message}</p>
            )}
          </div>
        </SectionFormProduct>

        <SectionFormProduct titleSection="Imágenes del producto">
          <UploaderImages errors={errors} setValue={setValue} watch={watch} />
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Descripción del producto"
          className="col-span-full"
        >
          <Editor
            setValue={setValue}
            errors={errors}
            initialContent={product?.description as JSONContent}
          />
        </SectionFormProduct>

        <div className="flex gap-3 absolute top-0 right-0">
          <button
            className="btn-secondary-outline"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button className="btn-primary" type="submit">
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  );
};
