import type { OrderStatus } from "../../../api/types";

export function canCancelOrder(status: OrderStatus): boolean {
  return status === "confirmed";
}
