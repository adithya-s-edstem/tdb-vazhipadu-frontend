import { beforeEach } from "vitest";
import { useCartStore } from "../src/features/cart/useCartStore";

export function useEmptyCart(): void {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ lines: [] });
  });
}
