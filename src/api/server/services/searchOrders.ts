import type { Order } from "../../types/Order";
import type { OrdersPage } from "../../types/OrdersPage";
import { DEFAULT_PAGE_SIZE, type OrdersQuery } from "../../types/OrdersQuery";
import type { Database } from "../store/Database";

const FIRST_PAGE = 1;

export function searchOrders(database: Database, query: OrdersQuery): OrdersPage {
  const page = query.page ?? FIRST_PAGE;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const matching = database.orders.filter((order) => matchesQuery(order, query)).sort(byNewestPlaced);
  const start = (page - 1) * pageSize;
  return { orders: matching.slice(start, start + pageSize), total: matching.length, page, pageSize };
}

function matchesQuery(order: Order, { status, offeringDate, phone }: OrdersQuery): boolean {
  return (
    (status === undefined || order.status === status) &&
    (offeringDate === undefined || order.offeringDate === offeringDate) &&
    withoutSpaces(order.devotee.phone).includes(withoutSpaces(phone ?? ""))
  );
}

function withoutSpaces(phone: string): string {
  return phone.replace(/\s/g, "");
}

function byNewestPlaced(first: Order, second: Order): number {
  return Date.parse(second.placedAt) - Date.parse(first.placedAt);
}
