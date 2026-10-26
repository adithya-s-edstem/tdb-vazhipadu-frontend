import { describe, expect, it } from "vitest";
import { buildCreateOrderRequest } from "../../../test/buildCreateOrderRequest";
import { useInstantMockApi } from "../../../test/useInstantMockApi";
import { cancelOrder, createOrder, getOfferings, getOrders, getTemples } from ".";
import { configureMockApi, resetMockApi } from "./mockApiSettings";

describe("mock API settings", () => {
  useInstantMockApi();

  it("rejects every operation with a network error when the failure rate is 1", async () => {
    configureMockApi({ failureRate: 1 });

    const outcomes = await Promise.allSettled([
      getTemples(),
      getOfferings("vaikom"),
      createOrder(buildCreateOrderRequest()),
      getOrders({}),
      cancelOrder("VZ-1050"),
    ]);

    expect(outcomes).toHaveLength(5);
    for (const outcome of outcomes) {
      expect(outcome).toMatchObject({ status: "rejected", reason: { code: "network" } });
    }
  });

  it("restores the seeded orders on reset", async () => {
    await createOrder(buildCreateOrderRequest());

    resetMockApi();
    configureMockApi({ minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });
    const page = await getOrders({});

    expect(page.total).toBe(50);
  });
});
