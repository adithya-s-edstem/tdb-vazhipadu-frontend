import type { Offering } from "../../types/Offering";
import type { Order } from "../../types/Order";
import type { Temple } from "../../types/Temple";

export interface Database {
  temples: Temple[];
  offerings: Offering[];
  orders: Order[];
  orderIdsByIdempotencyKey: Map<string, string>;
}
