import { describe, expect, it } from "vitest";
import { describeOrderLines } from "./describeOrderLines";

describe("describeOrderLines", () => {
  it("lists each offering with its quantity", () => {
    const lines = [
      { offeringId: "vaikom-pushpanjali", offeringName: "Pushpanjali", unitPrice: 30, quantity: 2 },
      { offeringId: "vaikom-archana", offeringName: "Archana", unitPrice: 50, quantity: 1 },
    ];

    expect(describeOrderLines(lines)).toBe("Pushpanjali × 2, Archana × 1");
  });
});
