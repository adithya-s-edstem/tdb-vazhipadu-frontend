import { ApiError } from "../../types/ApiError";
import type { CreateOrderRequest } from "../../types/CreateOrderRequest";
import type { Order } from "../../types/Order";
import type { Database } from "../store/Database";
import { placeOrder } from "./placeOrder";

export function placeOrderOnce(database: Database, request: CreateOrderRequest, placedAt: Date): Order {
  const idempotencyKey = request.idempotencyKey.trim();
  if (idempotencyKey === "") {
    throw new ApiError("invalid-request", "An order needs an idempotency key");
  }
  const earlierOrder = findOrderPlacedWith(database, idempotencyKey);
  if (earlierOrder) {
    return earlierOrder;
  }
  const order = placeOrder(database, request, placedAt);
  database.orderIdsByIdempotencyKey.set(idempotencyKey, order.id);
  return order;
}

function findOrderPlacedWith(database: Database, idempotencyKey: string): Order | undefined {
  const orderId = database.orderIdsByIdempotencyKey.get(idempotencyKey);
  return database.orders.find((order) => order.id === orderId);
}
