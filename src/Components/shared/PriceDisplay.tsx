import { formatPrice } from "@/helpers";
import { MdLocalOffer } from "react-icons/md";

/**
 * ===== DISCOUNT STYLE CONSTANTS =====
 * Change these values to update discount colors across the entire app.
 * All components that display prices import this component.
 */

// Old / Original Price (strikethrough)
const OLD_PRICE_COLOR = "text-black/60 dark:text-zinc-500";
const OLD_PRICE_DECORATION = "line-through decoration-red-600/60 decoration-2";

// New / Discounted Price
const NEW_PRICE_COLOR = "text-red-600 dark:text-red-500";

// Normal Price (no discount)
const NORMAL_PRICE_COLOR = "text-zinc-900 dark:text-white";

// Discount Badge (e.g. "-10%", "Oferta")
const BADGE_BG = "bg-red-100 dark:bg-red-900/30";
const BADGE_TEXT = "text-red-600 dark:text-red-400";
const BADGE_BORDER = "border-red-200 dark:border-red-900/50";

// ===== END STYLE CONSTANTS =====

type Variant = "sm" | "md" | "lg";

interface Props {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  hasDiscount: boolean;
  variant?: Variant;
  className?: string;
}

/**
 * Size presets per variant — ONLY sizing, font weight, and layout.
 * Do NOT put color classes here. Colors come from the constants above.
 */
const sizeMap: Record<Variant, {
  oldPrice: string;
  newPrice: string;
  badgeText: string;
  normalPrice: string;
}> = {
  sm: {
    oldPrice: "text-xs font-medium",
    newPrice: "text-lg font-black leading-tight",
    badgeText: "text-[10px] font-bold px-1 rounded",
    normalPrice: "text-lg font-black leading-tight",
  },
  md: {
    oldPrice: "text-xs font-medium",
    newPrice: "text-sm font-black",
    badgeText: "text-[10px] font-bold px-1 rounded",
    normalPrice: "text-sm font-black",
  },
  lg: {
    oldPrice: "text-xl md:text-2xl font-bold",
    newPrice: "text-4xl md:text-6xl font-black drop-shadow-sm",
    badgeText: "text-xs font-black",
    normalPrice: "text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400",
  },
};

export const PriceDisplay = ({
  originalPrice,
  finalPrice,
  discount,
  hasDiscount,
  variant = "sm",
  className = "",
}: Props) => {
  const sizes = sizeMap[variant];

  if (!hasDiscount) {
    // lg variant has its own gradient color in normalPrice, others use NORMAL_PRICE_COLOR
    const normalColor = variant === "lg" ? "" : NORMAL_PRICE_COLOR;
    return (
      <span className={`${sizes.normalPrice} ${normalColor} ${className}`}>
        {formatPrice(originalPrice)}
      </span>
    );
  }

  // Large variant — product detail page layout
  if (variant === "lg") {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className={`${sizes.oldPrice} ${OLD_PRICE_COLOR} ${OLD_PRICE_DECORATION}`}>
          {formatPrice(originalPrice)}
        </span>
        <div className="flex items-center gap-3">
          <span className={`${sizes.newPrice} ${NEW_PRICE_COLOR}`}>
            {formatPrice(finalPrice)}
          </span>
          <div className={`flex flex-col items-center justify-center ${BADGE_BG} ${BADGE_TEXT} px-3 py-1 rounded-lg border ${BADGE_BORDER}`}>
            <MdLocalOffer size={24} />
            <span className={sizes.badgeText}>-{discount}%</span>
          </div>
        </div>
      </div>
    );
  }

  // Small / Medium variants — compact inline layout
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`${sizes.oldPrice} ${OLD_PRICE_COLOR} line-through`}>
          {formatPrice(originalPrice)}
        </span>
        <span className={`${sizes.badgeText} ${BADGE_BG} ${BADGE_TEXT}`}>
          {variant === "sm" ? "Oferta" : `-${discount}%`}
        </span>
      </div>
      <span className={`${sizes.newPrice} ${NEW_PRICE_COLOR}`}>
        {formatPrice(finalPrice)}
      </span>
    </div>
  );
};
