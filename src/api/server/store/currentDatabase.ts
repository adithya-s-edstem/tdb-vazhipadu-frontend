import { createSeedDatabase } from "../seed/createSeedDatabase";
import type { Database } from "./Database";

let currentDatabase: Database = createSeedDatabase(new Date());

export function getDatabase(): Database {
  return currentDatabase;
}

export function resetDatabase(today: Date = new Date()): void {
  currentDatabase = createSeedDatabase(today);
}
