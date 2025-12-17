import React, {
    useRef,
    useState,
    type InputHTMLAttributes,
    forwardRef,
} from "react";
import { cn } from "../../lib/utils"; // Asegúrate de tener esta utilidad o usa un join simple

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    containerClassName?: string;
    wrapperClassName?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ className, containerClassName, wrapperClassName, label, error, icon, ...props }, ref) => {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const [mouse, setMouse] = useState({ x: 0, y: 0 });
        const [isFocused, setIsFocused] = useState(false);
        const [hasValue, setHasValue] = useState(!!props.value);

        // Actualizar estado si el value cambia externamente
        React.useEffect(() => {
            setHasValue(!!props.value || (props.defaultValue as string)?.length > 0);
        }, [props.value, props.defaultValue]);

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMouse({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };

        const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            setHasValue(e.target.value.length > 0);
            props.onChange?.(e);
        };

        return (
            <div className={cn("flex flex-col gap-1.5", containerClassName)}>
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    className="group relative rounded-xl p-[1px] overflow-hidden transition-all duration-300"
                    style={
                        {
                            background: `radial-gradient(120px circle at ${mouse.x}px ${mouse.y}px, rgba(168, 114, 87, 0.4), transparent 40%)`,
                        } as React.CSSProperties
                    }
                >
                    {/* Fondo y Borde con efecto */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-neutral-100 dark:from-stone-800 dark:to-stone-900 opacity-90 rounded-xl pointer-events-none" />

                    <div
                        className={cn(
                            "relative z-10 flex items-center bg-white dark:bg-black rounded-[11px] px-3 py-1 transition-all duration-300 border border-transparent",
                            isFocused
                                ? "border-primary/50 shadow-[0_0_15px_rgba(192,144,116,0.15)]"
                                : "border-neutral-200 dark:border-stone-800 hover:border-primary/30",
                            wrapperClassName
                        )}
                    >
                        {/* Icono opcional */}
                        {icon && (
                            <div className="text-neutral-400 dark:text-neutral-500 mr-2">
                                {icon}
                            </div>
                        )}

                        <div className="relative w-full">
                            {/* Etiqueta flotante */}
                            {label && (
                                <label
                                    className={cn(
                                        "absolute left-0 transition-all duration-200 pointer-events-none text-neutral-400 font-medium",
                                        isFocused || hasValue || props.value
                                            ? "-top-1 text-[10px] text-primary"
                                            : "top-2.5 text-sm"
                                    )}
                                >
                                    {label}
                                </label>
                            )}

                            <input
                                ref={ref}
                                {...props}
                                onFocus={(e) => {
                                    setIsFocused(true);
                                    props.onFocus?.(e);
                                }}
                                onBlur={(e) => {
                                    setIsFocused(false);
                                    props.onBlur?.(e);
                                }}
                                onChange={handleInput}
                                className={cn(
                                    "w-full bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-neutral-100 py-2.5 h-10",
                                    className
                                )}
                                placeholder={isFocused || !label ? props.placeholder : ""}
                            />
                        </div>
                    </div>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <span className="text-xs text-red-500 font-medium ml-1 animate-in slide-in-from-top-1 fade-in">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

CustomInput.displayName = "CustomInput";
