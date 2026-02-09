import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomBadgeProps {
    count?: number;
    label?: string;
    className?: string;
    animate?: boolean;
    color?: "red" | "green" | "amber" | "blue" | "neutral";
}

const colorStyles = {
    red: "bg-red-500/60 border-2 border-red-800/60 text-red-900 dark:text-red-300 backdrop-blur-md",
    green: "bg-green-500/60 border-2 border-green-800/60 text-green-950 dark:text-emerald-200 backdrop-blur-md",
    amber: "dark:bg-amber-500/10 border-2 dark:border-amber-500/20 bg-yellow-600/70 border-amber-600 text-amber-900 dark:text-amber-400 backdrop-blur-md",
    blue: "bg-blue-500/10 border-2 border-blue-500/20 text-blue-700 dark:text-blue-400 backdrop-blur-md",
    neutral: "bg-gray-500/10 border-2 border-gray-500/20 text-gray-700 dark:text-gray-400 backdrop-blur-md",
    // Default for numeric badge
    default: "bg-black/80 dark:bg-yellow-600 text-white dark:text-black", 
};

export const CustomBadge: React.FC<CustomBadgeProps> = ({
    count,
    label,
    className,
    animate = true,
    color = "neutral",
}) => {
    // Case 1: Text Label (Replacement for Tag)
    if (label) {
        return (
            <div className={cn(
                "w-fit px-2.5 py-0.5 rounded-md border uppercase text-[10px] tracking-wider font-bold shadow-sm select-none",
                colorStyles[color] || colorStyles.neutral,
                className
            )}>
                {label}
            </div>
        );
    }

    // Case 2: Numeric Count (Existing functionality)
    return (
        <AnimatePresence>
            {(count !== undefined && count > 0) && (
                <motion.span
                    key="badge-container"
                    initial={animate ? { scale: 0, opacity: 0 } : undefined}
                    animate={animate ? { scale: 1, opacity: 1 } : undefined}
                    exit={animate ? { scale: 0, opacity: 0 } : undefined}
                    whileHover={{ scale: 1.1 }}
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                    }}
                    className={cn(
                        "flex items-center justify-center rounded-full shadow-md font-black text-[11px]",
                         colorStyles.default,
                        className
                    )}
                >
                    <motion.span
                        key={count}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {count}
                    </motion.span>
                </motion.span>
            )}
        </AnimatePresence>
    );
};
