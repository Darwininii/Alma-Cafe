import React from "react";
import { CustomButton } from "./CustomButton";

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
}

export const CustomSocials: React.FC<CustomSocialsProps> = ({
    links,
    size = "md",
    className = "",
}) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-lg",
        lg: "w-12 h-12 text-xl",
    };

    return (
        <div className={`flex gap-4 flex-wrap ${className}`}>
            {links.map((link) => (
                <CustomButton
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.title}
                    className={`
                            relative flex items-center justify-center rounded-full
                            bg-gradient-to-br from-gray-800/50 via-gray-700/30 to-gray-900/10
                            backdrop-blur-md border border-white/10
                            shadow-[0_0_15px_rgba(255,255,255,0.06)]
                            transition-all duration-300
                            hover:scale-110 hover:shadow-[0_0_25px_rgba(255,215,150,0.5)]
                            hover:border-amber-400/30
                            ${sizeClasses[size]}
                            `}
                    size={size as "sm" | "md" | "lg"} // CustomButton expects valid size
                    effect="magnetic"
                >
                    <span className="text-slate-100">{link.icon}</span>
                </CustomButton>
            ))}
        </div>
    );
};
