import { useState } from "react";
import { ImageZoom } from "../shared/ImageZoom";
import { CustomClose } from "../shared/CustomClose";
import { CustomPlusMinus } from "../shared/CustomPlusMinus";
import { CustomButton } from "../shared/CustomButton";
import { ZoomIn } from "lucide-react";

interface Props {
  images: string[];
}

export const GridImages = ({ images }: Props) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleImagesClick = (image: string) => {
    setActiveImage(image);
  };

  const openModal = () => {
    setIsOpen(true);
    setZoom(1);
  };

  const closeModal = () => {
    setIsOpen(false);
    setZoom(1);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  return (
    <div className="flex-1 flex flex-col gap-3 relative max-w-xl mx-auto md:mx-0">
      <div
        className="bg-white/10 backdrop-blur-sm h-[500px] md:h-[500px] w-full p-4 rounded-3xl relative shadow-sm flex items-center justify-center cursor-zoom-in"
        onClick={openModal}
      >
        <ImageZoom
          img={activeImage}
          alt="Imagen del Producto"
          className="w-full h-full"
        />
      </div>

      {/* Miniaturas */}
      <div className="flex mt-4 gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <CustomButton
            key={index}
            onClick={() => handleImagesClick(image)}
            onMouseEnter={() => handleImagesClick(image)} // Hover functionality
            className={`flex-shrink-0 w-20 h-20 p-2 border-2 ${activeImage === image ? "border-black/50 dark:border-white/50" : "border-transparent"
              } cursor-pointer bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 group-hover:border-black/20 backdrop-blur-sm rounded-xl hover:border-black/50 transition-all focus:outline-none`}
            size="icon"
            effect="shine"
            effectColor="bg-amber-500/50 dark:bg-amber-600/50"
            centerIcon={ZoomIn}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full rounded-xl object-contain"
            />
          </CustomButton>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-4 z-50">
            <CustomClose
              onClick={closeModal}
              className="bg-white/10 hover:bg-white/20 text-white"
              title="Cerrar Ventana"
            />
          </div>

          <CustomPlusMinus
            value={`${Math.round(zoom * 100)}%`}
            onDecrease={handleZoomOut}
            onIncrease={handleZoomIn}
            disableDecrease={zoom <= 1}
            disableIncrease={zoom >= 3}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 border border-white/20 px-6 py-2 rounded-full backdrop-blur-md dark:border-white/20 dark:bg-black/60 z-50"
            iconSize={24}
          />

          {/* Image Container */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
          >
            <img
              src={activeImage}
              alt="Zoomed Product"
              className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${zoom})`,
                cursor: zoom > 1 ? 'grab' : 'default'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
