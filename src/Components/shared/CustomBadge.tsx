import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomBadgeProps {
    count: number;
    className?: string;
    animate?: boolean;
}

export const CustomBadge: React.FC<CustomBadgeProps> = ({
    count,
    className,
    animate = true,
}) => {
    // Use simple AnimatePresence for mount/unmount combined with key on the element ONLY for entrance?
    // Actually, we want a stable element for updates.
    // We can use a unique key for the component lifecycle but NOT responsive to count for the container.

    // NOTE: We wrap the return in AnimatePresence to handle the count > 0 exit animation.
    // Inside, we render the badge if count > 0.
    // To pulse on count change without remounting, we use a key on the inner text or rely on a useEffect hook (omitted for simplicity if key on text works well enough or if we just want stable container).

    // Revised approach:
    // 1. AnimatePresence handles the 0 <-> 1 transition.
    // 2. We use 'layout' to smooth size changes.
    // 3. We use a key on the CONTENT to animate the number change, or just let React update it.

    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.span
                    key="badge-container" // Stable key prevents remounting on count change
                    initial={animate ? { scale: 0, opacity: 0 } : undefined}
                    animate={animate ? { scale: 1, opacity: 1 } : undefined}
                    exit={animate ? { scale: 0, opacity: 0 } : undefined}
                    whileHover={{ scale: 1.1 }}
                    layout // Smooths layout if width changes (e.g. 9 -> 10)
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                    }}
                    className={cn(
                        "flex items-center justify-center rounded-full shadow-md",
                        "bg-black/80 dark:bg-yellow-600 text-white dark:text-black font-black text-[11px]",
                        className
                    )}
                >
                    {/* Optional: Add a key here if we want the number to pop-transition, 
              but for now, simple text update is smoother for layout. */}
                    <motion.span
                        key={count} // This animates the number itself popping
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
