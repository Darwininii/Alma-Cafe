import React from "react";
import { cn } from "@/lib/utils";
import { CustomCard } from "./CustomCard";

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
    <CustomCard
      variant="glass"
      hoverEffect="scale"
      className={cn(
        "flex items-center gap-6 justify-center text-center",
        className
      )}
    >
      {icon && icon !== "none" && (
        <div className={cn("text-black dark:text-white/70", iconClassName)}>{icon}</div>
      )}
      <div className="space-y-1">
        <p
          className={cn(
            "font-bold text-black drop-shadow dark:text-white/70",
            titleClassName
          )}
        >
          {title}
        </p>
        {description && (
          <p className={cn("text-lg font-semibold text-black/80 dark:text-white/70", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
    </CustomCard>
  );
};
