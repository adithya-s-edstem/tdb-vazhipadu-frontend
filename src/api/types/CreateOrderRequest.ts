import type { Devotee } from "./Devotee";

export interface CreateOrderRequest {
  idempotencyKey: string;
  templeId: string;
  devotee: Devotee;
  offeringDate: string;
  lines: RequestedLine[];
}

export interface RequestedLine {
  offeringId: string;
  quantity: number;
}
