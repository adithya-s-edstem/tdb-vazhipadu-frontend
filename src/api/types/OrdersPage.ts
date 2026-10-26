import type { Order } from "./Order";

export interface OrdersPage {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}
