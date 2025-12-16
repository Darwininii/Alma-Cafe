import { type Control, type FieldErrors, useFieldArray } from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validators";
import { useState } from "react";
import { CustomInput } from "../../shared/CustomInput";
import { CustomButton } from "../../shared/CustomButton";
import { X, Plus } from "lucide-react";

interface Props {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const FeaturesInput = ({ control, errors }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const [newFeature, setNewFeature] = useState("");

  const handleAddFeature = () => {
    if (newFeature.trim() === "") return;

    append({ value: newFeature });
    setNewFeature("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Lista de características */}
      {fields.length > 0 && (
        <ul className="space-y-2">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="group flex items-center justify-between gap-3 bg-neutral-50 dark:bg-white/5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 transition-all hover:bg-white dark:hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                  {field.value}
                </span>
              </div>

              <CustomButton
                onClick={() => remove(index)}
                className="text-neutral-400 hover:text-red-500 transition-colors p-1 h-auto bg-transparent hover:bg-transparent"
                size="icon"
                effect="none"
                centerIcon={X}
                iconSize={14}
              >
                <span className="sr-only">Eliminar</span>
              </CustomButton>
            </li>
          ))}
        </ul>
      )}

      {/* Input para agregar nueva */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <CustomInput
            type="text"
            label="Agregar Característica"
            placeholder="Ej: Acidez media-alta"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={handleKeyDown}
            error={errors.features?.message}
            containerClassName="w-full"
          />
        </div>
        <CustomButton
          onClick={handleAddFeature}
          className="bg-neutral-900 dark:bg-white text-white dark:text-black h-10 w-10 rounded-[14px] flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          disabled={!newFeature.trim()}
          size="icon"
          effect="none"
          centerIcon={Plus}
          iconSize={20}
        />
      </div>

      {errors.features && (
        <p className="text-red-500 text-xs mt-1 font-medium">{errors.features.message}</p>
      )}
    </div>
  );
};
