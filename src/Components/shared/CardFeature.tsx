import React from "react";
import { cn } from "@/lib/utils";

interface CardFeatureProps {
  icon?: React.ReactNode | "none";
  title: string;
  description?: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const CardFeature: React.FC<CardFeatureProps> = ({
  icon,
  title,
  description,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
}) => {
  return (
    <div
      className={cn(
        "justify-center text-center flex items-center gap-6 rounded-2xl p-6 shadow-lg border border-white/20 backdrop-blur-md bg-white/10 transition-transform hover:scale-105 hover:shadow-xl",
        className
      )}
    >
      {icon && icon !== "none" && (
        <div className={cn("text-slate-100", iconClassName)}>{icon}</div>
      )}
      <div className="space-y-1">
        <p
          className={cn(
            "font-semibold  text-white drop-shadow",
            titleClassName
          )}
        >
          {title}
        </p>
        {description && (
          <p className={cn("text-sm text-gray-200", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
