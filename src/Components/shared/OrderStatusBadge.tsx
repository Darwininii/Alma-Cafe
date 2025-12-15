import { getStatus, getStatusColor } from "@/helpers";
import { cn } from "@/lib/utils";

interface Props {
    status: string;
    className?: string;
}

export const OrderStatusBadge = ({ status, className }: Props) => {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                getStatusColor(status),
                className
            )}
        >
            {getStatus(status)}
        </span>
    );
};
