import type { CartLine } from "./CartLine";
import { lineTotal } from "./lineTotal";

export function cartTotal(lines: Pick<CartLine, "unitPrice" | "quantity">[]): number {
  return lines.reduce((total, line) => total + lineTotal(line), 0);
}
