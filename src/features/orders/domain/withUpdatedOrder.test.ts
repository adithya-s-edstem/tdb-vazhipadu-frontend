import { describe, expect, it } from "vitest";
import type { Order, OrdersPage } from "../../../api/types";
import { withUpdatedOrder } from "./withUpdatedOrder";

function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "VZ-0001",
    templeId: "vaikom",
    devotee: { name: "Meera Nair", phone: "9847000001", nakshatra: "Rohini" },
    offeringDate: "2026-11-02",
    placedAt: "2026-10-20T09:00:00+05:30",
    lines: [{ offeringId: "vaikom-archana", offeringName: "Archana", unitPrice: 50, quantity: 1 }],
    total: 50,
    status: "confirmed",
    ...overrides,
  };
}

function buildPage(orders: Order[]): OrdersPage {
  return { orders, total: orders.length, page: 1, pageSize: 10 };
}

describe("withUpdatedOrder", () => {
  it("replaces the order with the same id", () => {
    const page = buildPage([buildOrder({ id: "VZ-0001" }), buildOrder({ id: "VZ-0002" })]);

    const updated = withUpdatedOrder(page, buildOrder({ id: "VZ-0002", status: "cancelled" }));

    expect(updated.orders.map((order) => order.status)).toEqual(["confirmed", "cancelled"]);
  });

  it("leaves a page without that order unchanged", () => {
    const page = buildPage([buildOrder({ id: "VZ-0001" })]);

    expect(withUpdatedOrder(page, buildOrder({ id: "VZ-0009", status: "cancelled" }))).toEqual(page);
  });
});
