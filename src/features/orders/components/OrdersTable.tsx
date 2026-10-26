import type { Order } from "../../../api/types";
import { OrderRow } from "./OrderRow";

interface OrdersTableProps {
  orders: Order[];
}

const COLUMNS = ["Order", "Offering date", "Devotee", "Offerings", "Total", "Status", "Actions"];

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded border border-amber-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-amber-100">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="px-3 py-2 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
