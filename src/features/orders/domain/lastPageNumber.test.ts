import { describe, expect, it } from "vitest";
import { lastPageNumber } from "./lastPageNumber";

describe("lastPageNumber", () => {
  it("is page 1 when there are no orders", () => {
    expect(lastPageNumber({ total: 0, pageSize: 10 })).toBe(1);
  });

  it("is page 1 when every order fits on one page", () => {
    expect(lastPageNumber({ total: 10, pageSize: 10 })).toBe(1);
  });

  it("adds a page for orders that spill past a full page", () => {
    expect(lastPageNumber({ total: 11, pageSize: 10 })).toBe(2);
  });
});
