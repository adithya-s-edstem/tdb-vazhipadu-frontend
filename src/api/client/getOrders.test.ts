import { describe, expect, it } from "vitest";
import { buildCreateOrderRequest } from "../../../test/buildCreateOrderRequest";
import { useInstantMockApi } from "../../../test/useInstantMockApi";
import { createOrder } from "./createOrder";
import { getOrders } from "./getOrders";

const TODAY = new Date(2026, 9, 26);

describe("getOrders", () => {
  useInstantMockApi(TODAY);

  it("returns the first page of 10 orders and the total count by default", async () => {
    const page = await getOrders({});

    expect(page).toMatchObject({ page: 1, pageSize: 10, total: 50 });
    expect(page.orders).toHaveLength(10);
  });

  it("lists the most recently placed orders first", async () => {
    const { orders } = await getOrders({});

    const placedTimes = orders.map((order) => order.placedAt);
    expect(placedTimes).toEqual([...placedTimes].sort().reverse());
  });

  it("returns the next orders on the next page without repeating any", async () => {
    const first = await getOrders({ page: 1 });
    const second = await getOrders({ page: 2 });

    const firstIds = first.orders.map((order) => order.id);
    expect(second.orders).toHaveLength(10);
    expect(second.orders.some((order) => firstIds.includes(order.id))).toBe(false);
  });

  it("returns a short last page", async () => {
    const page = await getOrders({ page: 3, pageSize: 20 });

    expect(page.orders).toHaveLength(10);
    expect(page.total).toBe(50);
  });

  it("returns no orders but the full total for a page past the end", async () => {
    const page = await getOrders({ page: 6 });

    expect(page.orders).toEqual([]);
    expect(page.total).toBe(50);
  });

  it.each([0, -1, 1.5])("rejects page %s as an invalid request", async (page) => {
    await expect(getOrders({ page })).rejects.toMatchObject({ code: "invalid-request" });
  });

  it.each([0, -10, 2.5])("rejects page size %s as an invalid request", async (pageSize) => {
    await expect(getOrders({ pageSize })).rejects.toMatchObject({ code: "invalid-request" });
  });

  it("shows only orders with the chosen status and counts only those", async () => {
    const page = await getOrders({ status: "cancelled", pageSize: 50 });

    expect(page.orders.length).toBeGreaterThan(0);
    expect(page.orders.every((order) => order.status === "cancelled")).toBe(true);
    expect(page.total).toBe(page.orders.length);
  });

  it("shows only orders for the chosen offering date", async () => {
    const page = await getOrders({ offeringDate: "2026-10-20", pageSize: 50 });

    expect(page.orders.length).toBeGreaterThan(0);
    expect(page.orders.every((order) => order.offeringDate === "2026-10-20")).toBe(true);
  });

  it("matches any part of the phone number", async () => {
    const page = await getOrders({ phone: "1013", pageSize: 50 });

    expect(page.orders.length).toBeGreaterThan(0);
    expect(page.orders.every((order) => order.devotee.phone.includes("1013"))).toBe(true);
  });

  it("ignores spaces in the searched phone number", async () => {
    const page = await getOrders({ phone: " 98470 10137 ", pageSize: 50 });

    expect(page.orders.map((order) => order.devotee.phone)).toEqual(["9847010137"]);
  });

  it("finds an order booked with a spaced phone number when searching without spaces", async () => {
    const devotee = { name: "Ravi Varma", phone: "99999 88888", nakshatra: "Makam" } as const;
    const order = await createOrder(buildCreateOrderRequest({ devotee }));

    const page = await getOrders({ phone: "9999988888" });

    expect(page.orders).toEqual([order]);
  });

  it("combines filters", async () => {
    const page = await getOrders({ status: "confirmed", phone: "98470", pageSize: 50 });

    expect(page.orders.every((order) => order.status === "confirmed")).toBe(true);
    expect(page.total).toBe(page.orders.length);
  });

  it("returns an empty page when nothing matches", async () => {
    const page = await getOrders({ phone: "0000000000" });

    expect(page).toMatchObject({ orders: [], total: 0 });
  });
});
