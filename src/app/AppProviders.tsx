import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

const RETRIES_BEFORE_SHOWING_AN_ERROR = 1;

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: RETRIES_BEFORE_SHOWING_AN_ERROR } } }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
