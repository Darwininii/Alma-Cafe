import { useState, type MouseEvent } from "react";

interface Props {
    img: string;
    alt: string;
    className?: string;
}

export const ImageZoom = ({ img, alt, className }: Props) => {
    const [showLens, setShowLens] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const ZOOM_LEVEL = 1.5; // Nivel de zoom
    const LENS_SIZE = 125; // Tamaño de la lupa en px
    const HALF_LENS = LENS_SIZE / 2;

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const clampedX = Math.max(HALF_LENS, Math.min(x, width - HALF_LENS));
        const clampedY = Math.max(HALF_LENS, Math.min(y, height - HALF_LENS));

        setPosition({ x: clampedX, y: clampedY });
        setDimensions({ width, height });
    };



    return (
        <div
            className={`relative overflow-hidden cursor-crosshair group ${className}`}
            onMouseEnter={() => setShowLens(true)}
            onMouseLeave={() => setShowLens(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                src={img}
                alt={alt}
                className="w-full h-full object-contain"
            />

            {showLens && (
                <div
                    className="absolute rounded-full border-2 border-white shadow-2xl pointer-events-none z-50 bg-white bg-no-repeat"
                    style={{
                        width: `${LENS_SIZE}px`,
                        height: `${LENS_SIZE}px`,
                        left: position.x - HALF_LENS,
                        top: position.y - HALF_LENS,
                        backgroundImage: `url(${img})`,
                        // La clave: el tamaño del background debe ser relativo al CONTENEDOR, no a la lupa.
                        // Si el contenedor mide 500px y queremos zoom 2x, la imagen de fondo debe medir 1000px.
                        backgroundSize: `${dimensions.width * ZOOM_LEVEL}px ${dimensions.height * ZOOM_LEVEL}px`,
                        // Posicionamiento:
                        // Queremos que el punto (x, y) de la imagen original esté en el centro de la lupa (HALF_LENS, HALF_LENS).
                        // En la imagen escalada, ese punto está en (x * ZOOM, y * ZOOM).
                        // Así que movemos el fondo: - (x * ZOOM) + HALF_LENS
                        backgroundPositionX: -position.x * ZOOM_LEVEL + HALF_LENS,
                        backgroundPositionY: -position.y * ZOOM_LEVEL + HALF_LENS,
                    }}
                />
            )}
        </div>
    );
};
