import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion, type MotionProps } from "framer-motion";
import { TbArrowBigRightLines, TbArrowBigRightFilled } from "react-icons/tb";

type MotionButtonBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.button>,
  "children"
>;

export type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "icon";
export type IconPlacement = "left" | "right";

/** Extendemos las props base de motion.button con nuestras props personalizadas */
export interface ButtonProps extends MotionButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPlacement?: IconPlacement;
  effect?: "expandIcon" | "none";
  filledIcon?: boolean;
  IconTB?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      effect = "none",
      variant = "default",
      size = "md",
      icon: Icon,
      IconTB,
      filledIcon = false,
      iconPlacement = "left",
      className,
      children,
      // iconAnimation y motion props estarán dentro de restProps
      ...restProps
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";

    const variants: Record<ButtonVariant, string> = {
      default: "bg-primary text-white hover:bg-primary/90",
      outline:
        "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-white hover:bg-destructive/90",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    };

    // Efecto especial expandIcon -> usamos <button> normal (no motion) para evitar mezclar props
    if (effect === "expandIcon") {
      const DisplayIcon =
        Icon || (filledIcon ? TbArrowBigRightFilled : TbArrowBigRightLines);

      return (
        <button
          ref={ref}
          {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className={cn(
            "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold transition-all duration-300",
            variants[variant],
            sizes[size],
            className
          )}
        >
          {/* Texto normal */}
          <div className="flex items-center gap-2">
            <div className="size-2 scale-100 rounded-lg bg-primary transition-all duration-300 group-hover:scale-[100.8]" />
            <span className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
              {children}
            </span>
          </div>

          {/* Texto + ícono al hacer hover */}
          <div className="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
            <span className="whitespace-nowrap">{children}</span>
            <DisplayIcon className="size-5" />
          </div>
        </button>
      );
    }

    // animation props tipadas como MotionProps
    const iconAnimation: Partial<MotionProps> =
      restProps.whileHover !== undefined
        ? {}
        : // solo aplicamos whileHover si no fue sobrescrito via props
          { whileHover: { x: iconPlacement === "right" ? 5 : -5 } };

    const buttonClass = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    // restProps ya es compatible con motion.button porque ButtonProps se basa en motion.button props
    return (
      <motion.button
        ref={ref}
        {...iconAnimation}
        {...restProps}
        className={buttonClass}
      >
        {Icon && iconPlacement === "left" && (
          <Icon className={cn("mr-2", size === "icon" && "m-0")} />
        )}
        {size !== "icon" && children}
        {Icon && iconPlacement === "right" && (
          <Icon className={cn("ml-2", size === "icon" && "m-0")} />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
