import { QueryCache, QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { logger } from "./utils";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          logger.error(
            "Query Error",
            { failureCount, error },
            { module: "QueryClient" },
          );
          if (failureCount > 3) return false;

          return true;
        },
        refetchOnWindowFocus: process.env.NODE_ENV === "production",
        staleTime: 3 * 60 * 1000, // 3 minutes
      },
      mutations: {
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";

          // Ignore internal Next.js redirect errors
          if (message === "NEXT_REDIRECT") return;

          toast.error(message);
        },
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        logger.error("Global Query Cache Error", error, { module: "QueryCache" });
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during hydration, or on client-side navigation.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

