import type { Offering } from "../../../api/types";
import type { CartLine } from "./CartLine";
import { canAddToCart } from "./canAddToCart";
import { changeQuantity } from "./changeQuantity";

export type CartableOffering = Pick<Offering, "id" | "templeId" | "name" | "price">;

export function addToCart(lines: CartLine[], offering: CartableOffering): CartLine[] {
  if (!canAddToCart(lines, offering.templeId)) {
    return lines;
  }
  const existingLine = lines.find((line) => line.offeringId === offering.id);
  if (existingLine) {
    return changeQuantity(lines, { offeringId: offering.id, quantity: existingLine.quantity + 1 });
  }
  return [...lines, newLineFor(offering)];
}

function newLineFor(offering: CartableOffering): CartLine {
  return {
    offeringId: offering.id,
    templeId: offering.templeId,
    name: offering.name,
    unitPrice: offering.price,
    quantity: 1,
  };
}
