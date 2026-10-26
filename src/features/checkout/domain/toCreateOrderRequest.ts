import type { CreateOrderRequest } from "../../../api/types";
import type { CartLine } from "../../cart/domain/CartLine";
import type { OrderDetails } from "../../order-form/orderDetailsSchema";

interface Checkout {
  lines: Pick<CartLine, "offeringId" | "templeId" | "quantity">[];
  details: OrderDetails;
  idempotencyKey: string;
}

export function toCreateOrderRequest({ lines, details, idempotencyKey }: Checkout): CreateOrderRequest | undefined {
  const [firstLine] = lines;
  if (!firstLine) {
    return undefined;
  }
  const { offeringDate, ...devotee } = details;
  return {
    idempotencyKey,
    templeId: firstLine.templeId,
    devotee,
    offeringDate,
    lines: lines.map(({ offeringId, quantity }) => ({ offeringId, quantity })),
  };
}
