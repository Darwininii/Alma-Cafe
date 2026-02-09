import { formatPrice, getOptimizedImageUrl } from "@/helpers";
import { useCartStore } from "@/store";
import { CustomDeleteButton } from "./CustomDeleteButton";
import { CustomPlusMinus } from "./CustomPlusMinus";
import { Icons } from "./Icons";

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Props {
  item: ICartItem;
}

export const CartItem = ({ item }: Props) => {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const increment = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const decrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  return (
    <li className="flex justify-between items-center gap-5">
      <div className="flex">
        <img
          src={getOptimizedImageUrl(item.image, 100)}
          alt={item.name}
          className="w-20 h-20 object-contain"
          loading="lazy"
          width="80"
          height="80"
        />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <p className="font-black text-black dark:text-white/80">{item.name}</p>
          <p className="text-sm font-black text-black dark:text-white/80 mt-1">
            {formatPrice(item.price)}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <CustomPlusMinus
            value={item.quantity}
            onDecrease={decrement}
            onIncrease={increment}
            disableDecrease={item.quantity === 1}
            className="border-2 border-black/50 dark:border-white/50 bg-black/20"
          />

          <CustomDeleteButton
            onClick={() => removeItem(item.productId)}
            title="Eliminar producto"
            centerIcon={Icons.Delete}
            iconSize={22}
            className="w-9 h-9 border border-red-500/20"
          />
        </div>
      </div>
    </li>
  );
};
