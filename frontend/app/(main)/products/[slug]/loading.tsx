import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <article className="pb-24 max-w-full mx-auto px-4 sm:px-6">
      {/* Breadcrumbs Skeleton */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-12 bg-stone-100/50" />
          <div className="h-1 w-1 bg-stone-200 rounded-full" />
          <Skeleton className="h-3 w-12 bg-stone-100/50" />
          <div className="h-1 w-1 bg-stone-200 rounded-full" />
          <Skeleton className="h-3 w-32 bg-stone-100/80" />
        </div>
      </nav>

      <div className="flex flex-col lg:grid lg:grid-cols-[0.65fr_0.35fr] gap-12 mb-20 items-start">
        {/* Gallery Base Skeleton */}
        <div className="w-full">
          {/* Mobile Scroll Skeleton */}
          <div className="lg:hidden relative">
            <div className="relative w-screen -mx-4 px-4 overflow-x-auto scrollbar-hide flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="relative w-[85vw] shrink-0 aspect-[4/5] rounded-2xl bg-stone-50"
                />
              ))}
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/5 px-4 py-1.5 rounded-full z-10 w-16 h-6" />
          </div>

          {/* Desktop Dual-Column Gallery Skeleton */}
          <div className="hidden lg:flex gap-2">
            <div className="w-1/2 relative">
              <Skeleton className="sticky top-24 aspect-[4/5] w-full rounded-[2.5rem] bg-stone-100/70 border border-stone-100/50" />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-[4/5] w-full rounded-[2.5rem] bg-stone-50 border border-stone-100/50"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Info Column Skeleton */}
        <div className="w-full lg:sticky lg:top-24 space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 bg-stone-100/60" />
            <Skeleton className="h-12 w-full bg-stone-100/80" />
            <div className="flex items-baseline gap-4">
              <Skeleton className="h-8 w-32 bg-stone-100" />
              <Skeleton className="h-6 w-24 bg-stone-100/40" />
            </div>
          </div>

          {/* Size Selector Skeleton */}
          <div className="space-y-4 pt-8 border-t border-stone-100/60">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 bg-stone-100/60" />
              <Skeleton className="h-4 w-24 bg-stone-100/40" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-16 rounded-xl bg-stone-50"
                />
              ))}
            </div>
          </div>

          {/* Color Selector Skeleton */}
          <div className="space-y-4 pt-8 border-t border-stone-100/60">
            <Skeleton className="h-4 w-28 bg-stone-100/60" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 w-8 rounded-full bg-stone-50"
                />
              ))}
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="space-y-4 pt-8 border-t border-stone-100/60">
            <div className="flex gap-4">
              <Skeleton className="h-14 flex-1 rounded-full bg-stone-900/10" />
              <Skeleton className="h-14 w-14 rounded-full bg-stone-50" />
            </div>
            <div className="flex justify-between px-2">
              <Skeleton className="h-4 w-32 bg-stone-100/40" />
              <Skeleton className="h-4 w-32 bg-stone-100/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full mt-24 pt-12 border-t border-stone-100/60">
        <div className="flex justify-center gap-12 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 bg-stone-100/60" />
          ))}
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-4 w-full bg-stone-50" />
          <Skeleton className="h-4 w-full bg-stone-50" />
          <Skeleton className="h-4 w-2/3 bg-stone-50" />
        </div>
      </div>
    </article>
  );
}
