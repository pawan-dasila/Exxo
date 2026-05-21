"use client";

import React from "react";
import { useCategories } from "../hooks";
import { CategoryCard } from "./CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FolderIcon, AlertCircleIcon, RefreshCcwIcon } from "lucide-react";

export interface CategoryGridProps {
  limit?: number;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ limit }) => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories();

  // 1. Loading State (Animated Skeleton cards matching premium proportions)
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-label="Loading marketplace categories..."
      >
        {Array.from({ length: limit ?? 6 }).map((_, index) => (
          <div
            key={index}
            className="relative flex h-64 w-full flex-col justify-end p-6 overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800"
          >
            <Skeleton className="absolute inset-0 h-full w-full opacity-60" />
            <div className="relative z-10 flex flex-col gap-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State (Friendly, actionable message block)
  if (isError) {
    return (
      <div className="mx-auto max-w-2xl py-8" role="alert">
        <Alert
          variant="destructive"
          className="flex flex-col gap-4 p-6 rounded-2xl border-destructive/30 bg-destructive/5"
        >
          <div className="flex items-start gap-3">
            <AlertCircleIcon className="h-6 w-6 shrink-0 text-destructive" />
            <div>
              <AlertTitle className="text-lg font-semibold font-sans tracking-tight text-destructive">
                Unable to Load Collections
              </AlertTitle>
              <AlertDescription className="mt-1 text-sm leading-relaxed text-red-950 dark:text-red-200">
                {error?.message ||
                  "An unexpected error occurred while fetching the marketplace categories. Please try again."}
              </AlertDescription>
            </div>
          </div>
          <button
            onClick={() => void refetch()}
            className="flex items-center justify-center gap-2 self-end rounded-lg bg-destructive px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-destructive/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
            aria-label="Retry loading categories"
          >
            <RefreshCcwIcon className="h-3.5 w-3.5" />
            Try Again
          </button>
        </Alert>
      </div>
    );
  }

  // Slice list if limit parameter is defined
  const displayedCategories = limit ? categories?.slice(0, limit) : categories;

  // 3. Empty State
  if (!displayedCategories || displayedCategories.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-800 rounded-3xl p-8"
        role="status"
        aria-live="polite"
      >
        <div className="rounded-full bg-zinc-950 p-4 border border-zinc-800 text-zinc-400">
          <FolderIcon className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-serif font-semibold text-zinc-100">
          No Categories Available
        </h3>
        <p className="mt-2 text-sm text-zinc-400 max-w-sm leading-relaxed">
          The catalog is currently being prepared. Check back shortly for
          premium rental choices.
        </p>
      </div>
    );
  }

  // 4. Data Render Grid
  return (
    <nav aria-label="Browse catalog by category">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </nav>
  );
};
