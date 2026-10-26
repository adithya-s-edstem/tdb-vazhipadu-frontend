import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../test/buildCartLine";
import { restoreCartLines } from "./restoreCartLines";

describe("restoreCartLines", () => {
  it("keeps every valid saved line", () => {
    const lines = [buildCartLine(), buildCartLine({ offeringId: "vaikom-archana", name: "Archana", quantity: 10 })];

    expect(restoreCartLines({ lines })).toEqual(lines);
  });

  it("drops a line whose quantity is above the per-line limit", () => {
    const validLine = buildCartLine();
    const oversizedLine = buildCartLine({ offeringId: "vaikom-archana", quantity: 50 });

    const restoredLines = restoreCartLines({ lines: [validLine, oversizedLine] });

    expect(restoredLines).toEqual([validLine]);
  });

  it("drops a line whose quantity is below 1", () => {
    expect(restoreCartLines({ lines: [buildCartLine({ quantity: 0 })] })).toEqual([]);
  });

  it("drops a line with a fractional quantity", () => {
    expect(restoreCartLines({ lines: [buildCartLine({ quantity: 1.5 })] })).toEqual([]);
  });

  it("drops a line with a missing price", () => {
    const lineWithoutPrice = { offeringId: "vaikom-pushpanjali", templeId: "vaikom", name: "Pushpanjali", quantity: 1 };

    expect(restoreCartLines({ lines: [lineWithoutPrice] })).toEqual([]);
  });

  it.each([undefined, null, "cart", {}, { lines: "many" }])("starts with an empty cart when %j was saved", (saved) => {
    expect(restoreCartLines(saved)).toEqual([]);
  });
});
