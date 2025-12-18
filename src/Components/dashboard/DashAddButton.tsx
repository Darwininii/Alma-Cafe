import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { CustomButton } from "../shared/CustomButton";
import { cn } from "@/lib/utils";

interface DashAddButtonProps {
    children: React.ReactNode;
    to?: string;
    onClick?: () => void;
    icon?: LucideIcon | IconType;
    className?: string;
}

export const DashAddButton = ({
    children,
    to,
    onClick,
    icon,
    className
}: DashAddButtonProps) => {
    return (
        <CustomButton
            to={to}
            onClick={onClick}
            effect="shine"
            effectColor="rgba(255,255,255,0.2)"
            leftIcon={icon}
            className={cn(
                "font-bold text-white transition-all duration-300",
                "bg-primary hover:bg-primary/90",
                "shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)]",
                "hover:scale-[1.02] active:scale-95",
                "dark:shadow-[0_4px_14px_0_rgba(234,88,12,0.20)] dark:hover:shadow-[0_6px_20px_rgba(234,88,12,0.3)]",
                className
            )}
        >
            {children}
        </CustomButton>
    );
};
