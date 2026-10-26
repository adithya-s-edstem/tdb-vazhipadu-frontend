import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToCart, type CartableOffering } from "./domain/addToCart";
import type { CartLine } from "./domain/CartLine";
import { changeQuantity, type QuantityChange } from "./domain/changeQuantity";
import { removeFromCart } from "./domain/removeFromCart";

export const CART_STORAGE_KEY = "vazhipadu-cart";

interface CartState {
  lines: CartLine[];
  add: (offering: CartableOffering) => void;
  changeQuantity: (change: QuantityChange) => void;
  remove: (offeringId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (offering) => set(({ lines }) => ({ lines: addToCart(lines, offering) })),
      changeQuantity: (change) => set(({ lines }) => ({ lines: changeQuantity(lines, change) })),
      remove: (offeringId) => set(({ lines }) => ({ lines: removeFromCart(lines, offeringId) })),
    }),
    { name: CART_STORAGE_KEY, partialize: ({ lines }) => ({ lines }) },
  ),
);
