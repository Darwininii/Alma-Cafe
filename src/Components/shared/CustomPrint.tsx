import { MdPrint } from "react-icons/md";
import { CustomButton, type ButtonProps } from "./CustomButton";
import { cn } from "@/lib/utils";

interface CustomPrintProps extends Omit<ButtonProps, 'onClick'> {
    className?: string;
    label?: string;
    onBeforePrint?: () => void;
}

export const CustomPrint = ({
    className,
    label = "Imprimir",
    effect = "shine",
    effectColor = "green",
    leftIcon = MdPrint,
    onBeforePrint,
    ...props
}: CustomPrintProps) => {

    const handlePrint = () => {
        if (onBeforePrint) onBeforePrint();
        window.print();
    };

    return (
        <CustomButton
            onClick={handlePrint}
            effect={effect}
            effectColor={effectColor}
            leftIcon={leftIcon}
            className={cn(
                "bg-white dark:bg-zinc-800 border border-black/40 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700",
                className
            )}
            {...props}
        >
            {label}
        </CustomButton>
    );
};
