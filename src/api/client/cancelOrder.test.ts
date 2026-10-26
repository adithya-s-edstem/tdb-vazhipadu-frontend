import { describe, expect, it } from "vitest";
import type { OrderStatus } from "../types";
import { useInstantMockApi } from "../../../test/useInstantMockApi";
import { cancelOrder } from "./cancelOrder";
import { getOrders } from "./getOrders";

async function firstOrderIdWith(status: OrderStatus): Promise<string> {
  const { orders } = await getOrders({ status, pageSize: 1 });
  const order = orders[0];
  if (!order) {
    throw new Error(`Seed has no ${status} order`);
  }
  return order.id;
}

describe("cancelOrder", () => {
  useInstantMockApi();

  it("cancels a confirmed order and returns it as cancelled", async () => {
    const orderId = await firstOrderIdWith("confirmed");

    const order = await cancelOrder(orderId);

    expect(order).toMatchObject({ id: orderId, status: "cancelled" });
  });

  it("shows the order as cancelled in later order lists", async () => {
    const orderId = await firstOrderIdWith("confirmed");

    await cancelOrder(orderId);
    const { orders } = await getOrders({ status: "cancelled", pageSize: 50 });

    expect(orders.map((order) => order.id)).toContain(orderId);
  });

  it("rejects cancelling an order that is already cancelled", async () => {
    const orderId = await firstOrderIdWith("cancelled");

    await expect(cancelOrder(orderId)).rejects.toMatchObject({ code: "conflict" });
  });

  it("rejects cancelling a completed order", async () => {
    const orderId = await firstOrderIdWith("completed");

    await expect(cancelOrder(orderId)).rejects.toMatchObject({ code: "conflict" });
  });

  it("rejects an unknown order as not found", async () => {
    await expect(cancelOrder("VZ-9999")).rejects.toMatchObject({ code: "not-found" });
  });
});
