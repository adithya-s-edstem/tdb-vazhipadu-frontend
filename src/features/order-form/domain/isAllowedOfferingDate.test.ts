import { describe, expect, it } from "vitest";
import { isAllowedOfferingDate } from "./isAllowedOfferingDate";

const TODAY_EVENING = new Date(2026, 9, 26, 19, 30);

describe("isAllowedOfferingDate", () => {
  it("rejects a date in the past", () => {
    expect(isAllowedOfferingDate("2026-10-25", TODAY_EVENING)).toBe(false);
  });

  it("accepts today, even late in the day", () => {
    expect(isAllowedOfferingDate("2026-10-26", TODAY_EVENING)).toBe(true);
  });

  it("accepts a future date", () => {
    expect(isAllowedOfferingDate("2026-11-02", TODAY_EVENING)).toBe(true);
  });

  it("rejects text that is not a date", () => {
    expect(isAllowedOfferingDate("next week", TODAY_EVENING)).toBe(false);
  });
});
