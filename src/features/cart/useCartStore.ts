import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToCart, type CartableOffering } from "./domain/addToCart";
import type { CartLine } from "./domain/CartLine";
import { changeQuantity, type QuantityChange } from "./domain/changeQuantity";
import { removeFromCart } from "./domain/removeFromCart";
import { restoreCartLines } from "./restoreCartLines";

export const CART_STORAGE_KEY = "vazhipadu-cart";
export const CART_STORAGE_VERSION = 1;

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
    {
      name: CART_STORAGE_KEY,
      version: CART_STORAGE_VERSION,
      partialize: ({ lines }) => ({ lines }),
      migrate: (persistedCart) => ({ lines: restoreCartLines(persistedCart) }),
      merge: (persistedCart, currentState) => ({ ...currentState, lines: restoreCartLines(persistedCart) }),
    },
  ),
);
