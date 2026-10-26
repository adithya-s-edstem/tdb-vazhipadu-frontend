import { describe, expect, it } from "vitest";
import { useInstantMockApi } from "../../../test/useInstantMockApi";
import { getOfferings } from "./getOfferings";

describe("getOfferings", () => {
  useInstantMockApi();

  it("lists only the offerings of the requested temple", async () => {
    const offerings = await getOfferings("vaikom");

    expect(offerings.every((offering) => offering.templeId === "vaikom")).toBe(true);
    expect(offerings).toContainEqual(expect.objectContaining({ name: "Pushpanjali", price: 30, active: true }));
  });

  it("includes inactive offerings so the UI decides how to show them", async () => {
    const offerings = await getOfferings("vaikom");

    expect(offerings.some((offering) => !offering.active)).toBe(true);
  });

  it("rejects an unknown temple as not found", async () => {
    await expect(getOfferings("atlantis")).rejects.toMatchObject({ code: "not-found" });
  });
});
