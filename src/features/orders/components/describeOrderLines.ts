import type { OrderLine } from "../../../api/types";

export function describeOrderLines(lines: OrderLine[]): string {
  return lines.map(({ offeringName, quantity }) => `${offeringName} × ${quantity}`).join(", ");
}
