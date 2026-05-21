"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Category } from "../types";

export interface CategoryCardProps {
  category: Category;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  className,
}) => {
  const productCount = category._count?.products ?? 0;

  return (
    <Link
      href={`/search?category=${category.slug}`}
      className={cn(
        "group relative flex h-64 w-full flex-col justify-end overflow-hidden rounded-2xl bg-muted transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1",
        className,
      )}
      aria-label={`Browse ${category.name} category. ${productCount} items available.`}
    >
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-tr from-zinc-900 to-zinc-700" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500" />
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="relative z-10 p-6 flex flex-col gap-1.5 transition-transform duration-500 group-hover:translate-y-[-2px]">
        <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-zinc-200 backdrop-blur-md border border-white/5 uppercase">
          {productCount} {productCount === 1 ? "Item" : "Items"}
        </span>

        <h3 className="font-serif text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {category.name}
        </h3>

        <div className="flex items-center gap-1.5 pt-1.5 opacity-0 transition-all duration-500 ease-out translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
            Explore Collection
          </span>
          <svg
            className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};
