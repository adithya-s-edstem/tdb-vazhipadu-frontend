import type { Temple } from "../../types/Temple";
import type { Database } from "../store/Database";

export function listTemples(database: Database): Temple[] {
  return database.temples;
}
