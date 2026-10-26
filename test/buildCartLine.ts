import type { CartLine } from "../src/features/cart/domain/CartLine";

export function buildCartLine(overrides: Partial<CartLine> = {}): CartLine {
  return {
    offeringId: "vaikom-pushpanjali",
    templeId: "vaikom",
    name: "Pushpanjali",
    unitPrice: 30,
    quantity: 1,
    ...overrides,
  };
}
