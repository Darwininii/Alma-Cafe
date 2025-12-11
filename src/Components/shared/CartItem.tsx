import { formatPrice } from "@/helpers";
import { useCartStore } from "@/store";
import { BadgeMinus, BadgePlus } from "lucide-react";
import { MdDeleteForever } from "react-icons/md";

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
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-contain"
        />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <p className="font-black text-black">{item.name}</p>
          <p className="text-sm font-black text-black mt-1">
            {formatPrice(item.price)}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-3 px-2 py-1 border border-2 border-black/50 w-fit rounded-full">
            <button
              onClick={decrement}
              disabled={item.quantity === 1}
              className="cursor-pointer hover:text-red-600/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed "
            >
              <BadgeMinus size={18} />
            </button>
            <span className="text-black text-sm font-black min-w-[20px] text-center">{item.quantity}</span>
            <button
              onClick={increment}
              className="cursor-pointer hover:text-green-100 transition-colors"
            >
              <BadgePlus size={18} />
            </button>
          </div>

          <button
            className="cursor-pointer text-black hover:text-red-600/80 transition-colors"
            onClick={() => removeItem(item.productId)}
            title="Eliminar producto"
          >
            <MdDeleteForever size={22} />
          </button>
        </div>
      </div>
    </li>
  );
};
