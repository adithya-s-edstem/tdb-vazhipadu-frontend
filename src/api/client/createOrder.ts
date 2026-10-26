import { simulateNetwork } from "../server/network/simulateNetwork";
import { placeOrder } from "../server/services/placeOrder";
import { getDatabase } from "../server/store/currentDatabase";
import type { CreateOrderRequest } from "../types/CreateOrderRequest";
import type { Order } from "../types/Order";

export function createOrder(request: CreateOrderRequest): Promise<Order> {
  const sentRequest = structuredClone(request);
  return simulateNetwork(() => placeOrder(getDatabase(), sentRequest, new Date()));
}
