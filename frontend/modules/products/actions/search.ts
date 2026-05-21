import { axiosInstance } from "@/hooks/use-axios";
import { ApiResponse } from "@/lib/types/api";

export interface SuggestionProduct {
  id: string;
  name: string;
  slug: string;
  rentalPrice: number;
  images: { imageUrl: string }[];
  category: { id: string; name: string; slug: string } | null;
}

export interface SuggestionCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  _count: { products: number };
}

export interface SearchSuggestionsResponse {
  products: SuggestionProduct[];
  categories: SuggestionCategory[];
}

export async function searchSuggestionsAction(
  q: string,
): Promise<SearchSuggestionsResponse> {
  const response = await axiosInstance.get<
    ApiResponse<SearchSuggestionsResponse>
  >("/products/search/suggestions", {
    params: { q },
  });
  return (
    response.data.data ?? {
      products: [],
      categories: [],
    }
  );
}
