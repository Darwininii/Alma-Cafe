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

        // Calcular posición del mouse relativa a la imagen
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Asegurarse de que la lupa no se salga de los bordes
        // El centro de la lupa (x, y) no puede estar más cerca del borde que su radio (HALF_LENS)
        const clampedX = Math.max(HALF_LENS, Math.min(x, width - HALF_LENS));
        const clampedY = Math.max(HALF_LENS, Math.min(y, height - HALF_LENS));

        setPosition({ x: clampedX, y: clampedY });
        setDimensions({ width, height });
    };

    return (
        <div
            className={`relative overflow-hidden cursor-crosshair group rounded-xl ${className}`}
            onMouseEnter={() => setShowLens(true)}
            onMouseLeave={() => setShowLens(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                src={img}
                alt={alt}
                className="w-full h-full object-contain mix-blend-multiply"
            />

            {showLens && (
                <div
                    className="hidden md:block absolute rounded-full border border-gray-200 shadow-xl pointer-events-none z-50 bg-white bg-no-repeat"
                    style={{
                        width: `${LENS_SIZE}px`,
                        height: `${LENS_SIZE}px`,
                        // Posicionar la lupa centrada en el mouse pero respetando los límites
                        left: position.x - HALF_LENS,
                        top: position.y - HALF_LENS,
                        backgroundImage: `url(${img})`,
                        backgroundSize: `${dimensions.width * ZOOM_LEVEL}px ${dimensions.height * ZOOM_LEVEL}px`,
                        backgroundPositionX: -position.x * ZOOM_LEVEL + HALF_LENS,
                        backgroundPositionY: -position.y * ZOOM_LEVEL + HALF_LENS,
                    }}
                />
            )}
        </div>
    );
};
