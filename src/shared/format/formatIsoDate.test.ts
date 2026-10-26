import { describe, expect, it } from "vitest";
import { formatIsoDate } from "./formatIsoDate";

describe("formatIsoDate", () => {
  it("shows an ISO date as day, short month and year", () => {
    expect(formatIsoDate("2026-11-02")).toBe("2 Nov 2026");
  });
});
