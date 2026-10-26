import { describe, expect, it } from "vitest";
import { canCancelOrder } from "./canCancelOrder";

describe("canCancelOrder", () => {
  it("allows cancelling a confirmed order", () => {
    expect(canCancelOrder("confirmed")).toBe(true);
  });

  it("does not allow cancelling an order that is already cancelled", () => {
    expect(canCancelOrder("cancelled")).toBe(false);
  });

  it("does not allow cancelling a completed past order", () => {
    expect(canCancelOrder("completed")).toBe(false);
  });
});
