import { describe, expect, it } from "vitest";
import { readOrdersFilters, writeOrdersFilters } from "./ordersFiltersSearchParams";

describe("readOrdersFilters", () => {
  it("starts on page 1 with no filters when the URL has none", () => {
    expect(readOrdersFilters(new URLSearchParams())).toEqual({ page: 1 });
  });

  it("reads status, offering date, phone and page from the URL", () => {
    const search = new URLSearchParams("status=cancelled&offeringDate=2026-10-30&phone=98470&page=3");

    expect(readOrdersFilters(search)).toEqual({
      status: "cancelled",
      offeringDate: "2026-10-30",
      phone: "98470",
      page: 3,
    });
  });

  it("ignores an unknown status", () => {
    expect(readOrdersFilters(new URLSearchParams("status=lost"))).toEqual({ page: 1 });
  });

  it("ignores an offering date that is not YYYY-MM-DD", () => {
    expect(readOrdersFilters(new URLSearchParams("offeringDate=30-10-2026"))).toEqual({ page: 1 });
  });

  it("ignores a blank phone search", () => {
    expect(readOrdersFilters(new URLSearchParams("phone=%20%20"))).toEqual({ page: 1 });
  });

  it.each(["0", "-2", "1.5", "two"])("falls back to page 1 when the page is %s", (page) => {
    expect(readOrdersFilters(new URLSearchParams({ page }))).toEqual({ page: 1 });
  });
});

describe("writeOrdersFilters", () => {
  it("leaves page 1 and missing filters out of the URL", () => {
    expect(writeOrdersFilters({ page: 1 }).toString()).toBe("");
  });

  it("writes every filter that is set", () => {
    const search = writeOrdersFilters({ status: "confirmed", offeringDate: "2026-11-02", phone: "9847", page: 2 });

    expect(search.toString()).toBe("status=confirmed&offeringDate=2026-11-02&phone=9847&page=2");
  });

  it("round-trips through readOrdersFilters", () => {
    const filters = { status: "completed" as const, offeringDate: "2026-10-01", phone: "98470 10", page: 4 };

    expect(readOrdersFilters(writeOrdersFilters(filters))).toEqual(filters);
  });
});
