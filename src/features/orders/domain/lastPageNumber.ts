import type { OrdersPage } from "../../../api/types";
import { FIRST_PAGE } from "./ordersFiltersSearchParams";

export function lastPageNumber({ total, pageSize }: Pick<OrdersPage, "total" | "pageSize">): number {
  return Math.max(FIRST_PAGE, Math.ceil(total / pageSize));
}
