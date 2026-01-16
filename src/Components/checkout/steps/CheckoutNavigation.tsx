import { CustomButton } from "../../shared/CustomButton";
import { FaLeftLong } from "react-icons/fa6";
interface CheckoutNavigationProps {
    onBack?: () => void;
    onNext?: () => void;
    nextLabel?: string;
    isProcessing?: boolean;
    disabled?: boolean;
    orientation?: 'horizontal' | 'vertical';
}

export const CheckoutNavigation = ({
    onBack,
    onNext,
    nextLabel = "Continuar",
    isProcessing,
    disabled,
    orientation = 'horizontal'
}: CheckoutNavigationProps) => {
    const isVertical = orientation === 'vertical';

    const containerClasses = isVertical
        ? "mt-4 flex flex-col-reverse gap-3 w-full"
        : onBack
            ? "mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center"
            : "mt-8 pt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800";

    return (
        <div className={containerClasses}>
            {onBack && (
                <CustomButton
                    type="button"
                    effect="shine"
                    onClick={onBack}
                    leftIcon={FaLeftLong}
                    size="lg"
                    iconSize={20}
                    disabled={isProcessing}
                    className={isVertical
                        ? "w-full bg-transparent text-black/80 hover:text-white dark:hover:text-black hover:bg-black/80 dark:hover:bg-white/80 hover:font-bold dark:text-white shadow-none border-0"
                        : "order-last sm:order-0 w-full bg-transparent text-black/80 hover:text-white dark:hover:text-black hover:bg-black/80 dark:hover:bg-white/80 hover:font-bold dark:text-white shadow-none px-2 py-2"
                    }
                >
                    Atrás
                </CustomButton>
            )}

            <CustomButton
                type={onNext ? "button" : "submit"}
                onClick={onNext}
                variant="primary"
                size="lg"
                className="w-full shadow-lg shadow-primary/20"
                disabled={disabled || isProcessing}
                effect="shine"
            >
                {isProcessing ? 'Procesando...' : nextLabel}
            </CustomButton>
        </div>
    );
};
