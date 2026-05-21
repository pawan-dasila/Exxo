"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCategories } from "@/modules/category/hooks";
import { Category } from "@/modules/category/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Style presets mapping for card backgrounds based on index
const BACKGROUND_PRESETS = [
  "bg-cat-electronics border-blue-200/50",
  "bg-cat-fashion border-emerald-200/50",
  "bg-cat-books border-amber-200/50",
  "bg-cat-fitness border-rose-200/50",
  "bg-cat-tools border-sky-200/50",
  "bg-cat-appliances border-purple-200/50",
];

export interface CategoryCardProps {
  category: Category;
  presetIndex: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  presetIndex,
}) => {
  const bgPreset = BACKGROUND_PRESETS[presetIndex % BACKGROUND_PRESETS.length];
  const productCount = category._count?.products ?? 0;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className={cn(
        "flex-none w-55 rounded-2xl p-5 flex flex-col justify-between border backdrop-blur-md relative overflow-hidden min-h-35 group cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        bgPreset,
      )}
      aria-label={`View collection for ${category.name}. Contains ${productCount} items.`}
    >
      <div className="z-10 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-[15px] font-bold text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-snug max-w-36">
            Premium select pieces ready to rent
          </p>
        </div>
        <span className="text-[12px] font-bold text-primary/90 mt-4 block">
          {productCount} {productCount === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Database Image replaced the Emojis */}
      {category.imageUrl && (
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full overflow-hidden border border-zinc-200/20 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out pointer-events-none select-none">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="96px"
            className="object-cover"
          />
          {/* Subtle gradient shield to ensure text remains highly readable */}
          <div className="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent" />
        </div>
      )}
    </Link>
  );
};

export default function PopularCategories() {
  const { data: categories, isLoading, isError } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const scrollAmount = 480; // scrolls 2 full cards
      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#fafbff] pt-2">
      <div className="max-w-full lg:px-12.5 mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-foreground mb-1 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-muted-foreground text-[14px] md:text-[15px]">
              Explore items you can rent
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              variant="outline"
              size="icon"
              className="rounded-full shadow-xs cursor-pointer text-zinc-700 bg-white"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              variant="outline"
              size="icon"
              className="rounded-full shadow-xs cursor-pointer text-zinc-700 bg-white"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="relative group/grid">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-52 h-35 rounded-2xl p-5 border border-zinc-200/40 bg-zinc-50 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-24 rounded bg-zinc-200" />
                    <Skeleton className="h-3.5 w-32 rounded bg-zinc-200" />
                  </div>
                  <Skeleton className="h-4 w-12 rounded bg-zinc-200" />
                </div>
              ))}

            {(isError ||
              (!isLoading && (!categories || categories.length === 0))) && (
              <div className="text-center py-6 w-full text-sm text-muted-foreground italic">
                Catalog collections are currently updating. Browse using the
                search panel.
              </div>
            )}

            {/* 3. Live Data Render */}
            {!isLoading &&
              categories &&
              categories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} presetIndex={i} />
              ))}
          </div>
        </div>
      </div>

      {/* <div className="w-full mt-12 pb-12 px-4 md:px-6 lg:px-[50px] mx-auto max-w-full">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm aspect-21/9 md:aspect-31/10 min-h-[140px]">
          <Image
            src="/assets/banner/banner-1.png"
            alt="Exxo Promotional Banner"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </div> */}
    </section>
  );
}
