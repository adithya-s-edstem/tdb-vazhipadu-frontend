interface LoadingStatusProps {
  message: string;
}

export function LoadingStatus({ message }: LoadingStatusProps) {
  return (
    <p role="status" className="py-6 text-center text-stone-600">
      {message}
    </p>
  );
}
