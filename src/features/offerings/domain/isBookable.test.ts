import { describe, expect, it } from "vitest";
import { buildOffering } from "../../../../test/buildOffering";
import { isBookable } from "./isBookable";

describe("isBookable", () => {
  it("allows booking an active offering", () => {
    expect(isBookable(buildOffering({ active: true }))).toBe(true);
  });

  it("refuses booking an inactive offering", () => {
    expect(isBookable(buildOffering({ active: false }))).toBe(false);
  });
});
