import type { Devotee } from "./Devotee";
import type { OrderLine } from "./OrderLine";
import type { OrderStatus } from "./OrderStatus";

export interface Order {
  id: string;
  templeId: string;
  devotee: Devotee;
  offeringDate: string;
  placedAt: string;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
}
