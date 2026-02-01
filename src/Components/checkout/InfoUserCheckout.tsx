import { MdEdit, MdPerson } from "react-icons/md";
import { CustomCard } from "../shared/CustomCard";
import { CustomButton } from "../shared/CustomButton";
import { cn } from "@/lib/utils";

interface InfoUserCheckoutProps {
    fullName?: string;
    email?: string;
    phone?: string;
    isGuest?: boolean;
    onEdit?: () => void;
    children?: React.ReactNode;
    className?: string; // To allow external styling overrides (like max-w-sm)
}

export const InfoUserCheckout = ({
    fullName,
    email,
    phone,
    isGuest = false,
    onEdit,
    children,
    className
}: InfoUserCheckoutProps) => {
    
    // Determine what to show in avatar
    const initial = fullName ? fullName[0].toUpperCase() : "U";

    return (
        <CustomCard className={cn("p-8 border border-zinc-200 dark:border-zinc-700 relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-primary/30", className)}>
            
            {/* Edit Button - Absolute Top Right (if onEdit provided) */}
            {onEdit && (
                <div className="absolute top-4 right-4 z-10">
                    <CustomButton
                        variant="ghost"
                        effect="magnetic"
                        size="sm"
                        className="text-black/40 dark:text-white/40 hover:text-primary dark:hover:text-primary bg-transparent hover:bg-transparent"
                        onClick={onEdit}
                    >
                        <MdEdit size={20} />
                    </CustomButton>
                </div>
            )}

            <div className="flex flex-col items-center gap-6">
                
                {/* Avatar Initials or Icon */}
                <div className="shrink-0 w-24 h-24 rounded-3xl bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 flex items-center justify-center text-5xl font-black text-black dark:text-white shadow-inner">
                    {isGuest ? (
                        <MdPerson className="text-black/50 dark:text-white/50" />
                    ) : (
                        initial
                    )}
                </div>

                {/* Text Info */}
                <div className="flex-1 space-y-2 text-center w-full">
                    <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                        <MdPerson size={14} />
                        <span>{isGuest ? "Invitado" : "Comprando como"}</span>
                    </div>

                    <div className="space-y-0.5">
                        <h3 className="font-black text-2xl text-black dark:text-white leading-tight break-all px-2">
                            {fullName || "Usuario"}
                        </h3>
                        <p className="text-base font-medium text-black/50 dark:text-white/50 break-all">
                            {email}
                        </p>
                        {phone && (
                            <p className="text-xs font-mono text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md w-fit mx-auto mt-2">
                                {phone}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Render children (like navigation buttons) */}
            {children && (
                <div className="mt-6 w-full">
                    {children}
                </div>
            )}
        </CustomCard>
    );
};
