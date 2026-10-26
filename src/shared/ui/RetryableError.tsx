interface RetryableErrorProps {
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}

export function RetryableError({ message, isRetrying, onRetry }: RetryableErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-4 rounded border border-red-300 bg-red-50 p-4"
    >
      <p className="text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="rounded bg-red-700 px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {isRetrying ? "Trying again…" : "Try again"}
      </button>
    </div>
  );
}
