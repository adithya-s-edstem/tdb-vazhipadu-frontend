import { ApiError } from "../../types/ApiError";
import type { Offering } from "../../types/Offering";
import type { Database } from "../store/Database";

export function listOfferings(database: Database, templeId: string): Offering[] {
  if (!database.temples.some((temple) => temple.id === templeId)) {
    throw new ApiError("not-found", `Temple ${templeId} does not exist`);
  }
  return database.offerings.filter((offering) => offering.templeId === templeId);
}
