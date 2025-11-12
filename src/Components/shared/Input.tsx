import React, { useRef, useState, type InputHTMLAttributes } from "react";

type InputVariant = "default" | "glass" | "outline" | "solid";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  className?: string;
  /** Define el estilo visual */
  variant?: InputVariant;
  /** Color base del borde o brillo */
  color?: string;
}

export const Input: React.FC<InputProps> = ({
  containerClassName,
  className,
  variant = "default",
  color = "#c09074", // tono café dorado por defecto
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const radius = 100;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 🎨 Fondo interactivo (usado en el modo "default" o "solid")
  const containerBg = `
    radial-gradient(
      ${visible ? radius + "px" : "0px"} circle at ${mouse.x}px ${mouse.y}px,
      ${color},
      transparent 80%
    )
  `;

  // Tipado para variables CSS custom (--nombre)
  type CSSVars = React.CSSProperties &
    Record<`--${string}`, string | number | undefined>;

  // Estilo tipado que incluye las custom properties sin usar 'any'
  const style: CSSVars = {
    ...(variant === "default" || variant === "solid"
      ? { background: containerBg }
      : {}),
    ["--accent"]: color,
  };

  // 🧩 Estilos variantes
  const variants: Record<InputVariant, string> = {
    default: [
      "rounded-lg p-0.5 transition duration-300",
      "bg-transparent hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]",
    ].join(" "),
    glass: [
      "rounded-lg p-[1px] backdrop-blur-lg",
      "bg-white/10 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]",
    ].join(" "),
    outline: [
      "rounded-lg p-0.5 border border-gray-300 dark:border-gray-700",
      "hover:border-[var(--accent)] transition duration-300",
    ].join(" "),
    solid: [
      "rounded-lg p-0.5",
      "bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition duration-300",
    ].join(" "),
  };

  return (
    <div
      ref={containerRef}
      className={["group/input relative", variants[variant], containerClassName]
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
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
          disabled:cursor-not-allowed disabled:opacity-50 transition duration-300`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
};
