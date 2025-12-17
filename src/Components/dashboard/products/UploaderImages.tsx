import {
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validators";
import { useEffect, useState } from "react";
import { CustomClose } from "../../shared/CustomClose";
import { BadgeX } from "lucide-react";

interface ImagePreview {
  file?: File;
  previewUrl: string;
}

interface Props {
  setValue: UseFormSetValue<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export const UploaderImages = ({ setValue, errors, watch }: Props) => {
  const [images, setImages] = useState<ImagePreview[]>([]);

  // Verificar si hay errores con las imágenes
  const formImages = watch("images");

  // Cargar imágenes existentes si las hay en el formulario
  useEffect(() => {
    if (formImages && formImages.length > 0 && images.length == 0) {
      const existingImages = formImages.map((url) => ({
        previewUrl: url,
      }));
      setImages(existingImages);

      // Actualizar el valor del formulario
      setValue("images", formImages);
    }
  }, [formImages, images.length, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      const updatedImages = [...images, ...newImages];

      setImages(updatedImages);

      setValue(
        "images",
        updatedImages.map((img) => img.file || img.previewUrl)
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    setValue(
      "images",
      updatedImages.map((img) => img.file || img.previewUrl)
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        onChange={handleImageChange}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
      />

      <div className="grid grid-cols-4 lg:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index}>
            <div className="border border-gray-200 w-full h-20 rounded-md p-1 relative lg:h-28">
              <img
                src={image.previewUrl}
                alt={`Preview ${index}`}
                className="rounded-md w-full h-full object-contain"
              />
              <CustomClose
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-3 -right-4 bg-black/10 hover:bg-black/80 text-red-600 hover:text-white dark:text-red-600 dark:bg-white dark:hover:bg-black/80 dark:hover:text-white rounded-full border border-red-100 shadow-sm z-10 w-6 h-6 p-0"
                iconSize={16}
                centerIcon={BadgeX}
                effect="magnetic"
              />
            </div>
          </div>
        ))}
      </div>

      {formImages?.length === 0 && errors.images && (
        <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>
      )}
    </>
  );
};
