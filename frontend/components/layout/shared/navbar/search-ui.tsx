import Image from "next/image";
import { MapPin, ArrowRight, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  SuggestionProduct,
  SuggestionCategory,
} from "@/modules/products/actions/search";

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export function SearchSkeletonRows() {
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

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <div className="py-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-3">
        <Tag className="w-5 h-5 text-zinc-400" />
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

export function ProductRow({
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

export function CategoryRow({
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
