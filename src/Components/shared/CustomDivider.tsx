import React from "react";
import { cn } from "@/lib/utils";

export interface CustomDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "glass" | "dashed" | "gradient" | "neon";
  color?: string;
  thickness?: number | string;
  length?: number | string;
}

export const CustomDivider = React.forwardRef<HTMLDivElement, CustomDividerProps>(
  (
    {
      orientation = "horizontal",
      variant = "default",
      color,
      thickness,
      length,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Base styles depending on orientation
    const baseStyles =
      orientation === "horizontal"
        ? "w-full h-px"
        : "h-full w-px";

    // Variant styles
    const variantStyles = {
      default: "bg-border",
      glass: "bg-white/10 backdrop-blur-sm",
      dashed: "border-border border-dashed bg-transparent",
      gradient: "bg-gradient-to-r from-transparent via-border to-transparent",
      neon: "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]",
    };

    // Specific adjustments for dashed & gradient based on orientation
    if (orientation === "vertical") {
      variantStyles.dashed = "border-l-2 border-dashed border-border bg-transparent w-0";
      variantStyles.gradient = "bg-gradient-to-b from-transparent via-border to-transparent";
    } else {
       // horizontal dashed default
       variantStyles.dashed = "border-t-2 border-dashed border-border bg-transparent h-0";
    }
   
    // Custom inline styles for thickness/length/color if provided
    const customStyles: React.CSSProperties = { ...style };
    
    if (color) {
       // If solid color, apply to bg (except dashed usually uses border)
       if (variant !== 'dashed') customStyles.backgroundColor = color;
       else customStyles.borderColor = color;
    }

    if (thickness) {
       if (orientation === 'horizontal') customStyles.height = thickness;
       else customStyles.width = thickness;
    }

    if (length) {
       if (orientation === 'horizontal') customStyles.width = length;
       else customStyles.height = length;
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(baseStyles, variantStyles[variant], className)}
        style={customStyles}
        {...props}
      />
    );
  }
);

CustomDivider.displayName = "CustomDivider";
