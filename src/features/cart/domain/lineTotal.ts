import type { CartLine } from "./CartLine";

export function lineTotal(line: Pick<CartLine, "unitPrice" | "quantity">): number {
  return line.unitPrice * line.quantity;
}
