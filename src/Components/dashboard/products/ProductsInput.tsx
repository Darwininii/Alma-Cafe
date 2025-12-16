import {
  type Control,
  useFieldArray,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validators";
import { CustomInput } from "../../shared/CustomInput";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CustomButton } from "../../shared/CustomButton";
import { CustomClose } from "../../shared/CustomClose";

interface Props {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}

const headersVariants = ["Stock", "Precio", "Capacidad", ""];

export const ProductsInput = ({ control, errors, register }: Props) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: "products",
  });

  const addVariant = () => {
    append({
      stock: "",
      price: 0,
    });
  };

  const removeVariant = (index: number) => {
    remove(index);
  };

  const getFirstError = (
    variantErros: FieldErrors<NonNullable<ProductFormValues["products"]>[number]>
  ) => {
    if (variantErros) {
      const keys = Object.keys(variantErros) as (keyof typeof variantErros)[];
      if (keys.length > 0) {
        return variantErros[keys[0]]?.message;
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div className="grid grid-cols-5 gap-4 justify-start">
          {headersVariants.map((header, index) => (
            <p key={index} className="text-xs font-semibold text-slate-800">
              {header}
            </p>
          ))}
        </div>
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="grid grid-cols-5 gap-4 items-center">
              <CustomInput
                type="number"
                placeholder="Stock"
                {...register(`products.${index}.stock`, {
                  valueAsNumber: true,
                })}
                className="font-semibold"
                containerClassName="bg-white dark:bg-stone-900"
              />

              <CustomInput
                type="number"
                step="100"
                placeholder="Precio"
                {...register(`products.${index}.price`, {
                  valueAsNumber: true,
                })}
                className="font-semibold"
                containerClassName="bg-white dark:bg-stone-900"
              />

              <div className="flex justify-end">
                <CustomClose
                  onClick={() => removeVariant(index)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500 rounded-full transition-colors w-8 h-8"
                  iconSize={20}
                />
              </div>
            </div>

            {errors.products && errors.products[index] && (
              <p className="text-red-500 text-xs mt-1">
                {getFirstError(errors.products[index])}
              </p>
            )}
          </div>
        ))}
      </div>

      <CustomButton
        onClick={addVariant}
        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md text-sm font-semibold tracking-tight self-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        leftIcon={IoIosAddCircleOutline}
        iconSize={18}
      >
        Añadir Variante
      </CustomButton>

      {fields.length === 0 && errors.products && (
        <p className="text-red-500 text-xs mt-1">
          Debes añadir al menos una variante
        </p>
      )}
    </div>
  );
};
