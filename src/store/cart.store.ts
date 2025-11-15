import { type StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type ICartItem } from "../Components/shared/CartItem";

export interface CartState {
  items: ICartItem[];
  totalItemsInCart: number;
  totalAmount: number;

  addItem: (item: ICartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cleanCart: () => void;
}

const storeApi: StateCreator<CartState> = (set) => ({
  items: [],

  totalItemsInCart: 0,
  totalAmount: 0,

  addItem: (item) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === item.productId
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Si ya existe, sumar cantidad
        updatedItems = state.items.map((i, index) =>
          index === existingItemIndex
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Si no existe, añadirlo
        updatedItems = [...state.items, item];
      }

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0
      );

      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
      );

      return {
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItemsInCart: newTotalItems,
      };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.items.filter((i) => i.productId !== productId);

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0
      );

      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
      );

      return {
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItemsInCart: newTotalItems,
      };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0
      );

      const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
      );

      return {
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItemsInCart: newTotalItems,
      };
    });
  },

  cleanCart: () => {
    set({ items: [], totalItemsInCart: 0, totalAmount: 0 });
  },
});

export const useCartStore = create<CartState>()(
  devtools(
    persist(storeApi, {
      name: "cart-store",
    })
  )
);
