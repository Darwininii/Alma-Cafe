import React from "react";
import { Mail } from "lucide-react";
import { CustomInput } from "./CustomInput";
import { CustomButton, type ButtonSize } from "./CustomButton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { GrSend } from "react-icons/gr";

interface CustomNewsProps {
    className?: string; // Para el form/container
    inputClassName?: string;
    buttonClassName?: string;
    wrapperClassName?: string;
    buttonSize?: ButtonSize;
    buttonText?: string;
    buttonIcon?: LucideIcon | IconType;
    placeholder?: string;
    label?: string;
}

export const CustomNews: React.FC<CustomNewsProps> = ({
    className,
    inputClassName,
    buttonClassName,
    wrapperClassName,
    buttonSize = "md",
    buttonText = "Suscribirse",
    buttonIcon = GrSend,
    placeholder = "correo@ejemplo.com",
    label = "Tu correo",
}) => {
    return (
        <form className={cn("space-y-3", className)}>
            <CustomInput
                type="email"
                label={label}
                placeholder={placeholder}
                icon={<Mail className="w-4 h-4 text-black/80 dark:text-white/80" />}
                wrapperClassName={cn(
                    "bg-black/10 backdrop-blur-sm border border-black/30 dark:border-white/30 hover:border-black/70 dark:hover:border-white/70 transition-colors",
                    wrapperClassName
                )}
                containerClassName="w-full"
                className={cn(
                    "bg-transparent dark:bg-transparent text-black/80 font-bold",
                    inputClassName
                )}
            />
            <CustomButton
                type="submit"
                size={buttonSize}
                effect="shine"
                rightIcon={buttonIcon}
                className={cn(
                    "w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold shadow-lg shadow-amber-600/20",
                    buttonClassName
                )}
            >
                {buttonText}
            </CustomButton>
        </form>
    );
};
