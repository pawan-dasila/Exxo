"use client";

import React from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "../types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Category } from "@/modules/category/types";

interface ProductListProps {
  products: Product[];
  categories?: Category[];
  totalCount?: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
}

export const ProductList = React.memo<ProductListProps>(({
  products,
  totalCount = 0,
  currentPage,
  totalPages,
  itemsPerPage = 20,
  onPageChange,
  onSortChange,
}) => {
  const startIdx = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="flex flex-col gap-6.5">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
        <div>
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold  text-zinc-900 font-sans">
              All Items
            </h1>
            <span className="text-xs font-semibold text-zinc-500">
              {totalCount} items available near you
            </span>
          </div>
        </div>

        {/* Sort and View Mode Toggles */}
        <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="shrink-0 w-[180px]">
            <Select onValueChange={onSortChange} defaultValue="recommended">
              <SelectTrigger className="bg-zinc-50 border border-zinc-200/60 rounded-xl px-4 py-2.5 h-10 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors shadow-none cursor-pointer">
                <SelectValue placeholder="Sort by: Recommended" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200">
                <SelectItem
                  value="recommended"
                  className="text-xs font-medium cursor-pointer"
                >
                  Sort by: Recommended
                </SelectItem>
                <SelectItem
                  value="price-asc"
                  className="text-xs font-medium cursor-pointer"
                >
                  Price: Low to High
                </SelectItem>
                <SelectItem
                  value="price-desc"
                  className="text-xs font-medium cursor-pointer"
                >
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 5. Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-zinc-100 pt-6 mt-4">
          <span className="text-xs text-zinc-500 font-medium">
            Showing {startIdx} to {endIdx} of {totalCount} items
          </span>

          <Pagination className="w-auto mx-0">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage - 1);
                    }}
                    className="h-8.5 text-xs font-bold text-zinc-600 bg-white border border-zinc-200/60 rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <PaginationItem key={pageNum} className="cursor-pointer">
                    <PaginationLink
                      isActive={pageNum === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                      className={cn(
                        "w-8.5 h-8.5 rounded-xl text-xs font-bold transition-all border",
                        pageNum === currentPage
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-2xs hover:bg-zinc-900"
                          : "bg-white text-zinc-600 border-zinc-200/60 hover:bg-zinc-50 hover:text-zinc-900",
                      )}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {currentPage < totalPages && (
                <PaginationItem className="cursor-pointer">
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage + 1);
                    }}
                    className="h-8.5 text-xs font-bold text-zinc-600 bg-white border border-zinc-200/60 rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
});

ProductList.displayName = "ProductList";
