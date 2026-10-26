import type { OrderLine } from "../../types/OrderLine";

export function orderTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}
