"use client";

import { useState, useRef } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Tag,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchSuggestions } from "@/modules/products/hooks/use-search";
import {
  SuggestionProduct,
  SuggestionCategory,
} from "@/modules/products/actions/search";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategories } from "@/modules/category/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

// ─── Idle State — Popular Categories ─────────────────────────────────────────

function IdleState({
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

// ─── Skeleton Rows ────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <div className="p-3 space-y-1">
      <Skeleton className="h-3 w-20 mb-3 ml-2" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-2">
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
        </div>
      ))}
      <Skeleton className="h-3 w-24 mb-3 ml-2 mt-3" />
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-2">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <div className="py-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-3">
        <Search className="w-5 h-5 text-zinc-400" />
      </div>
      <p className="text-sm font-semibold text-zinc-800">
        No results for &quot;{query}&quot;
      </p>
      <p className="text-xs text-zinc-400 mt-1">
        Try a different term or browse our categories
      </p>
    </div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({
  product,
  onSelect,
}: {
  product: SuggestionProduct;
  onSelect: () => void;
}) {
  const img =
    product.images[0]?.imageUrl ??
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=80";

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-violet-50 transition-colors group text-left cursor-pointer"
    >
      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
        <Image
          src={img}
          alt={product.name}
          fill
          className="object-cover"
          sizes="44px"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[12px] font-semibold text-zinc-900 truncate group-hover:text-violet-700 transition-colors">
          {product.name}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          {product.category && (
            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              {product.category.name}
            </span>
          )}
          <span className="text-[11px] font-bold text-violet-600">
            {formatPrice(product.rentalPrice)}/day
          </span>
        </div>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
    </button>
  );
}

// ─── Category Row ─────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  onSelect,
}: {
  category: SuggestionCategory;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-violet-50 transition-colors group text-left cursor-pointer"
    >
      <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <Tag className="w-3.5 h-3.5 text-zinc-400 group-hover:text-violet-500 transition-colors" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[12px] font-medium text-zinc-700 group-hover:text-violet-700 transition-colors">
          {category.name}
        </span>
        <p className="text-[10px] text-zinc-400">
          {category._count.products} items
        </p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
    </button>
  );
}

// ─── Suggestions Dropdown Panel ───────────────────────────────────────────────

function SuggestionsPanel({
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
      {/* Idle */}
      {query.length < 2 && (
        <IdleState
          onSelectCategory={(slug) => onNavigate(`/products?category=${slug}`)}
        />
      )}

      {/* Loading */}
      {showSkeleton && <SkeletonRows />}

      {/* Empty */}
      {showEmpty && <EmptyState query={debouncedQuery} />}

      {/* Results */}
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

      {/* View all footer */}
      {query.length >= 2 && (
        <div
          className="p-3 border-t border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors"
          onClick={() =>
            onNavigate(`/search?q=${encodeURIComponent(query.trim())}`)
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

// ─── NavbarSearch (exported) ──────────────────────────────────────────────────

export function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Koramangala, Bangalore");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = (path: string) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setQuery("");
    router.push(path);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {/* ── Desktop: wide pill search bar ─────────────────────────────── */}
      <div
        ref={containerRef}
        className="hidden md:flex flex-1 max-w-2xl relative"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full flex items-center bg-[#f4f5f8] border border-transparent focus-within:border-stone-200 focus-within:bg-white focus-within:shadow-md rounded-full px-4 py-2 transition-all duration-200 gap-2"
        >
          {/* Search input */}
          <div className="flex-1 flex items-center gap-2.5 min-w-0">
            {debouncedQuery.length >= 2 && dropdownOpen ? (
              <Loader2 className="w-4 h-4 text-violet-500 shrink-0 animate-spin" />
            ) : (
              <Search className="text-stone-400 shrink-0 w-4 h-4" />
            )}
            <input
              type="text"
              placeholder="Search for items (e.g. Camera, Laptop, Tent...)"
              value={query}
              autoComplete="off"
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => {
                // Small delay so click on suggestion registers
                setTimeout(() => setDropdownOpen(false), 200);
              }}
              className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-[13px] text-stone-800 placeholder:text-stone-400/80 w-full min-w-0"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-stone-300 shrink-0" />

          {/* Location input */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <MapPin className="text-stone-500 shrink-0 w-4 h-4" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-xs font-semibold text-stone-700 placeholder:text-stone-400/80 w-32.5 truncate"
            />
            <span className="bg-stone-200/60 px-2 py-0.5 rounded-full text-[10px] font-bold text-stone-600 shrink-0 select-none">
              5 km
            </span>
            <ChevronDown className="text-stone-400 w-3.5 h-3.5 shrink-0 ml-0.5" />
          </div>
        </form>

        {/* Suggestions dropdown */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50">
            <SuggestionsPanel
              query={query}
              debouncedQuery={debouncedQuery}
              onNavigate={navigate}
            />
          </div>
        )}
      </div>

      {/* ── Mobile: icon button → Dialog ──────────────────────────────── */}
      <div className="md:hidden flex items-center">
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open search"
              className="rounded-full hover:bg-stone-100 transition-all w-10 h-10"
            >
              <Search className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            </Button>
          </DialogTrigger>

          <DialogContent
            className="p-0 top-[8%] translate-y-0 overflow-hidden rounded-2xl max-w-[calc(100%-2rem)] sm:max-w-lg mx-auto w-[calc(100%-2rem)] gap-0"
            showCloseButton={false}
            aria-describedby={undefined}
          >
            <DialogTitle className="sr-only">Search</DialogTitle>

            {/* Mobile search form header */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100"
            >
              {debouncedQuery.length >= 2 ? (
                <Loader2 className="w-4 h-4 text-violet-500 shrink-0 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              )}
              <Input
                type="text"
                placeholder="Search products, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-none shadow-none focus-visible:ring-0 h-8 px-0 text-sm w-full bg-transparent"
                autoFocus
              />
            </form>

            {/* Mobile location row */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-xs text-zinc-600 outline-none flex-1 font-medium"
              />
              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-200/60 px-2 py-0.5 rounded-full">
                5 km
              </span>
            </div>

            <SuggestionsPanel
              query={query}
              debouncedQuery={debouncedQuery}
              onNavigate={navigate}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
