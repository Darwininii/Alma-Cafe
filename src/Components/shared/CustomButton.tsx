import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { motion, type MotionProps } from "framer-motion";
import { TbArrowBigRightLines, TbArrowBigRightFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

type MotionButtonBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.button>,
  "children"
>;

export type ButtonSize = "sm" | "md" | "lg" | "icon";
export type IconPlacement = "left" | "right";
export type ButtonEffect =
  | "expandIcon"
  | "magnetic"
  | "shine"
  | "pulse"
  | "gradient"
  | "bounce"
  | "none";

/**
 * Props personalizadas para CustomButton
 * @property {ButtonSize} size - Tamaño del botón
 * @property {LucideIcon | IconType} leftIcon - Ícono a mostrar en el lado izquierdo
 * @property {LucideIcon | IconType} rightIcon - Ícono a mostrar en el lado derecho
 * @property {LucideIcon | IconType} centerIcon - Ícono a mostrar en el centro (ideal para botones icon-only)
 * @property {ButtonEffect} effect - Efecto visual del botón
 * @property {boolean} filledIcon - Si el ícono debe ser la versión rellena (solo para expandIcon)
 * @property {string} effectColor - Color personalizado para el efecto. Acepta clases de Tailwind (ej: "bg-amber-500") o valores CSS (ej: "rgba(255, 0, 0, 0.5)")
 * @property {string} effectAccentColor - Color de acento para el efecto. Acepta clases de Tailwind (ej: "text-white") o valores CSS (ej: "#8b5cf6")
 * @property {string} to - Ruta para navegación (convierte el botón en Link)
 */
export interface ButtonProps extends MotionButtonBaseProps {
  size?: ButtonSize;
  leftIcon?: LucideIcon | IconType;
  rightIcon?: LucideIcon | IconType;
  centerIcon?: LucideIcon | IconType;
  effect?: ButtonEffect;
  filledIcon?: boolean;
  effectColor?: string;
  effectAccentColor?: string;
  children?: React.ReactNode;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  iconSize?: number | string;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      effect = "none",
      size = "md",
      // iconPlacement, // Eliminado pero mantenido en destructure para evitar que pase a DOM si quedara residuo
      filledIcon = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      centerIcon: CenterIcon,
      effectColor,
      effectAccentColor,
      className,
      children,
      to,
      iconSize,
      ...restProps
    },
    ref
  ) => {
    const baseStyles =
      "group inline-flex items-center justify-center font-medium transition-all rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    // Estilo único por defecto
    const defaultStyle = "bg-primary text-white hover:bg-primary/90";

    const sizes: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    };

    // Props finales de iconos
    const FinalLeftIcon = LeftIcon;
    const FinalRightIcon = RightIcon;
    const FinalCenterIcon = CenterIcon;

    // Helper: Detecta si es una clase de Tailwind o un color CSS
    const isTailwindClass = (color?: string): boolean => {
      if (!color) return false;
      // Si empieza con bg-, text-, border-, etc., es una clase de Tailwind
      return /^(bg-|text-|border-|from-|to-|via-)/.test(color);
    };

    // // Helper: Convierte clase de Tailwind a color CSS aproximado (fallback)
    // const getTailwindColorValue = (twClass: string): string => {
    //   // Para efectos que necesitan valores CSS, usamos un color por defecto
    //   // El usuario debería usar valores CSS para estos efectos
    //   return "rgba(255, 255, 255, 0.3)";
    // };

    // ========== EFECTO: expandIcon ==========
    if (effect === "expandIcon") {
      const DisplayIcon =
        FinalRightIcon || (filledIcon ? TbArrowBigRightFilled : TbArrowBigRightLines);

      const dotColor = effectColor || "bg-primary";
      const textColor = effectAccentColor || "text-primary-foreground";

      const content = (
        <>
          {/* Texto normal */}
          <div className="flex items-center gap-2">
            <div className={cn("size-2 scale-100 rounded-lg transition-all duration-300 group-hover:scale-[100.8] group-active:scale-[100.8]", dotColor)} />
            <span className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-active:translate-x-12 group-active:opacity-0">
              {children}
            </span>
          </div>

          {/* Texto + ícono al hacer hover */}
          <div className={cn("absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100 group-active:-translate-x-5 group-active:opacity-100", textColor)}>
            <span className="whitespace-nowrap">{children}</span>
            <DisplayIcon className="size-5" size={iconSize} />
          </div>
        </>
      );

      const buttonClassName = cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold transition-all duration-300",
        defaultStyle,
        sizes[size],
        className
      );

      if (to) {
        return (
          <Link to={to} className={buttonClassName}>
            {content}
          </Link>
        );
      }

      if (restProps.href) {
        return (
          <a className={buttonClassName} {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
            {content}
          </a>
        );
      }

      return (
        <button
          ref={ref}
          {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={buttonClassName}
        >
          {content}
        </button>
      );
    }

    // ========== EFECTO: magnetic (sigue el cursor) ==========
    if (effect === "magnetic") {
      const [position, setPosition] = React.useState({ x: 0, y: 0 });
      const buttonRef = React.useRef<HTMLElement>(null);

      const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPosition({ x: x * 0.3, y: y * 0.3 });
      };

      const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
      };

      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2", size === "icon" && "m-0")} size={iconSize} />}
          {children ? children : (size === "icon" && FinalCenterIcon && <FinalCenterIcon size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2", size === "icon" && "m-0")} size={iconSize} />}
        </>
      );

      const buttonClassName = cn(
        baseStyles,
        defaultStyle,
        sizes[size],
        "transition-transform duration-200 ease-out",
        className
      );

      if (to) {
        return (
          <Link to={to} className={buttonClassName}>
            {content}
          </Link>
        );
      }

      if (restProps.href) {
        return (
          <a
            ref={(node) => {
              buttonRef.current = node;
              // Refs for 'a' tags in this custom component context might need careful handling if forwarded, 
              // but local ref is needed for effect.
            }}
            className={buttonClassName}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              display: 'inline-flex' // Ensure proper box model for rect calc
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </a>
        );
      }

      return (
        <button
          ref={(node) => {
            buttonRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={buttonClassName}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </button>
      );
    }

    // ========== EFECTO: shine (brillo diagonal animado) ==========
    if (effect === "shine") {
      const shineColor = effectColor || "rgba(255, 255, 255, 0.6)";
      const isTailwind = isTailwindClass(shineColor);

      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2 relative z-10", size === "icon" && "m-0")} size={iconSize} />}
          {children ? <span className="relative z-10">{children}</span> : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className="relative z-10" size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2 relative z-10", size === "icon" && "m-0")} size={iconSize} />}
          {isTailwind ? (
            <div
              className={cn(
                "absolute inset-0 -translate-x-full group-hover:translate-x-full group-active:translate-x-full transition-transform duration-700 ease-in-out",
                shineColor
              )}
              style={{ transform: "skewX(-20deg)" }}
            />
          ) : (
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full group-active:translate-x-full transition-transform duration-700 ease-in-out"
              style={{
                background: `linear-gradient(90deg, transparent, ${shineColor}, transparent)`,
                transform: "skewX(-20deg)",
              }}
            />
          )}
        </>
      );

      const buttonClassName = cn(
        baseStyles,
        defaultStyle,
        sizes[size],
        "group relative overflow-hidden",
        className
      );

      if (to) {
        return (
          <Link to={to} className={buttonClassName}>
            {content}
          </Link>
        );
      }

      if (restProps.href) {
        return (
          <a className={buttonClassName} {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
            {content}
          </a>
        );
      }

      return (
        <button
          ref={ref}
          {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={buttonClassName}
        >
          {content}
        </button>
      );
    }

    // ========== EFECTO: pulse (pulso de escala continuo) ==========
    if (effect === "pulse") {
      const pulseColor = effectColor || "rgba(59, 130, 246, 0.4)";
      const isTailwind = isTailwindClass(pulseColor);

      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2 relative z-10", size === "icon" && "m-0")} size={iconSize} />}
          {children ? <span className="relative z-10">{children}</span> : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className="relative z-10" size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2 relative z-10", size === "icon" && "m-0")} size={iconSize} />}
          <motion.div
            className={cn("absolute inset-0 rounded-md", isTailwind && pulseColor)}
            style={isTailwind ? undefined : { backgroundColor: pulseColor }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      );

      const buttonClassName = cn(
        baseStyles,
        defaultStyle,
        sizes[size],
        "relative overflow-hidden",
        className
      );

      if (to) {
        return (
          <Link to={to} className={buttonClassName}>
            {content}
          </Link>
        );
      }

      if (restProps.href) {
        return (
          <a className={buttonClassName} {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
            {content}
          </a>
        );
      }

      return (
        <button
          ref={ref}
          {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={buttonClassName}
        >
          {content}
        </button>
      );
    }

    // ========== EFECTO: gradient (gradiente animado de fondo) ==========
    if (effect === "gradient") {
      const gradientFrom = effectColor || "#ec4899";
      const gradientTo = effectAccentColor || "#8b5cf6";
      const isFromTailwind = isTailwindClass(gradientFrom);
      const isToTailwind = isTailwindClass(gradientTo);

      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2 relative z-10", size === "icon" && "m-0")} size={iconSize} />}
          {children ? <span className="relative z-10">{children}</span> : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className="relative z-10" size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2 relative z-10", size === "icon" && "m-0")} size={iconSize} />}
          {isFromTailwind && isToTailwind ? (
            <motion.div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 bg-gradient-to-r",
                gradientFrom,
                gradientTo
              )}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ) : (
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})`,
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </>
      );

      const buttonClassName = cn(
        baseStyles,
        defaultStyle,
        sizes[size],
        "group relative overflow-hidden",
        className
      );

      if (to) {
        return (
          <Link to={to} className={buttonClassName}>
            {content}
          </Link>
        );
      }

      if (restProps.href) {
        return (
          <a className={buttonClassName} {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
            {content}
          </a>
        );
      }

      return (
        <button
          ref={ref}
          {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={buttonClassName}
        >
          {content}
        </button>
      );
    }

    // ========== EFECTO: bounce ==========
    if (effect === "bounce") {
      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2", size === "icon" && "m-0")} size={iconSize} />}
          {children ? children : (size === "icon" && FinalCenterIcon && <FinalCenterIcon size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2", size === "icon" && "m-0")} size={iconSize} />}
        </>
      );

      const buttonClassName = cn(
        baseStyles,
        defaultStyle,
        sizes[size],
        className
      );

      if (to) {
        return (
          <Link to={to} className={buttonClassName}>
            {content}
          </Link>
        );
      }

      if (restProps.href) {
        return (
          <motion.a
            className={buttonClassName}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            {...(restProps as any)}
          >
            {content}
          </motion.a>
        );
      }

      return (
        <motion.button
          ref={ref}
          {...restProps}
          className={buttonClassName}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {content}
        </motion.button>
      );
    }

    // ========== EFECTO: none (default) ==========
    const iconAnimation: Partial<MotionProps> =
      restProps.whileHover !== undefined
        ? {}
        : { whileHover: { x: FinalRightIcon ? 5 : FinalLeftIcon ? -5 : 0 } };

    const buttonClass = cn(
      baseStyles,
      defaultStyle,
      sizes[size],
      className
    );

    const content = (
      <>
        {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2", size === "icon" && "m-0")} size={iconSize} />}
        {children ? children : (size === "icon" && FinalCenterIcon && <FinalCenterIcon size={iconSize} />)}
        {FinalRightIcon && <FinalRightIcon className={cn("ml-2", size === "icon" && "m-0")} size={iconSize} />}
      </>
    );

    if (to) {
      return (
        <Link to={to} className={buttonClass}>
          {content}
        </Link>
      );
    }

    if (restProps.href) {
      return (
        <motion.a
          className={buttonClass}
          {...(iconAnimation as any)}
          {...(restProps as any)}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        {...iconAnimation}
        {...restProps}
        className={buttonClass}
      >
        {content}
      </motion.button>
    );
  }
);

CustomButton.displayName = "CustomButton";
