import React from "react";
import { cn } from "@/lib/utils";

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "glass" | "solid" | "outline" | "ghost";
    hoverEffect?: "scale" | "lift" | "glow" | "none";
    padding?: "none" | "sm" | "md" | "lg";
    rounded?: "lg" | "2xl" | "3xl";
    className?: string;
}

export const CustomCard = ({
    children,
    variant = "glass",
    hoverEffect = "none",
    padding = "md",
    rounded = "2xl",
    className,
    ...props
}: CustomCardProps) => {
    const baseStyles = "relative overflow-hidden transition-all duration-300";

    const variants = {
        glass: "bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg shadow-black/5",
        solid: "bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-md",
        outline: "bg-transparent border border-black/10 dark:border-white/10",
        ghost: "bg-transparent border-none shadow-none",
    };

    const effects = {
        scale: "hover:scale-[1.02] active:scale-[0.98]",
        lift: "hover:-translate-y-1 hover:shadow-xl will-change-transform",
        glow: "hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30",
        none: "",
    };

    const paddings = {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    const roundings = {
        lg: "rounded-lg",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
    };

    return (
        <div
            className={cn(
                baseStyles,
                variants[variant],
                effects[hoverEffect],
                paddings[padding],
                roundings[rounded],
                "transform-gpu", // Force GPU acceleration
                className
            )}
            {...props}
        >
            {/* Optional decorative shine for glass cards */}
            {variant === "glass" && (
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
            {children}
        </div>
    );
};
