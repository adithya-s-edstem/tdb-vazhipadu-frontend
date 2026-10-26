import type { FormEvent } from "react";
import { ORDER_STATUSES, type OrderStatus } from "../../../api/types";
import type { OrdersFilters } from "../domain/ordersFiltersSearchParams";
import type { OrdersFilterChanges } from "../hooks/useOrdersFilters";
import { ORDER_STATUS_LABELS } from "./orderStatusLabels";

interface OrdersFilterBarProps {
  filters: OrdersFilters;
  onChange: (changes: OrdersFilterChanges) => void;
}

const ALL_STATUSES = "";
const FIELD_CLASSES = "mt-1 block w-full rounded border border-stone-400 bg-white px-2 py-1.5";

export function OrdersFilterBar({ filters, onChange }: OrdersFilterBarProps) {
  function searchPhone(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const phone = String(new FormData(event.currentTarget).get("phone") ?? "").trim();
    onChange({ phone: phone || undefined });
  }

  return (
    <div className="grid gap-3 rounded border border-amber-200 bg-white p-3 sm:grid-cols-3">
      <label className="text-sm font-medium">
        Status
        <select
          className={FIELD_CLASSES}
          value={filters.status ?? ALL_STATUSES}
          onChange={(event) => onChange({ status: toStatus(event.target.value) })}
        >
          <option value={ALL_STATUSES}>All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Offering date
        <input
          type="date"
          className={FIELD_CLASSES}
          value={filters.offeringDate ?? ""}
          onChange={(event) => onChange({ offeringDate: event.target.value || undefined })}
        />
      </label>
      <form role="search" aria-label="Search by phone" className="text-sm font-medium" onSubmit={searchPhone}>
        <label htmlFor="orders-phone-search">Phone number</label>
        <div className="mt-1 flex gap-2">
          <input
            id="orders-phone-search"
            key={filters.phone ?? ""}
            name="phone"
            type="search"
            inputMode="tel"
            defaultValue={filters.phone ?? ""}
            className="block w-full rounded border border-stone-400 bg-white px-2 py-1.5"
          />
          <button type="submit" className="rounded bg-amber-700 px-3 py-1.5 font-semibold text-white">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

function toStatus(value: string): OrderStatus | undefined {
  return ORDER_STATUSES.find((status) => status === value);
}
