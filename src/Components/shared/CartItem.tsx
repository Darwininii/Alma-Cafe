import { getOptimizedImageUrl } from "@/helpers";
import { type ProductTag } from "@/interfaces";
import { PriceDisplay } from "./PriceDisplay";
import { CustomBadge } from "./CustomBadge";
import { CustomDeleteButton } from "./CustomDeleteButton";
import { CustomPlusMinus } from "./CustomPlusMinus";
import { Icons } from "./Icons";
import { useCartItem } from "@/hooks";

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount?: number;
  originalPrice?: number;
  tag?: ProductTag;
  stock?: string | null;
}

interface Props {
  item: ICartItem;
}

export const CartItem = ({ item }: Props) => {
  const { increment, decrement, remove, hasDiscount, finalPrice, originalPrice, discountValue } = useCartItem({ item });
  const isOutOfStock = item.stock === "Agotado";

  return (
    <li className="group/item rounded-lg bg-black/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 transition-colors p-2">
      <div className="flex items-center gap-3">
        {/* Imagen */}
        <div className="relative h-16 w-16 bg-white/40 dark:bg-white/30 rounded-lg p-2 shrink-0">
          <img
            src={getOptimizedImageUrl(item.image, 100)}
            alt={item.name}
            className="h-full w-full object-contain mix-blend-multiply"
            loading="lazy"
            width="64"
            height="64"
          />
          {/* Discount circle */}
          {hasDiscount && (
            <div className="absolute -top-1 -right-1 z-10 flex items-center justify-center bg-red-600 text-white w-7 h-7 rounded-full shadow-md">
              <span className="text-[8px] font-black leading-none">-{discountValue}%</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 text-left flex-1 min-w-0">
          <p className="text-sm font-semibold text-white/80 dark:text-white/70 group-hover/item:text-black transition-colors line-clamp-2 dark:group-hover/item:text-pink-600 group-hover/item:font-black">
            {item.name}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {isOutOfStock ? (
              <CustomBadge label="Agotado" color="red" animate={false} />
            ) : (
              item.tag && (
                <CustomBadge
                  label={item.tag}
                  color={item.tag === "Nuevo" ? "green" : "amber"}
                  animate={false}
                />
              )
            )}
          </div>

          {/* Precio */}
          <PriceDisplay
            originalPrice={originalPrice}
            finalPrice={finalPrice}
            discount={discountValue}
            hasDiscount={hasDiscount}
            variant="md"
            className={hasDiscount ? "items-start" : ""}
          />
        </div>
      </div>

      {/* Quantity controls + Delete */}
      <div className="flex items-center justify-end gap-3 mt-2 pr-1">
        <CustomPlusMinus
          value={item.quantity}
          onDecrease={decrement}
          onIncrease={increment}
          disableDecrease={item.quantity === 1}
          className="border-2 border-black/50 dark:border-white/50 bg-black/20"
        />
        <CustomDeleteButton
          onClick={remove}
          title="Eliminar producto"
          centerIcon={Icons.Delete}
          iconSize={18}
          className="w-8 h-8 border border-red-500/20 shrink-0"
        />
      </div>
    </li>
  );
};
