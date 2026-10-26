import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../../test/buildCartLine";
import { canAddToCart } from "./canAddToCart";

describe("canAddToCart", () => {
  it("accepts any temple when the cart is empty", () => {
    expect(canAddToCart([], "ettumanoor")).toBe(true);
  });

  it("accepts offerings from the temple already in the cart", () => {
    expect(canAddToCart([buildCartLine()], "vaikom")).toBe(true);
  });

  it("rejects offerings from a different temple than the one in the cart", () => {
    expect(canAddToCart([buildCartLine()], "ettumanoor")).toBe(false);
  });
});
