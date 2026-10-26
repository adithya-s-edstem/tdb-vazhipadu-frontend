import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../../test/buildCartLine";
import { buildOffering } from "../../../../test/buildOffering";
import { addToCart } from "./addToCart";
import { MAX_QUANTITY_PER_LINE } from "./quantityLimits";

describe("addToCart", () => {
  it("adds a new offering as a line with quantity 1", () => {
    const lines = addToCart([], buildOffering());

    expect(lines).toEqual([buildCartLine({ quantity: 1 })]);
  });

  it("adds one more to the quantity when the offering is already in the cart", () => {
    const lines = addToCart([buildCartLine({ quantity: 2 })], buildOffering());

    expect(lines).toEqual([buildCartLine({ quantity: 3 })]);
  });

  it("keeps the quantity at the maximum when adding past it", () => {
    const lines = addToCart([buildCartLine({ quantity: MAX_QUANTITY_PER_LINE })], buildOffering());

    expect(lines).toEqual([buildCartLine({ quantity: MAX_QUANTITY_PER_LINE })]);
  });

  it("leaves the cart unchanged when the offering is from another temple", () => {
    const cart = [buildCartLine()];

    const lines = addToCart(cart, buildOffering({ id: "ettumanoor-thulabharam", templeId: "ettumanoor" }));

    expect(lines).toEqual(cart);
  });
});
