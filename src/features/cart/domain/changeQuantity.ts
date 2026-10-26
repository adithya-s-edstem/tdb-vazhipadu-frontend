import type { CartLine } from "./CartLine";
import { limitQuantity } from "./quantityLimits";

export interface QuantityChange {
  offeringId: string;
  quantity: number;
}

export function changeQuantity(lines: CartLine[], { offeringId, quantity }: QuantityChange): CartLine[] {
  return lines.map((line) => (line.offeringId === offeringId ? { ...line, quantity: limitQuantity(quantity) } : line));
}
