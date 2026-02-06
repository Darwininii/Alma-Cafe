import React from "react";
import { BadgeMinus, BadgePlus } from "lucide-react";
import { CustomButton } from "./CustomButton";
import { cn } from "@/lib/utils";

interface CustomPlusMinusProps extends React.HTMLAttributes<HTMLDivElement> {
    value: React.ReactNode;
    onIncrease: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    onDecrease: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    disableDecrease?: boolean;
    disableIncrease?: boolean;
    className?: string;
    iconSize?: number | string;
}

export const CustomPlusMinus = ({
    value,
    onIncrease,
    onDecrease,
    disableDecrease = false,
    disableIncrease = false,
    className,
    iconSize = 18,
    ...props
}: CustomPlusMinusProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between gap-3 px-3 py-1 rounded-full border border-black/20 dark:border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm shadow-sm",
                className
            )}
            {...props}
        >
            <CustomButton
                onClick={onDecrease}
                disabled={disableDecrease}
                size="icon"
                className="w-8 h-8 rounded-full bg-transparent hover:bg-black/10 dark:hover:bg-white/10 dark:text-white text-black hover:text-red-500 dark:hover:text-red-400 border-none shadow-none"
                centerIcon={BadgeMinus}
                iconSize={iconSize}
                effect="none"
                aria-label="Disminuir cantidad"
            />

            <span className="font-bold text-white dark:text-white min-w-[1.5ch] text-center select-none">
                {value}
            </span>

            <CustomButton
                onClick={onIncrease}
                disabled={disableIncrease}
                size="icon"
                className="w-8 h-8 rounded-full bg-transparent hover:bg-black/10 dark:hover:bg-white/10 dark:text-white text-black hover:text-green-500 dark:hover:text-green-400 border-none shadow-none"
                centerIcon={BadgePlus}
                iconSize={iconSize}
                effect="none"
                aria-label="Aumentar cantidad"
            />
        </div>
    );
};
