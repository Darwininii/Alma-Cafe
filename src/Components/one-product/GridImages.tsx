import { useState } from "react";
import { ImageZoom } from "../shared/ImageZoom";

interface Props {
  images: string[];
}

export const GridImages = ({ images }: Props) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const handleImagesClick = (image: string) => {
    setActiveImage(image);
  };

  return (
    <div className="flex-1 flex flex-col gap-3 relative">
      <div className="bg-transparent h-[500px] p-4">
        <ImageZoom
          img={activeImage}
          alt="Imagen del Producto"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Miniatura */}
      <div className="flex mt-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImagesClick(image)}
            className={`w-16 h-16 p-1 border ${activeImage === image ? "border-black" : "border-transparent"
              } rounded-lg hover:border-black focus:outline-none`}
          >
            <img
              src={image}
              alt={`Thumbanail ${index + 1}`}
              className="w-full object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
