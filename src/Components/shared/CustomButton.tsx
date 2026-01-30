import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react"; // Import Loader2
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { motion, type MotionProps } from "framer-motion";
import { TbArrowBigRightLines, TbArrowBigRightFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

type MotionButtonBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.button>,
  "children"
>;

export type ButtonSize = "sm" | "md" | "lg" | "icon";
export type IconPlacement = "left" | "right";
export type ButtonEffect =
  | "expandIcon"
  | "magnetic"
  | "shine"
  | "bounce"
  | "none"
  | "neonPulse"
  | "wobble"
  | "3d"
  | "magneticPull"
  | "textScramble"
  | "liquidMetal"
  | "pixelDissolve"
  | "cosmicRipple";

export interface ButtonProps extends MotionButtonBaseProps {
  size?: ButtonSize;
  variant?: "solid" | "outline" | "ghost" | "link" | "primary"; // New variant prop
  isLoading?: boolean; // New isLoading prop
  leftIcon?: LucideIcon | IconType;
  rightIcon?: LucideIcon | IconType;
  centerIcon?: LucideIcon | IconType;
  effect?: ButtonEffect;
  filledIcon?: boolean;
  effectColor?: string;
  effectAccentColor?: string;
  darkEffectColor?: string;
  darkEffectAccentColor?: string;
  pulseSpeed?: number;
  children?: React.ReactNode;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  iconSize?: number | string;
  iconClass?: string;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      effect = "none",
      size = "md",
      variant = "solid",
      isLoading = false,
      filledIcon = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      centerIcon: CenterIcon,
      effectColor,
      effectAccentColor,
      darkEffectColor,
      darkEffectAccentColor,
      pulseSpeed = 2,
      className,
      children,
      to,
      iconSize,
      iconClass,
      ...restProps
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      "group inline-flex items-center justify-center font-medium transition-all rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative";

    // Variants
    const variantStyles = {
      solid: "bg-primary text-white hover:bg-primary/90",
      primary: "bg-primary text-white hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const defaultStyle = variantStyles[variant];

    // Size mappings
    const sizes: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    };

    // Icons
    const FinalLeftIcon = LeftIcon;
    const FinalRightIcon = RightIcon;
    const FinalCenterIcon = CenterIcon;

    const isTailwindClass = (color?: string): boolean => {
      if (!color) return false;
      return /^(bg-|text-|border-|from-|to-|via-)/.test(color);
    };

    // ============================================
    //  EFECTO: neonPulse (CSS animation adapted)
    // ============================================
    if (effect === "neonPulse") {
      const primaryColor = effectColor || "#0ff"; // Default cyan

      const content = (
        <span className="relative z-10 flex items-center justify-center gap-2">
          {FinalLeftIcon && <FinalLeftIcon className={iconClass} size={iconSize} />}
          {children ? children : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className={iconClass} size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={iconClass} size={iconSize} />}
        </span>
      );

      const buttonStyle = {
        backgroundColor: "#000",
        color: "#fff",
        border: `2px solid ${primaryColor}`,
        boxShadow: `0 0 10px ${primaryColor}4D`,
      };

      const buttonClassName = cn(
        baseStyles,
        sizes[size],
        "relative overflow-visible",
        className
      );

      const pulseVariant = {
        initial: { scale: 1, opacity: 1 },
        animate: {
          scale: 1.5,
          opacity: 0,
        }
      };

      const pulseTransition = {
        duration: 2,
        repeat: Infinity,
        ease: "easeOut" as const
      };

      const Wrapper = (
        <>
          <motion.div
            className="absolute inset-[-4px] rounded-md border-2 pointer-events-none"
            style={{ borderColor: primaryColor }}
            variants={pulseVariant}
            initial="initial"
            animate="animate"
            transition={pulseTransition}
          />
          <motion.div
            className="absolute inset-[-4px] rounded-md border-2 pointer-events-none"
            style={{ borderColor: primaryColor }}
            variants={pulseVariant}
            initial="initial"
            animate="animate"
            transition={{ ...pulseTransition, delay: 1 }}
          />
          {content}
        </>
      );

      if (to) return <Link to={to} className={buttonClassName} style={buttonStyle}>{Wrapper}</Link>;
      return <button ref={ref} className={buttonClassName} style={buttonStyle} {...(restProps as any)}>{Wrapper}</button>;
    }

    // ============================================
    //  EFECTO: wobble (CSS keyframes -> Framer)
    // ============================================
    if (effect === "wobble") {
      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2", size === "icon" && "m-0")} size={iconSize} />}
          {children ? children : (size === "icon" && FinalCenterIcon && <FinalCenterIcon size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2", size === "icon" && "m-0")} size={iconSize} />}
        </>
      );

      const buttonClassName = cn(
        baseStyles,
        defaultStyle,
        sizes[size],
        className
      );

      const wobbleVariants = {
        hover: {
          x: ["0%", "-25%", "20%", "-15%", "10%", "-5%", "0%"],
          rotate: [0, -5, 3, -3, 2, -1, 0],
          transition: { duration: 0.8 }
        }
      };

      if (to) {
        return (
          <Link to={to} className={buttonClassName}>
            <motion.div className="flex items-center justify-center w-full h-full" whileHover="hover" variants={wobbleVariants}>
              {content}
            </motion.div>
          </Link>
        );
      }

      return (
        <motion.button
          ref={ref}
          className={buttonClassName}
          whileHover="hover"
          variants={wobbleVariants}
          {...(restProps as any)}
        >
          {content}
        </motion.button>
      );
    }

    // ============================================
    //  EFECTO: 3d (Rolling Box)
    // ============================================
    if (effect === "3d") {
      const hVal = size === 'lg' ? 48 : size === 'sm' ? 32 : 40;
      const offset = hVal / 2;

      const containerClasses = cn(
        "group relative inline-block cursor-pointer",
        sizes[size],
        "w-48",
        className
      );

      const faces = [
        { deg: 0, style: "bg-white/90 text-black" },
        { deg: 270, style: "bg-[#03a9f4] text-white" },
        { deg: 180, style: "bg-white/90 text-black" },
        { deg: 90, style: "bg-[#03a9f4] text-white" }
      ];

      const Inner = (
        <div className="w-full h-full transition-transform duration-[400ms] ease-in-out group-hover:[transform:rotateX(360deg)]" style={{ transformStyle: 'preserve-3d' }}>
          {faces.map((face, i) => (
            <span key={i} className={cn(
              "absolute inset-0 flex items-center justify-center border-2 border-black font-bold uppercase tracking-wider",
              face.style
            )}
              style={{ transform: `rotateX(${face.deg}deg) translateZ(${offset}px)` }}>
              <div className="flex items-center gap-2">
                {FinalLeftIcon && <FinalLeftIcon className={iconClass} size={iconSize} />}
                {children}
                {FinalRightIcon && <FinalRightIcon className={iconClass} size={iconSize} />}
              </div>
            </span>
          ))}
        </div>
      );

      if (to) {
        return (
          <Link to={to} className={containerClasses} style={{ perspective: '1000px' }}>
            {Inner}
          </Link>
        )
      }

      return (
        <button ref={ref} className={containerClasses} style={{ perspective: '1000px' }} {...(restProps as any)}>
          {Inner}
        </button>
      );
    }

    // ============================================
    //  EFECTO: magneticPull (Atracción Magnética)
    // ============================================
    if (effect === "magneticPull") {
      const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
      const [isHovering, setIsHovering] = React.useState(false);
      const buttonRef = React.useRef<HTMLButtonElement>(null);

      const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;

        // Calculate pull effect (stronger as cursor gets closer to center)
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const pullStrength = 1 - (distance / maxDistance);

        setCursorPos({ x: x * pullStrength * 0.3, y: y * pullStrength * 0.3 });
      };

      const handleMouseEnter = () => setIsHovering(true);
      const handleMouseLeave = () => {
        setIsHovering(false);
        setCursorPos({ x: 0, y: 0 });
      };

      const content = (
        <motion.div
          className="flex items-center gap-2"
          animate={isHovering ? { x: cursorPos.x, y: cursorPos.y } : { x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          {FinalLeftIcon && <FinalLeftIcon className={cn("relative z-10", size === "icon" && "m-0", iconClass)} size={iconSize} />}
          {children ? <span className="relative z-10">{children}</span> : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className={cn("relative z-10", iconClass)} size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("relative z-10", size === "icon" && "m-0", iconClass)} size={iconSize} />}
        </motion.div>
      );

      const buttonClassName = cn(baseStyles, defaultStyle, sizes[size], "relative", className);

      if (to) return <Link to={to} className={buttonClassName}>{content}</Link>;

      return (
        <button
          ref={(node) => {
            buttonRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          {...(restProps as any)}
          className={buttonClassName}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </button>
      );
    }

    // ============================================
    //  EFECTO: textScramble (Texto Descompuesto)
    // ============================================
    if (effect === "textScramble") {
      const [displayText, setDisplayText] = React.useState(children?.toString() || "");
      const [isScrambling, setIsScrambling] = React.useState(false);
      const originalText = children?.toString() || "";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

      const scrambleText = () => {
        setIsScrambling(true);
        let iteration = 0;
        const interval = setInterval(() => {
          setDisplayText(
            originalText
              .split("")
              .map((_, index) => {
                if (index < iteration) {
                  return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
              })
              .join("")
          );

          iteration += 1 / 3;

          if (iteration >= originalText.length) {
            clearInterval(interval);
            setDisplayText(originalText);
            setIsScrambling(false);
          }
        }, 30);
      };

      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2", size === "icon" && "m-0", iconClass)} size={iconSize} />}
          <span className={cn(isScrambling && "font-mono")}>{displayText}</span>
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2", size === "icon" && "m-0", iconClass)} size={iconSize} />}
        </>
      );

      const buttonClassName = cn(baseStyles, defaultStyle, sizes[size], className);

      if (to) return <Link to={to} className={buttonClassName}>{content}</Link>;

      return (
        <button
          ref={ref}
          {...(restProps as any)}
          className={buttonClassName}
          onMouseEnter={scrambleText}
        >
          {content}
        </button>
      );
    }

    // ============================================
    //  EFECTO: liquidMetal (Metal Líquido)
    // ============================================
    if (effect === "liquidMetal") {
      const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });
      const [isDarkMode, setIsDarkMode] = React.useState(false);

      // Detect dark mode
      React.useEffect(() => {
        const checkDarkMode = () => {
          // Only check for 'dark' class in html element, not system preference
          const htmlClassList = document.documentElement.classList;
          setIsDarkMode(htmlClassList.contains('dark'));
        };

        checkDarkMode();

        // Listen for class changes on html element
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
          observer.disconnect();
        };
      }, []);

      // Customizable colors - defaults to white/blue chrome effect
      // Use dark mode colors if provided and dark mode is active
      const primaryGlow = (isDarkMode && darkEffectColor)
        ? darkEffectColor
        : (effectColor || "rgba(255,255,255,0.8)");
      const secondaryGlow = (isDarkMode && darkEffectAccentColor)
        ? darkEffectAccentColor
        : (effectAccentColor || "rgba(100,100,255,0.3)");

      const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
      };

      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2 relative z-10", size === "icon" && "m-0")} size={iconSize} />}
          {children ? <span className="relative z-10">{children}</span> : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className="relative z-10" size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2 relative z-10", size === "icon" && "m-0")} size={iconSize} />}

          {/* Liquid metal reflection */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]"
            style={{
              background: `
                radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
                  ${primaryGlow} 0%,
                  ${primaryGlow.replace(/[\d.]+\)/, "0.4)")} 20%,
                  ${secondaryGlow} 40%,
                  transparent 70%)
              `,
              filter: "blur(8px)",
            }}
          />

          {/* Chrome shine */}
          <div
            className="absolute inset-0 opacity-50 rounded-[inherit] pointer-events-none mix-blend-overlay"
            style={{
              background: `linear-gradient(135deg, 
                transparent 0%,
                ${primaryGlow.replace(/[\d.]+\)/, "0.3)")} 20%,
                ${primaryGlow.replace(/[\d.]+\)/, "0.6)")} 50%,
                ${primaryGlow.replace(/[\d.]+\)/, "0.3)")} 80%,
                transparent 100%
              )`,
            }}
          />
        </>
      );

      const buttonClassName = cn(baseStyles, defaultStyle, sizes[size], "group relative overflow-hidden", className);

      if (to) {
        return (
          <Link
            to={to}
            className={buttonClassName}
            onMouseMove={handleMouseMove as any}
          >
            {content}
          </Link>
        );
      }

      return (
        <motion.button
          ref={ref}
          {...restProps}
          className={buttonClassName}
          onMouseMove={handleMouseMove}
          whileHover={{ scale: 1.02 }}
        >
          {content}
        </motion.button>
      );
    }

    // ============================================
    //  EFECTO: pixelDissolve (Píxeles que Caen)
    // ============================================
    if (effect === "pixelDissolve") {
      const [pixels, setPixels] = React.useState<Array<{ id: number; x: number; y: number; char: string }>>([]);
      const [isDissolving, setIsDissolving] = React.useState(false);

      const dissolve = () => {
        setIsDissolving(true);
        const text = children?.toString() || "BTN";
        const pixelCount = text.length * 3;

        const newPixels = Array.from({ length: pixelCount }, (_, i) => ({
          id: Date.now() + i,
          x: (Math.random() - 0.5) * 100,
          y: -20 + (Math.random() * 20),
          char: text[Math.floor(Math.random() * text.length)],
        }));

        setPixels(newPixels);

        setTimeout(() => {
          setPixels([]);
          setIsDissolving(false);
        }, 1500);
      };

      const content = (
        <>
          {/* Original content */}
          <motion.div
            className="flex items-center gap-2"
            animate={isDissolving ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {FinalLeftIcon && <FinalLeftIcon className={cn("relative z-10", size === "icon" && "m-0")} size={iconSize} />}
            {children ? <span className="relative z-10">{children}</span> : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className="relative z-10" size={iconSize} />)}
            {FinalRightIcon && <FinalRightIcon className={cn("relative z-10", size === "icon" && "m-0")} size={iconSize} />}
          </motion.div>

          {/* Falling pixels */}
          {pixels.map((pixel) => (
            <motion.span
              key={pixel.id}
              className="absolute text-sm font-bold pointer-events-none"
              style={{
                left: `calc(50% + ${pixel.x}px)`,
                top: `calc(50% + ${pixel.y}px)`,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: 100,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                ease: "easeIn",
              }}
            >
              {pixel.char}
            </motion.span>
          ))}
        </>
      );

      const buttonClassName = cn(baseStyles, defaultStyle, sizes[size], "relative overflow-visible", className);

      if (to) return <Link to={to} className={buttonClassName}>{content}</Link>;

      return (
        <motion.button
          ref={ref}
          {...restProps}
          className={buttonClassName}
          onMouseEnter={dissolve}
          whileHover={{ scale: 1.02 }}
        >
          {content}
        </motion.button>
      );
    }

    // ============================================
    //  EFECTO: cosmicRipple (Ondas Cósmicas)
    // ============================================
    if (effect === "cosmicRipple") {
      const [ripples, setRipples] = React.useState<Array<{ id: number }>>([]);
      const [stars, setStars] = React.useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

      const createRipple = () => {
        const newRipple = { id: Date.now() };
        setRipples(prev => [...prev, newRipple]);

        // Create stars
        const newStars = Array.from({ length: 10 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
        }));
        setStars(newStars);

        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
          setStars([]);
        }, 2000);
      };

      const content = (
        <>
          {/* Stars */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5] }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          ))}

          {/* Cosmic ripples */}
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute inset-0 rounded-[inherit] border-2 pointer-events-none"
              style={{
                borderImage: "linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff) 1",
              }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          ))}

          <span className="relative z-10 flex items-center gap-2">
            {FinalLeftIcon && <FinalLeftIcon className={iconClass} size={iconSize} />}
            {children}
            {FinalRightIcon && <FinalRightIcon className={iconClass} size={iconSize} />}
          </span>
        </>
      );

      const buttonClassName = cn(baseStyles, defaultStyle, sizes[size], "relative overflow-visible bg-gradient-to-r from-purple-600 to-pink-600", className);

      if (to) return <Link to={to} className={buttonClassName}>{content}</Link>;

      return (
        <motion.button
          ref={ref}
          {...restProps}
          className={buttonClassName}
          onMouseEnter={createRipple}
          whileHover={{ scale: 1.05 }}
        >
          {content}
        </motion.button>
      );
    }

    // ========== EFECTO: expandIcon (Original) ==========
    if (effect === "expandIcon") {
      const DisplayIcon =
        FinalRightIcon || (filledIcon ? TbArrowBigRightFilled : TbArrowBigRightLines);
      const dotColor = effectColor || "bg-primary";
      const textColor = effectAccentColor || "text-primary-foreground";

      const content = (
        <>
          <div className="flex items-center gap-2">
            <div className={cn("size-2 scale-100 rounded-lg transition-all duration-300 group-hover:scale-[100.8] group-active:scale-[100.8]", dotColor)} />
            <span className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-active:translate-x-12 group-active:opacity-0">
              {children}
            </span>
          </div>
          <div className={cn("absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100 group-active:-translate-x-5 group-active:opacity-100", textColor)}>
            <span className="whitespace-nowrap">{children}</span>
            <DisplayIcon className={cn("size-5", iconClass)} size={iconSize} />
          </div>
        </>
      );

      const buttonClassName = cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold transition-all duration-300",
        defaultStyle,
        sizes[size],
        className
      );

      if (to) return <Link to={to} className={buttonClassName}>{content}</Link>;
      if (restProps.href) return <a className={buttonClassName} {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>;
      return <button ref={ref} {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={buttonClassName}>{content}</button>;
    }

    // ========== EFECTO: magnetic (Original) ==========
    if (effect === "magnetic") {
      const [position, setPosition] = React.useState({ x: 0, y: 0 });
      const buttonRef = React.useRef<HTMLElement>(null);

      const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPosition({ x: x * 0.3, y: y * 0.3 });
      };

      const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2", size === "icon" && "m-0", iconClass)} size={iconSize} />}
          {children ? children : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className={iconClass} size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2", size === "icon" && "m-0", iconClass)} size={iconSize} />}
        </>
      );

      const buttonClassName = cn(baseStyles, defaultStyle, sizes[size], "transition-transform duration-200 ease-out", className);

      if (to) return <Link to={to} className={buttonClassName}>{content}</Link>;
      if (restProps.href) {
        return (
          <a ref={(node) => { buttonRef.current = node; }} className={buttonClassName} style={{ transform: `translate(${position.x}px, ${position.y}px)`, display: 'inline-flex' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>
        );
      }
      return (
        <button ref={(node) => { buttonRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={buttonClassName} style={{ transform: `translate(${position.x}px, ${position.y}px)` }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>{content}</button>
      );
    }

    // ========== EFECTO: shine (Original) ==========
    if (effect === "shine") {
      const shineColor = effectColor || "rgba(255, 255, 255, 0.6)";
      const isTailwind = isTailwindClass(shineColor);
      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2 relative z-10", size === "icon" && "m-0", iconClass)} size={iconSize} />}
          {children ? <span className="relative z-10">{children}</span> : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className={cn("relative z-10", iconClass)} size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2 relative z-10", size === "icon" && "m-0", iconClass)} size={iconSize} />}
          {isTailwind ? (
            <div className={cn("absolute inset-0 -translate-x-full group-hover:translate-x-full group-active:translate-x-full transition-transform duration-700 ease-in-out", shineColor)} style={{ transform: "skewX(-20deg)" }} />
          ) : (
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full group-active:translate-x-full transition-transform duration-700 ease-in-out" style={{ background: `linear-gradient(90deg, transparent, ${shineColor}, transparent)`, transform: "skewX(-20deg)" }} />
          )}
        </>
      );
      const buttonClassName = cn(baseStyles, defaultStyle, sizes[size], "group relative overflow-hidden", className);
      if (to) return <Link to={to} className={buttonClassName}>{content}</Link>;
      if (restProps.href) return <a className={buttonClassName} {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>;
      return <button ref={ref} {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={buttonClassName}>{content}</button>;
    }

    // ========== EFECTO: bounce (Original) ==========
    if (effect === "bounce") {
      const content = (
        <>
          {FinalLeftIcon && <FinalLeftIcon className={cn("mr-2", size === "icon" && "m-0", iconClass)} size={iconSize} />}
          {children ? children : (size === "icon" && FinalCenterIcon && <FinalCenterIcon className={iconClass} size={iconSize} />)}
          {FinalRightIcon && <FinalRightIcon className={cn("ml-2", size === "icon" && "m-0", iconClass)} size={iconSize} />}
        </>
      );
      const buttonClassName = cn(baseStyles, sizes[size], className);
      if (to) return <Link to={to} className={buttonClassName}>{content}</Link>;
      if (restProps.href) return <motion.a className={buttonClassName} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} {...(restProps as any)}>{content}</motion.a>;
      return <motion.button ref={ref} {...restProps} className={buttonClassName} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>{content}</motion.button>;
    }

    // ========== EFECTO: none (Default) ==========
    const iconAnimation: Partial<MotionProps> =
      restProps.whileHover !== undefined
        ? {}
        : { whileHover: { x: FinalRightIcon ? 5 : FinalLeftIcon ? -5 : 0 } };

    const buttonClass = cn(
      baseStyles,
      defaultStyle,
      sizes[size],
      className
    );

    const content = (
      <>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && FinalLeftIcon && <FinalLeftIcon className={cn("mr-2", size === "icon" && "m-0", iconClass)} size={iconSize} />}
        {children ? children : (size === "icon" && FinalCenterIcon && !isLoading && <FinalCenterIcon className={iconClass} size={iconSize} />)}
        {!isLoading && FinalRightIcon && <FinalRightIcon className={cn("ml-2", size === "icon" && "m-0", iconClass)} size={iconSize} />}
      </>
    );

    if (to) {
      return (
        <Link to={to} className={buttonClass}>
          {content}
        </Link>
      );
    }

    if (restProps.href) {
      return (
        <motion.a
          className={buttonClass}
          {...(iconAnimation as any)}
          {...(restProps as any)}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        {...iconAnimation}
        {...restProps}
        className={buttonClass}
      >
        {content}
      </motion.button>
    );
  }
);
CustomButton.displayName = "CustomButton";
