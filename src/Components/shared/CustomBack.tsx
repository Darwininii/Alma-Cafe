import { useNavigate } from "react-router-dom";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import { CustomButton, type ButtonProps } from "./CustomButton";

interface Props extends Partial<ButtonProps> {
    to?: string;
    onClick?: () => void;
    className?: string;
    iconOnly?: boolean;
}

export const CustomBack = ({ to, onClick, className, iconOnly = false, ...props }: Props) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onClick) onClick();
        else if (to) navigate(to);
        else navigate(-1);
    };

    return (
        <CustomButton
            onClick={handleBack}
            effect="shine"
            leftIcon={!iconOnly ? TbArrowBigLeftFilled : undefined}
            centerIcon={iconOnly ? TbArrowBigLeftFilled : undefined}
            size={iconOnly ? "icon" : "md"}
            iconSize={24}
            className={`bg-transparent hover:bg-transparent text-black/80 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-primary font-bold text-base md:text-lg ${className || ""}`}
            {...props}
        >
            {!iconOnly && "Volver"}
        </CustomButton>
    );
};
