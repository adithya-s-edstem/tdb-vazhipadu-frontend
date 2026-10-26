import { ApiError } from "../../types/ApiError";
import type { Order } from "../../types/Order";
import type { Database } from "../store/Database";

export function cancelStoredOrder(database: Database, orderId: string): Order {
  const order = database.orders.find((candidate) => candidate.id === orderId);
  if (!order) {
    throw new ApiError("not-found", `Order ${orderId} does not exist`);
  }
  if (order.status !== "confirmed") {
    throw new ApiError("conflict", `Order ${orderId} is ${order.status} and cannot be cancelled`);
  }
  order.status = "cancelled";
  return order;
}
