"use client";

import { useCategories } from "@/modules/category/hooks";
import { useSearchSuggestions } from "@/modules/products/hooks/use-search";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Tag, ArrowRight } from "lucide-react";
import Image from "next/image";
import {
  SearchSkeletonRows,
  SearchEmptyState,
  ProductRow,
  CategoryRow,
} from "./search-ui";

export function IdleState({
  onSelectCategory,
}: {
  onSelectCategory: (slug: string) => void;
}) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  const topCategories = (categories ?? []).slice(0, 8);
  if (topCategories.length === 0) return null;

  return (
    <div className="p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3" />
        Popular Categories
      </p>
      <div className="grid grid-cols-4 gap-2">
        {topCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-zinc-50 hover:bg-violet-50 border border-transparent hover:border-violet-100 transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shadow-sm">
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Tag className="w-4 h-4 text-zinc-400 group-hover:text-violet-500 transition-colors" />
              )}
            </div>
            <span className="text-[9px] font-semibold text-zinc-600 group-hover:text-violet-700 text-center leading-tight line-clamp-2 transition-colors">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SuggestionsPanel({
  query,
  debouncedQuery,
  onNavigate,
}: {
  query: string;
  debouncedQuery: string;
  onNavigate: (path: string) => void;
}) {
  const { data, isLoading, isFetching } = useSearchSuggestions(debouncedQuery);
  const hasProducts = (data?.products.length ?? 0) > 0;
  const hasCategories = (data?.categories.length ?? 0) > 0;
  const hasResults = hasProducts || hasCategories;
  const showEmpty =
    debouncedQuery.length >= 2 && !isLoading && !isFetching && !hasResults;
  const showSkeleton =
    (isLoading || (isFetching && !data)) && debouncedQuery.length >= 2;

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      {query.length < 2 && (
        <IdleState
          onSelectCategory={(slug) => onNavigate(`/products?category=${slug}`)}
        />
      )}

      {showSkeleton && <SearchSkeletonRows />}

      {showEmpty && <SearchEmptyState query={debouncedQuery} />}

      {hasResults && (
        <div className="p-2 space-y-1">
          {hasProducts && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 pt-2 pb-1">
                Products
              </p>
              {data!.products.map((p) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  onSelect={() => onNavigate(`/products/${p.slug}`)}
                />
              ))}
            </>
          )}
          {hasCategories && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 pt-3 pb-1">
                Categories
              </p>
              {data!.categories.map((c) => (
                <CategoryRow
                  key={c.id}
                  category={c}
                  onSelect={() => onNavigate(`/products?category=${c.slug}`)}
                />
              ))}
            </>
          )}
        </div>
      )}

      {query.length >= 2 && (
        <div
          className="p-3 border-t border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() =>
            onNavigate(`/products?q=${encodeURIComponent(query.trim())}`)
          }
        >
          <p className="text-[11px] font-semibold text-violet-600 flex items-center justify-center gap-1.5">
            View all results for &quot;{query}&quot;
            <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </div>
      )}
    </div>
  );
}
