import { useCartStore } from "@/store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/interfaces/product.interface";

interface UseProductCartProps {
  product: Product;
  count?: number;
}

export const useProductCart = ({ product, count = 1 }: UseProductCartProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  // Calcular descuento y precio final
  const discountStart = product?.discount || 0;
  const hasDiscount = product?.tag === "Promoción" && discountStart > 0;
  
  const finalPrice = hasDiscount && product 
    ? product.price - (product.price * (discountStart / 100)) 
    : (product?.price || 0);

  const discountValue = hasDiscount ? discountStart : 0;

  const addToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: finalPrice,
      quantity: count,
      discount: discountValue,
      originalPrice: product.price,
      tag: product.tag,
      stock: product.stock,
    });

    toast.success("Producto añadido al carrito");
  };

  const buyNow = () => {
    if (!product) return;
    
    addToCart();
    navigate("/checkout");
  };

  return {
    addToCart,
    buyNow,
    finalPrice,
    hasDiscount,
    discountValue,
  };
};

// Interface for useCartItem
interface UseCartItemProps {
  item: {
    productId: string;
    quantity: number;
    price: number;
    discount?: number;
    originalPrice?: number;
  };
}

export const useCartItem = ({ item }: UseCartItemProps) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const increment = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const decrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const remove = () => {
    removeItem(item.productId);
  };
  
  // Logic for display
  const hasDiscount = !!(item.discount && item.discount > 0 && item.originalPrice);
  const finalPrice = item.price;
  const originalPrice = item.originalPrice || 0;
  const discountValue = item.discount || 0;

  return {
    increment,
    decrement,
    remove,
    hasDiscount,
    finalPrice,
    originalPrice,
    discountValue
  };
};
