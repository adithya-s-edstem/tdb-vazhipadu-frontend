import type { CartLine } from "./CartLine";

export function removeFromCart(lines: CartLine[], offeringId: string): CartLine[] {
  return lines.filter((line) => line.offeringId !== offeringId);
}
