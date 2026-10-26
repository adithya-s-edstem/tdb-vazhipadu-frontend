import { describe, expect, it } from "vitest";
import { formatRupees } from "./formatRupees";

describe("formatRupees", () => {
  it("shows whole rupees with the rupee sign", () => {
    expect(formatRupees(30)).toBe("₹30");
  });

  it("groups thousands the Indian way", () => {
    expect(formatRupees(125000)).toBe("₹1,25,000");
  });

  it("shows zero as ₹0", () => {
    expect(formatRupees(0)).toBe("₹0");
  });
});
