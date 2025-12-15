import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { AddressFormValues } from "../../lib/validators";
import { Input } from "../shared/Input";

interface Props {
  register: UseFormRegister<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;

  name: keyof AddressFormValues;
  className?: string;
  placeholder: string;
}

export const InputAddress = ({
  register,
  errors,
  name,
  className,
  placeholder,
}: Props) => {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      className={className}
      {...register(name)}
      error={errors[name]?.message}
    />
  );
};
