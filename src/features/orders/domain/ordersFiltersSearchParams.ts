import { z } from "zod";
import { ORDER_STATUSES } from "../../../api/types";

export const FIRST_PAGE = 1;

const ordersFiltersSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional().catch(undefined),
  offeringDate: z.iso.date().optional().catch(undefined),
  phone: z
    .string()
    .trim()
    .transform((phone) => phone || undefined)
    .optional()
    .catch(undefined),
  page: z.coerce.number().int().min(FIRST_PAGE).catch(FIRST_PAGE),
});

export type OrdersFilters = z.infer<typeof ordersFiltersSchema>;

export function readOrdersFilters(search: URLSearchParams): OrdersFilters {
  return ordersFiltersSchema.parse(Object.fromEntries(search));
}

export function writeOrdersFilters({ status, offeringDate, phone, page }: OrdersFilters): URLSearchParams {
  const search = new URLSearchParams();
  if (status) search.set("status", status);
  if (offeringDate) search.set("offeringDate", offeringDate);
  if (phone) search.set("phone", phone);
  if (page !== FIRST_PAGE) search.set("page", String(page));
  return search;
}
