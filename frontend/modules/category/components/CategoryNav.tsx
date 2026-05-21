"use client";

import React, { useRef } from "react";
import { useCategories } from "../hooks";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CategoryNavProps {
  activeSlug?: string | null;
  onSelect?: (slug: string | null) => void;
  className?: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeSlug = null,
  onSelect,
  className,
}) => {
  const { data: categories, isLoading } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll support helper
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  // 1. Loading Skeleton Row
  if (isLoading) {
    return (
      <div 
        className={cn("flex w-full items-center gap-2 overflow-x-auto py-2.5 scrollbar-none", className)}
        aria-label="Loading categories navigation..."
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-28 shrink-0 rounded-full bg-zinc-900" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className={cn("group relative flex w-full items-center", className)}>
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-black/80 text-zinc-300 shadow-lg backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Categories Horizontally Scrollable Bar */}
      <div
        ref={scrollContainerRef}
        className="flex w-full gap-2.5 overflow-x-auto py-2.5 scrollbar-none scroll-smooth px-1"
        role="tablist"
        aria-label="Filter products by collection category"
      >
        {/* "All" Category Pill */}
        <button
          role="tab"
          aria-selected={activeSlug === null}
          onClick={() => onSelect?.(null)}
          className={cn(
            "shrink-0 rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            activeSlug === null
              ? "bg-white border-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
          )}
        >
          All Items
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((category) => {
          const isSelected = activeSlug === category.slug;

          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelect?.(category.slug)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "bg-white border-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              )}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-black/80 text-zinc-300 shadow-lg backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
