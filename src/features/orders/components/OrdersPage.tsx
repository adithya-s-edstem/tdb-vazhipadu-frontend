import { useOrdersFilters } from "../hooks/useOrdersFilters";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { OrdersResults } from "./OrdersResults";

export function OrdersPage() {
  const { filters, changeFilters, goToPage } = useOrdersFilters();

  return (
    <section aria-labelledby="orders-heading" className="space-y-4">
      <h2 id="orders-heading" className="text-2xl font-semibold">
        Orders
      </h2>
      <OrdersFilterBar filters={filters} onChange={changeFilters} />
      <OrdersResults filters={filters} onPageChange={goToPage} />
    </section>
  );
}
