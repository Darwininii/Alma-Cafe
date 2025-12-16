import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CustomCard } from "./CustomCard";

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  rotate?: "x" | "y";
  className?: string;
  containerClassName?: string;
  frontClassName?: string;
  backClassName?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  front,
  back,
  rotate = "y",
  className,
  containerClassName,
  frontClassName,
  backClassName,
}) => {
  const rotationClass =
    rotate === "x"
      ? [
        "group-hover:[transform:rotateX(180deg)]",
        "[transform:rotateX(180deg)]",
      ]
      : [
        "group-hover:[transform:rotateY(180deg)]",
        "[transform:rotateY(180deg)]",
      ];

  return (
    <div className={cn("group h-64 w-48 perspective-[1000px]", className)}>
      <div
        className={cn(
          "relative h-full rounded-2xl transition-all duration-500 transform-3d",
          rotationClass[0],
          containerClassName
        )}
      >
        {/* Front */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden",
            frontClassName
          )}
        >
          <CustomCard
            variant="glass"
            padding="none"
            className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-md border-white/10"
          >
            {front}
          </CustomCard>
        </div>

        {/* Back */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden",
            rotationClass[1],
            backClassName
          )}
        >
          <CustomCard
            variant="glass"
            padding="sm"
            className="w-full h-full flex items-center justify-center bg-transparent border-white/10"
          >
            {back}
          </CustomCard>
        </div>
      </div>
    </div>
  );
};
