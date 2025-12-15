import { MdDeleteForever } from "react-icons/md";
import { CustomButton, type ButtonProps } from "./CustomButton";
import { cn } from "@/lib/utils";

interface DeleteButtonProps extends ButtonProps {
    className?: string;
}

export const CustomDeleteButton = ({
    className,
    effect = "magnetic",
    size = "icon",
    centerIcon = MdDeleteForever,
    iconSize = 22,
    ...props
}: DeleteButtonProps) => {
    return (
        <CustomButton
            effect={effect}
            size={size}
            centerIcon={centerIcon}
            iconSize={iconSize}
            className={cn(
                "bg-red-100 dark:bg-red-900/30 text-red-600 hover:text-black dark:text-white border border-red-200 dark:border-red-900",
                className
            )}
            {...props}
        />
    );
};
