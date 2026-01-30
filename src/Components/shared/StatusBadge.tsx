import { cn } from "@/lib/utils";

export type StatusType = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
  status: string;
  variant?: StatusType;
  className?: string;
}

const variantStyles: Record<StatusType, string> = {
  success: "bg-green-500 text-white dark:text-black shadow-lg shadow-green-500/20 border-transparent",
  warning: "bg-yellow-500 text-white dark:text-black shadow-lg shadow-yellow-500/20 border-transparent",
  error: "bg-red-500 text-white dark:text-black shadow-lg shadow-red-500/20 border-transparent",
  info: "bg-blue-500 text-white dark:text-black shadow-lg shadow-blue-500/20 border-transparent",
  neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
};

const statusMap: Record<string, string> = {
  Pending: "Pendiente",
  Paid: "Pagado",
  Cancelled: "Cancelado",
  Shipped: "Enviado",
  Delivered: "Entregado",
};

export const StatusBadge = ({ status, variant = "neutral", className }: StatusBadgeProps) => {
  const displayStatus = statusMap[status] || status;
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-md transition-all",
        variantStyles[variant],
        className
      )}
    >
      {displayStatus}
    </span>
  );
};
