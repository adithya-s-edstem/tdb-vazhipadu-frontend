import type { Order } from "../../../api/types";
import { formatIsoDate } from "../../../shared/format/formatIsoDate";
import { formatRupees } from "../../../shared/format/formatRupees";
import { canCancelOrder } from "../domain/canCancelOrder";
import { CancelOrderButton } from "./CancelOrderButton";
import { describeOrderLines } from "./describeOrderLines";
import { ORDER_STATUS_LABELS } from "./orderStatusLabels";

interface OrderRowProps {
  order: Order;
}

const CELL_CLASSES = "px-3 py-2 align-top";

export function OrderRow({ order }: OrderRowProps) {
  return (
    <tr className="border-t border-amber-100">
      <th scope="row" className={`${CELL_CLASSES} font-mono font-normal`}>
        {order.id}
      </th>
      <td className={CELL_CLASSES}>{formatIsoDate(order.offeringDate)}</td>
      <td className={CELL_CLASSES}>
        <div>{order.devotee.name}</div>
        <div className="text-stone-600">{order.devotee.phone}</div>
      </td>
      <td className={CELL_CLASSES}>{describeOrderLines(order.lines)}</td>
      <td className={CELL_CLASSES}>{formatRupees(order.total)}</td>
      <td className={CELL_CLASSES}>{ORDER_STATUS_LABELS[order.status]}</td>
      <td className={CELL_CLASSES}>{canCancelOrder(order.status) && <CancelOrderButton orderId={order.id} />}</td>
    </tr>
  );
}
