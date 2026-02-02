import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
    className?: string;
    isDashboard?: boolean;
    asLink?: boolean;
}

export const CustomTitle = ({
    className,
    isDashboard,
    asLink = false,
}: Props) => {
    const Content = () => (
        <span
            className={cn(
                "font-bold tracking-tighter text-2xl bg-linear-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent pr-2 pb-1",
                className
            )}
        >
            Darwinini Ecommerce
        </span>
    );

    if (asLink) {
        return (
            <Link
                to="/"
                className={cn(
                    "inline-block transition-transform",
                    isDashboard && "hover:scale-105"
                )}
            >
                <Content />
            </Link>
        );
    }

    return <Content />;
};
