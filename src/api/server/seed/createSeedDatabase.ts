import type { Database } from "../store/Database";
import { SEED_OFFERINGS } from "./offerings";
import { seedOrders } from "./seedOrders";
import { SEED_TEMPLES } from "./temples";

export function createSeedDatabase(today: Date): Database {
  const temples = structuredClone(SEED_TEMPLES);
  const offerings = structuredClone(SEED_OFFERINGS);
  return { temples, offerings, orders: seedOrders({ today, temples, offerings }) };
}
