import { EmptyState } from "../../shared/ui/EmptyState";
import { LoadingStatus } from "../../shared/ui/LoadingStatus";
import { RetryableError } from "../../shared/ui/RetryableError";
import { TempleOfferings } from "./TempleOfferings";
import { useTemples } from "./useTemples";

export function OfferingsPage() {
  const temples = useTemples();

  if (temples.isPending) {
    return <LoadingStatus message="Loading temples…" />;
  }
  if (temples.isError) {
    return (
      <RetryableError
        message="Could not load temples."
        isRetrying={temples.isFetching}
        onRetry={() => void temples.refetch()}
      />
    );
  }
  const [defaultTemple] = temples.data;
  if (!defaultTemple) {
    return <EmptyState message="No temples are taking bookings right now." />;
  }
  return <TempleOfferings temples={temples.data} defaultTempleId={defaultTemple.id} />;
}
