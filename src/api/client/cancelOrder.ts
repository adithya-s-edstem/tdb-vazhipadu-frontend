import { simulateNetwork } from "../server/network/simulateNetwork";
import { cancelStoredOrder } from "../server/services/cancelStoredOrder";
import { getDatabase } from "../server/store/currentDatabase";
import type { Order } from "../types/Order";

export function cancelOrder(orderId: string): Promise<Order> {
  return simulateNetwork(() => cancelStoredOrder(getDatabase(), orderId));
}
