import { useSearchParams, type NavigateOptions } from "react-router";
import {
  FIRST_PAGE,
  readOrdersFilters,
  writeOrdersFilters,
  type OrdersFilters,
} from "../domain/ordersFiltersSearchParams";

export type OrdersFilterChanges = Partial<Omit<OrdersFilters, "page">>;

export function useOrdersFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readOrdersFilters(searchParams);

  function changeFilters(changes: OrdersFilterChanges): void {
    setSearchParams(writeOrdersFilters({ ...filters, ...changes, page: FIRST_PAGE }));
  }

  function goToPage(page: number, options?: NavigateOptions): void {
    setSearchParams(writeOrdersFilters({ ...filters, page }), options);
  }

  return { filters, changeFilters, goToPage };
}
