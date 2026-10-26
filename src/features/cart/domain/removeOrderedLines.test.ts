import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../../test/buildCartLine";
import { removeOrderedLines } from "./removeOrderedLines";

const ARCHANA = { offeringId: "vaikom-archana", name: "Archana", unitPrice: 50 };

function orderedPushpanjali(quantity: number) {
  return { offeringId: "vaikom-pushpanjali", quantity };
}

describe("removeOrderedLines", () => {
  it("removes every line that was ordered in full", () => {
    const lines = [buildCartLine({ quantity: 2 }), buildCartLine(ARCHANA)];

    const remaining = removeOrderedLines(lines, [orderedPushpanjali(2), { offeringId: "vaikom-archana", quantity: 1 }]);

    expect(remaining).toEqual([]);
  });

  it("keeps an offering added after the order was sent", () => {
    const archana = buildCartLine(ARCHANA);

    const remaining = removeOrderedLines([buildCartLine(), archana], [orderedPushpanjali(1)]);

    expect(remaining).toEqual([archana]);
  });

  it("keeps the quantity added to a line after the order was sent", () => {
    const remaining = removeOrderedLines([buildCartLine({ quantity: 3 })], [orderedPushpanjali(2)]);

    expect(remaining).toEqual([buildCartLine({ quantity: 1 })]);
  });

  it("removes a line whose quantity was lowered after the order was sent", () => {
    const remaining = removeOrderedLines([buildCartLine({ quantity: 1 })], [orderedPushpanjali(2)]);

    expect(remaining).toEqual([]);
  });
});
