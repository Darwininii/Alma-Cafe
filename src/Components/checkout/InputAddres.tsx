import type { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";
import { CustomInput } from "../shared/CustomInput";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  className?: string;
  placeholder: string;
}

export const InputAddress = <T extends FieldValues>({
  register,
  errors,
  name,
  className,
  placeholder,
}: Props<T>) => {
  return (
    <CustomInput
      type="text"
      label={placeholder}
      className={className}
      {...register(name)}
      error={errors[name as string]?.message as string}
    />
  );
};
