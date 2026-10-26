import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../../test/buildCartLine";
import { cartTotal } from "./cartTotal";
import { removeFromCart } from "./removeFromCart";

describe("removeFromCart", () => {
  it("removes the line and lowers the total by its amount", () => {
    const archana = buildCartLine({ offeringId: "vaikom-archana", name: "Archana", unitPrice: 50 });

    const lines = removeFromCart([buildCartLine({ quantity: 2 }), archana], "vaikom-pushpanjali");

    expect(lines).toEqual([archana]);
    expect(cartTotal(lines)).toBe(50);
  });
});
