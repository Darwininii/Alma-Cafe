import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type ProductFormValues, productSchema } from "../../../lib/validators";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { generateSlug } from "../../../helpers";
import { InputForm } from "./InputForm";
import { SectionFormProduct } from "./SectionFormProduct";
import { FeaturesInput } from "./FeaturesInput";
import { VariantsInput } from "./VariantsInput";
import { UploaderImages } from "./UploaderImages";
import { Editor } from "./Editor";

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

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const watchName = watch("name");

  useEffect(() => {
    if (!watchName) return;

    const generatedSlug = generateSlug(watchName);
    setValue("slug", generatedSlug, { shouldValidate: true });
  }, [watchName, setValue]);

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
            placeholder="Ejemplo: Perro Caliente"
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
            label="Etuiqueta"
            name="slug"
            placeholder="Perro-Caliente"
            register={register}
            errors={errors}
          />

          <InputForm
            type="text"
            label="Marca"
            name="brand"
            placeholder="Marca del Producto"
            register={register}
            errors={errors}
            required
          />
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Variantes del Producto"
          className="lg:col-span-2 h-fit"
        >
          <VariantsInput
            control={control}
            errors={errors}
            register={register}
          />
        </SectionFormProduct>

        <SectionFormProduct titleSection="Imágenes del producto">
          <UploaderImages errors={errors} setValue={setValue} watch={watch} />
        </SectionFormProduct>

        <SectionFormProduct
          titleSection="Descripción del producto"
          className="col-span-full"
        >
          <Editor setValue={setValue} errors={errors} />
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
