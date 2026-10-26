import { formatISO } from "date-fns";
import { ApiError } from "../../types/ApiError";
import type { CreateOrderRequest, RequestedLine } from "../../types/CreateOrderRequest";
import type { Offering } from "../../types/Offering";
import type { Order } from "../../types/Order";
import type { OrderLine } from "../../types/OrderLine";
import type { Database } from "../store/Database";
import { orderIdFor } from "./orderId";
import { orderTotal } from "./orderTotal";

export function placeOrder(database: Database, request: CreateOrderRequest, placedAt: Date): Order {
  if (request.lines.length === 0) {
    throw new ApiError("invalid-request", "An order needs at least one offering");
  }
  const lines = request.lines.map((line) => priceLine(database.offerings, request.templeId, line));
  const order: Order = {
    id: orderIdFor(database.orders.length),
    templeId: request.templeId,
    devotee: request.devotee,
    offeringDate: request.offeringDate,
    placedAt: formatISO(placedAt),
    lines,
    total: orderTotal(lines),
    status: "confirmed",
  };
  database.orders.push(order);
  return order;
}

function priceLine(offerings: Offering[], templeId: string, { offeringId, quantity }: RequestedLine): OrderLine {
  const offering = offerings.find((candidate) => candidate.id === offeringId);
  if (!offering || offering.templeId !== templeId || !offering.active) {
    throw new ApiError("invalid-request", `Offering ${offeringId} cannot be booked at this temple`);
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError("invalid-request", `Quantity for ${offering.name} must be a whole number of at least 1`);
  }
  return { offeringId, offeringName: offering.name, unitPrice: offering.price, quantity };
}
