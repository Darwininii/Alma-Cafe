import { BadgeX, SquareChevronLeft, SquareChevronRight } from "lucide-react";
import { CustomButton, type ButtonProps } from "./CustomButton";
import { cn } from "@/lib/utils";

interface CloseButtonProps extends ButtonProps {
    className?: string; // Explicitly allow className to override default styles
    isOpen?: boolean; // Prop to determine which icon to show
}

export const CustomClose = ({
    className,
    effect = "magnetic",
    size = "icon",
    centerIcon,
    iconSize = 22,
    isOpen,
    ...props
}: CloseButtonProps) => {
    // If centerIcon is provided explicitly, use it.
    // Otherwise, if isOpen is defined, toggle between Panel icons.
    // Default fallback to BadgeX if neither is set.
    const IconToUse = centerIcon || (isOpen !== undefined ? (isOpen ? SquareChevronRight : SquareChevronLeft) : BadgeX);

    return (
        <CustomButton
            effect={effect}
            size={size}
            centerIcon={IconToUse}
            iconSize={iconSize}
            className={cn(
                "rounded-full bg-gray-100/50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white aspect-square p-0 flex items-center justify-center",
                className
            )}
            {...props}
        />
    );
};
