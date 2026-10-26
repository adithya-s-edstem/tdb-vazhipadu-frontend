import { describe, expect, it } from "vitest";
import { buildCreateOrderRequest } from "../../../test/buildCreateOrderRequest";
import { useInstantMockApi } from "../../../test/useInstantMockApi";
import { createOrder } from "./createOrder";
import { getOrders } from "./getOrders";

describe("createOrder", () => {
  useInstantMockApi();

  it("totals 2 Pushpanjali at ₹30 and 1 Archana at ₹50 as ₹110", async () => {
    const order = await createOrder(buildCreateOrderRequest());

    expect(order.total).toBe(110);
  });

  it("places a confirmed order with a new order number and priced lines", async () => {
    const order = await createOrder(buildCreateOrderRequest());

    expect(order).toMatchObject({ id: "VZ-1051", status: "confirmed", templeId: "vaikom" });
    expect(order.lines).toEqual([
      { offeringId: "vaikom-pushpanjali", offeringName: "Pushpanjali", unitPrice: 30, quantity: 2 },
      { offeringId: "vaikom-archana", offeringName: "Archana", unitPrice: 50, quantity: 1 },
    ]);
  });

  it("makes the new order visible to getOrders", async () => {
    const devotee = { name: "Ravi Varma", phone: "9000012345", nakshatra: "Makam" } as const;
    const order = await createOrder(buildCreateOrderRequest({ devotee }));

    const page = await getOrders({ phone: "9000012345" });

    expect(page.orders).toEqual([order]);
  });

  it("gives each placed order a different order number", async () => {
    const first = await createOrder(buildCreateOrderRequest());
    const second = await createOrder(buildCreateOrderRequest());

    expect(second.id).not.toBe(first.id);
  });

  it("rejects an order without lines", async () => {
    await expect(createOrder(buildCreateOrderRequest({ lines: [] }))).rejects.toMatchObject({
      code: "invalid-request",
    });
  });

  it("rejects an inactive offering", async () => {
    const lines = [{ offeringId: "vaikom-ennabhishekam", quantity: 1 }];

    await expect(createOrder(buildCreateOrderRequest({ lines }))).rejects.toMatchObject({ code: "invalid-request" });
  });

  it("rejects an offering from another temple", async () => {
    const lines = [{ offeringId: "ettumanoor-jaladhara", quantity: 1 }];

    await expect(createOrder(buildCreateOrderRequest({ lines }))).rejects.toMatchObject({ code: "invalid-request" });
  });

  it("rejects a quantity that is not a positive whole number", async () => {
    const lines = [{ offeringId: "vaikom-archana", quantity: 0 }];

    await expect(createOrder(buildCreateOrderRequest({ lines }))).rejects.toMatchObject({ code: "invalid-request" });
  });

  it("keeps the placed order unchanged when the caller later edits its request", async () => {
    const request = buildCreateOrderRequest();
    const pending = createOrder(request);

    request.devotee.name = "Someone Else";
    const order = await pending;

    expect(order.devotee.name).toBe("Meera Nair");
  });

  it("stores nothing when the order is rejected", async () => {
    const before = await getOrders({});

    await createOrder(buildCreateOrderRequest({ lines: [] })).catch(() => undefined);
    const after = await getOrders({});

    expect(after.total).toBe(before.total);
  });
});
