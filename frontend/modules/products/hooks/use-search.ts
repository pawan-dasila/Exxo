import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  searchSuggestionsAction,
  SearchSuggestionsResponse,
} from "../actions/search";

export const searchKeys = {
  all: ["products", "search-suggestions"] as const,
  suggestions: (q: string) =>
    [...searchKeys.all, q] as const,
};

/**
 * Fetches typeahead search suggestions for products and categories.
 * - Only fires when query is >= 2 characters
 * - Caches results for 60 seconds (same query won't re-fetch within 1 min)
 * - Uses keepPreviousData to prevent flash of empty state during debounce
 */
export function useSearchSuggestions(query: string) {
  const trimmed = query.trim();

  return useQuery<SearchSuggestionsResponse, Error>({
    queryKey: searchKeys.suggestions(trimmed),
    queryFn: () => searchSuggestionsAction(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 1000 * 60, // 60 seconds — same query reuses cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    placeholderData: keepPreviousData, // no empty flash between debounce fires
  });
}
