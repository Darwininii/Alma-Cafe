import { useNavigate } from "react-router-dom";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import { CustomButton } from "./CustomButton";

interface Props {
    to?: string;
    onClick?: () => void;
    className?: string;
}

export const CustomBack = ({ to, onClick, className }: Props) => {
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
            leftIcon={TbArrowBigLeftFilled}
            iconSize={24}
            className={`bg-transparent hover:bg-transparent text-black/80 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-primary font-bold text-base md:text-lg ${className || ""}`}
        >
            Volver
        </CustomButton>
    );
};
