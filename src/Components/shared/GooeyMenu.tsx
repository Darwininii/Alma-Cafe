import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

interface MenuItem {
    icon: LucideIcon | IconType;
    label: string;
    onClick?: () => void;
    href?: string;
}

interface GooeyMenuProps {
    items: MenuItem[];
    buttonColor?: string;
    itemColor?: string;
    className?: string;
}

export const GooeyMenu: React.FC<GooeyMenuProps> = ({
    items,
    buttonColor = "bg-pink-600",
    itemColor = "bg-pink-600",
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Calculate positions in a radial pattern
    const getItemPosition = (index: number) => {
        const totalItems = items.length;
        const angleStep = Math.PI / (totalItems - 1 || 1); // Half circle
        const startAngle = 0;
        const angle = startAngle + angleStep * index;
        const distance = 105; // pixels from center

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
        };
    };

    return (
        <>
            {/* SVG Filters */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                className="absolute w-0 h-0"
            >
                <defs>
                    <filter id="gooey-filter">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                            result="goo"
                        />
                        <feComposite in2="goo" in="SourceGraphic" result="mix" />
                    </filter>
                </defs>
            </svg>

            {/* Menu Container */}
            <div
                className={cn(
                    "relative w-96 h-64 flex items-start justify-center pt-5",
                    className
                )}
                style={{ filter: "url(#gooey-filter)" }}
            >
                {/* Menu Items */}
                <AnimatePresence>
                    {isOpen &&
                        items.map((item, index) => {
                            const position = getItemPosition(index);
                            const Icon = item.icon;

                            return (
                                <motion.button
                                    key={index}
                                    className={cn(
                                        "absolute w-20 h-20 rounded-full text-white flex items-center justify-center text-2xl cursor-pointer hover:bg-white hover:text-pink-600 transition-colors",
                                        itemColor
                                    )}
                                    initial={{ x: 0, y: 0, scale: 0 }}
                                    animate={{
                                        x: position.x,
                                        y: position.y,
                                        scale: 1,
                                    }}
                                    exit={{ x: 0, y: 0, scale: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: index * 0.05,
                                    }}
                                    onClick={item.onClick}
                                    title={item.label}
                                    style={{ zIndex: 1 }}
                                >
                                    <Icon size={28} />
                                </motion.button>
                            );
                        })}
                </AnimatePresence>

                {/* Main Button */}
                <motion.button
                    className={cn(
                        "relative w-20 h-20 rounded-full text-white flex items-center justify-center cursor-pointer",
                        buttonColor
                    )}
                    onClick={toggleMenu}
                    style={{ zIndex: 2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={isOpen ? { scale: 0.9 } : { scale: 1 }}
                >
                    {/* Hamburger Lines */}
                    <div className="relative w-7 h-5 flex flex-col justify-between">
                        <motion.span
                            className="w-full h-0.5 bg-white rounded-full"
                            animate={
                                isOpen
                                    ? { rotate: 45, y: 9 }
                                    : { rotate: 0, y: 0 }
                            }
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="w-full h-0.5 bg-white rounded-full"
                            animate={
                                isOpen ? { scaleX: 0.1 } : { scaleX: 1 }
                            }
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="w-full h-0.5 bg-white rounded-full"
                            animate={
                                isOpen
                                    ? { rotate: -45, y: -9 }
                                    : { rotate: 0, y: 0 }
                            }
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                </motion.button>
            </div>
        </>
    );
};
