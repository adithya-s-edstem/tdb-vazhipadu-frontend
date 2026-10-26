import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../../test/buildCartLine";
import { changeQuantity } from "./changeQuantity";
import { MAX_QUANTITY_PER_LINE, MIN_QUANTITY_PER_LINE } from "./quantityLimits";

const ARCHANA = buildCartLine({ offeringId: "vaikom-archana", name: "Archana", unitPrice: 50 });

describe("changeQuantity", () => {
  it("sets the quantity of the matching line only", () => {
    const lines = changeQuantity([buildCartLine(), ARCHANA], { offeringId: "vaikom-pushpanjali", quantity: 4 });

    expect(lines).toEqual([buildCartLine({ quantity: 4 }), ARCHANA]);
  });

  it("does not let the quantity go below 1", () => {
    const lines = changeQuantity([buildCartLine()], { offeringId: "vaikom-pushpanjali", quantity: 0 });

    expect(lines).toEqual([buildCartLine({ quantity: MIN_QUANTITY_PER_LINE })]);
  });

  it("does not let the quantity go above the maximum per line", () => {
    const lines = changeQuantity([buildCartLine()], {
      offeringId: "vaikom-pushpanjali",
      quantity: MAX_QUANTITY_PER_LINE + 1,
    });

    expect(lines).toEqual([buildCartLine({ quantity: MAX_QUANTITY_PER_LINE })]);
  });
});
