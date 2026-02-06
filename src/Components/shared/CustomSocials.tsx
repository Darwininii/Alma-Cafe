import React, { useState } from "react";
import { CustomButton } from "./CustomButton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FaPlus, FaShareAlt } from "react-icons/fa";

export interface SocialLink {
    id: number | string;
    href: string;
    title: string;
    icon: React.ReactNode;
}

interface CustomSocialsProps {
    links: SocialLink[];
    size?: "sm" | "md" | "lg";
    className?: string;
    layout?: "row" | "gooey";
    gooeyColor?: string;
    effect?: any; // Allow passing effect prop
}

export const CustomSocials: React.FC<CustomSocialsProps> = ({
    links,
    size = "md",
    className = "",
    layout = "row",
    gooeyColor = "bg-primary",
    effect = "magnetic" // Default effect
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-lg",
        lg: "w-12 h-12 text-xl",
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    // Calculate positions in a radial pattern for Gooey layout
    const getItemPosition = (index: number) => {
        const totalItems = links.length;
        // Distribute nicely in a semi-circle or full circle depending on item count
        // For standard social links (usually 3-5), a fan shape works best.
        // Let's go with a fan from -angle to +angle
        const distance = 90; // pixels from center

        // If single item, place above
        if (totalItems === 1) return { x: 0, y: -distance };

        // Spread across 180 degrees (PI) upwards
        // -PI/12 to -11PI/12 (leaving some gap at bottom) or just fan out evenly
        const spreadAngle = (totalItems - 1) * (Math.PI / 4); // 45 degrees separation

        // Center the spread upwards (-PI/2)
        // start = -PI/2 - spread/2
        const startAngle = -Math.PI / 2 - spreadAngle / 2;

        const angle = startAngle + index * (Math.PI / 4);

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
        };
    };

    if (layout === "gooey") {
        return (
            <>
                {/* SVG Filters */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    className="absolute w-0 h-0"
                >
                    <defs>
                        <filter id="gooey-socials-filter">
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

                <div
                    className={cn(
                        "relative flex items-center justify-center p-12", // Added padding to accommodate expansion
                        className
                    )}
                    style={{ filter: "url(#gooey-socials-filter)" }}
                >
                    <AnimatePresence>
                        {isOpen &&
                            links.map((link, index) => {
                                const position = getItemPosition(index);

                                return (
                                    <motion.div
                                        key={link.id}
                                        className={cn(
                                            "absolute rounded-full flex items-center justify-center z-10" // Removed color from wrapper
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
                                    >
                                        <CustomButton
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="icon"
                                            className={cn(
                                                "w-12 h-12 rounded-full",
                                                "hover:bg-black text-white shadow-none",
                                                gooeyColor === "bg-primary" ? "bg-amber-600" : gooeyColor
                                            )}
                                            effect={effect}
                                            aria-label={link.title}
                                        >
                                            {link.icon}
                                        </CustomButton>
                                    </motion.div>
                                );
                            })}
                    </AnimatePresence>

                    {/* Main Toggle Button */}
                    <div className="relative z-20 bg-background rounded-full"> {/* Background wrapper to prevent bleed */}
                        <CustomButton
                            onClick={toggleMenu}
                            size="lg"
                            className={cn(
                                "rounded-full w-14 h-14 z-20",
                                gooeyColor
                            )}
                            effect={effect} // Use passed effect
                            aria-label="Toggle social menu"
                        >
                            <motion.div
                                animate={{ rotate: isOpen ? 135 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isOpen ? (
                                    <FaPlus className="w-6 h-6" /> // Or an X icon, but + rotated is X
                                ) : (
                                    <FaShareAlt className="w-6 h-6" />
                                )}
                            </motion.div>
                        </CustomButton>
                    </div>
                </div>
            </>
        );
    }

    // Default Row Layout
    return (
        <div className={`flex gap-4 flex-wrap ${className}`}>
            {links.map((link) => (
                <CustomButton
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.title}
                    className={cn(
                        "relative flex items-center justify-center rounded-full",
                        "bg-linear-to-br from-gray-800/50 via-gray-700/30 to-gray-900/10",
                        "backdrop-blur-md border border-white/10",
                        "shadow-[0_0_15px_rgba(255,255,255,0.06)]",
                        "transition-all duration-300",
                        "hover:scale-110 hover:shadow-[0_0_25px_rgba(255,215,150,0.5)]",
                        "hover:border-amber-400/30",
                        sizeClasses[size]
                    )}
                    size={size as "sm" | "md" | "lg"} // CustomButton expects valid size
                    effect="magnetic"
                >
                    <span className="text-slate-100">{link.icon}</span>
                </CustomButton>
            ))}
        </div>
    );
};

