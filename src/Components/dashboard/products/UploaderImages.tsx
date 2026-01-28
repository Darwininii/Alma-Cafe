import {
  type FieldErrors,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import type { ProductFormValues } from "../../../lib/validators";
import { useEffect, useState, useRef } from "react";
import { CustomClose } from "../../shared/CustomClose";
import { BadgeX, Upload } from "lucide-react";
import { CustomButton } from "../../shared/CustomButton";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      <CustomButton
        type="button"
        onClick={handleButtonClick}
        className="w-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 border-2 border-dashed border-neutral-300 dark:border-white/20 h-auto py-8 flex-col gap-2 rounded-2xl"
        effect="none"
      >
        <div className="bg-white dark:bg-black/40 p-3 rounded-full shadow-sm">
            <Upload className="w-6 h-6 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-lg">Elegir imágenes</span>
            <span className="text-xs text-neutral-400 font-medium">JPEG, PNG, WEBP</span>
        </div>
      </CustomButton>

      <div className="grid grid-cols-4 lg:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index}>
            <div className="border border-gray-200 w-full h-20 rounded-md p-1 relative lg:h-28 bg-white dark:bg-black/20">
              <img
                src={image.previewUrl}
                alt={`Preview ${index}`}
                className="rounded-md w-full h-full object-contain"
              />
              <CustomClose
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-3 -right-4 bg-white hover:bg-red-50 text-red-600 border border-red-100 shadow-sm z-10 w-7 h-7 p-0"
                iconSize={16}
                centerIcon={BadgeX}
                effect="magnetic"
              />
            </div>
          </div>
        ))}
      </div>

      {(formImages?.length === 0 || !formImages) && errors.images && (
        <p className="text-red-500 text-xs mt-1 font-medium bg-red-50 dark:bg-red-900/10 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/20">{errors.images.message}</p>
      )}
    </div>
  );
};
