import { describe, expect, it } from "vitest";
import { buildCartLine } from "../../../../test/buildCartLine";
import { toCreateOrderRequest } from "./toCreateOrderRequest";

const DETAILS = { name: "Meera Nair", phone: "9847000001", nakshatra: "Rohini", offeringDate: "2026-11-02" } as const;

describe("toCreateOrderRequest", () => {
  it("sends each cart line as an offering and quantity for the cart's temple", () => {
    const lines = [
      buildCartLine({ quantity: 2 }),
      buildCartLine({ offeringId: "vaikom-archana", name: "Archana", unitPrice: 50 }),
    ];

    const request = toCreateOrderRequest({ lines, details: DETAILS, idempotencyKey: "attempt-1" });

    expect(request).toEqual({
      idempotencyKey: "attempt-1",
      templeId: "vaikom",
      devotee: { name: "Meera Nair", phone: "9847000001", nakshatra: "Rohini" },
      offeringDate: "2026-11-02",
      lines: [
        { offeringId: "vaikom-pushpanjali", quantity: 2 },
        { offeringId: "vaikom-archana", quantity: 1 },
      ],
    });
  });

  it("returns nothing for an empty cart", () => {
    const request = toCreateOrderRequest({ lines: [], details: DETAILS, idempotencyKey: "attempt-1" });

    expect(request).toBeUndefined();
  });
});
