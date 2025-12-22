import { TbArrowBigLeftFilled } from "react-icons/tb";
import { CustomButton } from "./CustomButton";

interface Props {
    to?: string;
    onClick?: () => void;
    className?: string;
}

export const CustomBack = ({ to, onClick, className }: Props) => {
    return (
        <CustomButton
            to={to}
            onClick={onClick}
            effect="shine"
            leftIcon={TbArrowBigLeftFilled}
            iconSize={24}
            className={`bg-transparent hover:bg-transparent text-black/80 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-primary font-bold text-base md:text-lg ${className || ""}`}
        >
            Volver
        </CustomButton>
    );
};
