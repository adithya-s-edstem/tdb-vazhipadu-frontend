import type { CartLine } from "./CartLine";

export type OrderedLine = Pick<CartLine, "offeringId" | "quantity">;

export function removeOrderedLines(lines: CartLine[], orderedLines: OrderedLine[]): CartLine[] {
  return lines
    .map((line) => ({ ...line, quantity: line.quantity - orderedQuantity(orderedLines, line.offeringId) }))
    .filter((line) => line.quantity > 0);
}

function orderedQuantity(orderedLines: OrderedLine[], offeringId: string): number {
  return orderedLines.find((orderedLine) => orderedLine.offeringId === offeringId)?.quantity ?? 0;
}
