import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../../test/buildCartLine";
import { lineTotal } from "./lineTotal";

describe("lineTotal", () => {
  it("multiplies the unit price by the quantity", () => {
    expect(lineTotal(buildCartLine({ unitPrice: 30, quantity: 3 }))).toBe(90);
  });
});
