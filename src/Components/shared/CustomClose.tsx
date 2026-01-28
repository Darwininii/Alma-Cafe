import { BadgeX } from "lucide-react";
import { CustomButton, type ButtonProps } from "./CustomButton";
import { cn } from "@/lib/utils";

interface CloseButtonProps extends ButtonProps {
    className?: string; // Explicitly allow className to override default styles
}

export const CustomClose = ({
    className,
    effect = "magnetic",
    size = "icon",
    centerIcon = BadgeX,
    iconSize = 22,
    ...props
}: CloseButtonProps) => {
    return (
        <CustomButton
            effect={effect}
            size={size}
            centerIcon={centerIcon}
            iconSize={iconSize}
            className={cn(
                "rounded-full bg-gray-100/50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white aspect-square p-0 flex items-center justify-center",
                className
            )}
            {...props}
        />
    );
};
