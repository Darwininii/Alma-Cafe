import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { AddressFormValues } from "../../lib/validators";

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
    <>
      <div
        className={`border border-2 border-black/60 rounded-xl text-black font-bold overflow-hidden py-2 ${errors[name] && "border-red-500 font-bold"
          } ${className}`}
      >
        <input
          type="text"
          className="w-full px-3 py-1 text-sm focus:outline-none"
          placeholder={placeholder}
          {...register(name)}
        />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name].message}</p>
      )}
    </>
  );
};
