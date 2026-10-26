import type { CartLine } from "./CartLine";

export function canAddToCart(lines: Pick<CartLine, "templeId">[], templeId: string): boolean {
  return lines.every((line) => line.templeId === templeId);
}
