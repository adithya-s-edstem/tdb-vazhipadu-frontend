import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../../test/buildCartLine";
import { cartTotal } from "./cartTotal";

describe("cartTotal", () => {
  it("is 110 rupees for 2 Pushpanjali at 30 and 1 Archana at 50", () => {
    const lines = [
      buildCartLine({ quantity: 2 }),
      buildCartLine({ offeringId: "vaikom-archana", name: "Archana", unitPrice: 50 }),
    ];

    expect(cartTotal(lines)).toBe(110);
  });

  it("is zero for an empty cart", () => {
    expect(cartTotal([])).toBe(0);
  });
});
