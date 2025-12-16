import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validators";

interface Props {
  className?: string;
  label: string;
  placeholder?: string;
  type: string;
  name: keyof ProductFormValues;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  required?: boolean;
}

import { CustomInput } from "../../shared/CustomInput";

export const InputForm = ({
  className,
  label,
  placeholder,
  type,
  name,
  register,
  errors,
  required,
}: Props) => {
  return (
    <CustomInput
      type={type}
      label={required ? `${label} *` : label}
      placeholder={placeholder}
      className={className}
      containerClassName=""
      {...register(name, {
        valueAsNumber: type === "number",
      })}
      error={errors[name]?.message as string}
    />
  );
};
