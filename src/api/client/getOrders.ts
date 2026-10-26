import { simulateNetwork } from "../server/network/simulateNetwork";
import { searchOrders } from "../server/services/searchOrders";
import { getDatabase } from "../server/store/currentDatabase";
import type { OrdersPage } from "../types/OrdersPage";
import type { OrdersQuery } from "../types/OrdersQuery";

export function getOrders(query: OrdersQuery): Promise<OrdersPage> {
  return simulateNetwork(() => searchOrders(getDatabase(), query));
}
