import { EmptyState } from "../../shared/ui/EmptyState";
import { LoadingStatus } from "../../shared/ui/LoadingStatus";
import { RetryableError } from "../../shared/ui/RetryableError";
import { isBookable } from "./domain/isBookable";
import { searchBookableOfferings } from "./domain/searchBookableOfferings";
import { OfferingList } from "./OfferingList";
import { useOfferings } from "./useOfferings";

interface OfferingResultsProps {
  templeId: string;
  searchTerm: string;
}

export function OfferingResults({ templeId, searchTerm }: OfferingResultsProps) {
  const offerings = useOfferings(templeId);

  if (offerings.isPending) {
    return <LoadingStatus message="Loading offerings…" />;
  }
  if (offerings.isLoadingError) {
    return (
      <RetryableError
        message="Could not load offerings."
        isRetrying={offerings.isFetching}
        onRetry={() => void offerings.refetch()}
      />
    );
  }
  if (!offerings.data.some(isBookable)) {
    return <EmptyState message="This temple has no offerings open for booking." />;
  }
  const matchingOfferings = searchBookableOfferings(offerings.data, searchTerm);
  if (matchingOfferings.length === 0) {
    return <EmptyState message={`No offerings match "${searchTerm.trim()}".`} />;
  }
  return <OfferingList offerings={matchingOfferings} />;
}
