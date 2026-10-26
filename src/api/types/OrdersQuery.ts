import type { OrderStatus } from "./OrderStatus";

export const DEFAULT_PAGE_SIZE = 10;

export interface OrdersQuery {
  status?: OrderStatus;
  offeringDate?: string;
  phone?: string;
  page?: number;
  pageSize?: number;
}
