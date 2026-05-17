"use client";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function QueryClientProviderWrapper({ children }: React.PropsWithChildren) {
  // NOTE: Avoid useMemo here as it's not stable enough across React's re-renders
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={true} />
      )}
    </QueryClientProvider>
  );
}

export default QueryClientProviderWrapper;
