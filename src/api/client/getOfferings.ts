import { simulateNetwork } from "../server/network/simulateNetwork";
import { listOfferings } from "../server/services/listOfferings";
import { getDatabase } from "../server/store/currentDatabase";
import type { Offering } from "../types/Offering";

export function getOfferings(templeId: string): Promise<Offering[]> {
  return simulateNetwork(() => listOfferings(getDatabase(), templeId));
}
