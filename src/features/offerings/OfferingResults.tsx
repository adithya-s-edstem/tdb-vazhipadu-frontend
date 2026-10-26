import { EmptyState } from "../../shared/ui/EmptyState";
import { LoadingStatus } from "../../shared/ui/LoadingStatus";
import { RetryableError } from "../../shared/ui/RetryableError";
import { describeSearchResults } from "./describeSearchResults";
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
  return (
    <div className="flex flex-col gap-3">
      <p role="status" className="text-stone-600">
        {describeSearchResults(matchingOfferings.length, searchTerm)}
      </p>
      {matchingOfferings.length > 0 && <OfferingList offerings={matchingOfferings} />}
    </div>
  );
}
