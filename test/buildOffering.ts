import type { Offering } from "../src/api/types";

export function buildOffering(overrides: Partial<Offering> = {}): Offering {
  return {
    id: "vaikom-pushpanjali",
    templeId: "vaikom",
    name: "Pushpanjali",
    price: 30,
    active: true,
    ...overrides,
  };
}
