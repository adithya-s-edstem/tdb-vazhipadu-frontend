import type { CreateOrderRequest } from "../src/api/types";

export function buildCreateOrderRequest(overrides: Partial<CreateOrderRequest> = {}): CreateOrderRequest {
  return {
    templeId: "vaikom",
    devotee: { name: "Meera Nair", phone: "9847000001", nakshatra: "Rohini" },
    offeringDate: "2026-11-02",
    lines: [
      { offeringId: "vaikom-pushpanjali", quantity: 2 },
      { offeringId: "vaikom-archana", quantity: 1 },
    ],
    ...overrides,
  };
}
