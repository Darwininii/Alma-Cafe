import { useState } from "react";
import { ImageZoom } from "../shared/ImageZoom";
import { BadgeMinus, BadgePlus, BadgeX } from "lucide-react";

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
          className=" w-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Miniaturas */}
      <div className="flex mt-4 gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImagesClick(image)}
            className={`flex-shrink-0 w-20 h-20 p-2 border-2 ${activeImage === image ? "border-black/50" : "border-transparent"
              } cursor-pointer bg-white/10 backdrop-blur-sm rounded-xl hover:border-black/50 transition-all focus:outline-none`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full rounded-sm object-contain mix-blend-multiply"
            />
          </button>
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
            <button
              onClick={closeModal}
              className="cursor-pointer p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <BadgeX size={24} />
            </button>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50 bg-black/50 border border-white/20 px-6 py-2 rounded-full backdrop-blur-md">
            <button
              onClick={handleZoomOut}
              className="p-2 cursor-pointer text-white hover:text-gray-300 transition-colors disabled:opacity-50"
              disabled={zoom <= 1}
            >
              <BadgeMinus size={24} />
            </button>
            <span className="text-white font-medium flex items-center text-sm min-w-[3ch] justify-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 cursor-pointer text-white hover:text-gray-300 transition-colors disabled:opacity-50"
              disabled={zoom >= 3}
            >
              <BadgePlus size={24} />
            </button>
          </div>

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
