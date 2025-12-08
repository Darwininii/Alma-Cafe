import React, { useRef, useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  containerClassName,
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const radius = 100;
  const defaultColor = "#c09074"; // tono café dorado por defecto

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 🎨 Fondo interactivo
  const containerBg = `
    radial-gradient(
      ${visible ? radius + "px" : "0px"} circle at ${mouse.x}px ${mouse.y}px,
      ${defaultColor},
      transparent 80%
    )
  `;

  // Tipado para variables CSS custom (--nombre)
  type CSSVars = React.CSSProperties &
    Record<`--${string}`, string | number | undefined>;

  // Estilo tipado que incluye las custom properties sin usar 'any'
  const style: CSSVars = {
    background: containerBg,
    ["--accent"]: defaultColor,
  };

  // Estilo único por defecto
  const defaultStyle = [
    "rounded-lg p-0.5 transition duration-300",
    "bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]",
  ].join(" ");

  return (
    <div
      ref={containerRef}
      className={["group/input relative", defaultStyle, containerClassName]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      <input
        {...props}
        className={[
          `flex h-10 w-full border-none bg-transparent text-sm
          text-black dark:text-white placeholder:text-neutral-400
          dark:placeholder:text-neutral-500 rounded-md px-3 py-2
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-var(--accent)
          disabled:cursor-not-allowed disabled:opacity-50 transition duration-300`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
};
