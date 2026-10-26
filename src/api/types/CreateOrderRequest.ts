import type { Devotee } from "./Devotee";

export interface CreateOrderRequest {
  templeId: string;
  devotee: Devotee;
  offeringDate: string;
  lines: RequestedLine[];
}

export interface RequestedLine {
  offeringId: string;
  quantity: number;
}
