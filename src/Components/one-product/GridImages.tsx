import { useState, useEffect } from "react";
import { useImageZoom } from "@/hooks";
import { ImageZoom } from "../shared/ImageZoom";
import { getOptimizedImageUrl } from "@/helpers";
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

  // Hook for Zoom/Pan/Pinch logic
  const {
    zoom,
    panPosition,
    isDragging,
    resetZoom,
    handleZoomIn,
    handleZoomOut,
    handlers,
    containerHandlers
  } = useImageZoom();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleImagesClick = (image: string) => {
    setActiveImage(image);
  };

  const openModal = () => {
    setIsOpen(true);
    resetZoom();
  };

  const closeModal = () => {
    setIsOpen(false);
    resetZoom();
  };

  return (
    <div className="flex-1 flex flex-col gap-3 relative max-w-xl mx-auto md:mx-0">
      <div
        className="bg-white/10 backdrop-blur-sm h-[500px] md:h-[500px] w-full p-4 rounded-3xl relative shadow-sm flex items-center justify-center cursor-zoom-in"
        onClick={openModal}
      >
        <ImageZoom
          img={getOptimizedImageUrl(activeImage, 800)}
          alt="Imagen del Producto"
          className="w-full h-full"
          priority={true}
        />
      </div>

      {/* Miniaturas */}
      <div className="flex mt-4 gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <CustomButton
            key={index}
            onClick={() => handleImagesClick(image)}
            onMouseEnter={() => handleImagesClick(image)} // Hover functionality
            className={`shrink-0 w-20 h-20 p-2 border-2 ${activeImage === image ? "border-black/50 dark:border-white/50" : "border-transparent"
              } cursor-pointer bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 group-hover:border-black/20 backdrop-blur-sm rounded-xl hover:border-black/50 transition-all focus:outline-none`}
            size="icon"
            effect="shine"
            effectColor="bg-amber-500/50 dark:bg-amber-600/50"
            centerIcon={ZoomIn}
          >
            <img
              src={getOptimizedImageUrl(image, 100)}
              alt={`Thumbnail ${index + 1}`}
              width="80"
              height="80"
              className="w-full h-full rounded-xl object-contain"
              loading="lazy"
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
            buttonClassName="text-white hover:bg-white/10"
            iconSize={24}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image Container */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            {...containerHandlers}
          >
            <img
              src={getOptimizedImageUrl(activeImage, 1200)}
              alt="Zoomed Product"
              className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out"
              {...handlers}
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${zoom}) translate(${panPosition.x / zoom}px, ${panPosition.y / zoom}px)`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                touchAction: 'none'
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
