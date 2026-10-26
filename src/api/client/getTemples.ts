import { simulateNetwork } from "../server/network/simulateNetwork";
import { listTemples } from "../server/services/listTemples";
import { getDatabase } from "../server/store/currentDatabase";
import type { Temple } from "../types/Temple";

export function getTemples(): Promise<Temple[]> {
  return simulateNetwork(() => listTemples(getDatabase()));
}
