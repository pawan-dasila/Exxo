import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 antialiased">
      {/* ── Breadcrumb skeleton ── */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          DESKTOP — 3-column grid skeleton
          ══════════════════════════════════ */}
      <div
        className="hidden lg:grid w-full px-6 xl:px-10 2xl:px-16 pt-6 gap-7 items-start"
        style={{
          gridTemplateColumns:
            "minmax(0,1.2fr) minmax(0,1.3fr) minmax(0,0.82fr)",
          gridTemplateRows: "auto auto",
        }}
      >
        {/* ── Col 1 Row 1: Gallery ── */}
        <div style={{ gridColumn: "1", gridRow: "1" }} className="space-y-3">
          <Skeleton className="w-full aspect-4/3 rounded-2xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-20 rounded-xl shrink-0" />
            ))}
          </div>
        </div>

        {/* ── Col 2 Row 1: Product Info card ── */}
        <div style={{ gridColumn: "2", gridRow: "1" }} className="space-y-0">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Title + share */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-7 w-4/5" />
                  <Skeleton className="h-7 w-3/5" />
                </div>
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              </div>
              {/* Price */}
              <Skeleton className="h-9 w-28" />
              {/* Rating */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              {/* Deposit + verified */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              {/* Promo banner */}
              <Skeleton className="h-14 w-full rounded-2xl" />
              {/* Location */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="h-px bg-neutral-100" />
            {/* About section */}
            <div className="px-6 py-5 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* ── Col 3 Row 1+2: Rental card + WhyRent ── */}
        <div
          style={{ gridColumn: 3, gridRow: "1 / 3" }}
          className="sticky top-6 space-y-5"
        >
          {/* Rental card */}
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 space-y-5">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-11 rounded-xl" />
              <Skeleton className="h-11 rounded-xl" />
            </div>
            <div className="h-px bg-neutral-100" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          {/* Why Rent Exxo card */}
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 space-y-4">
            <Skeleton className="h-5 w-36" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Col 1-2 Row 2: Tabs ── */}
        <div style={{ gridColumn: "1 / 3", gridRow: 2 }} className="pt-1">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex gap-0 border-b border-neutral-100 px-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-20 mx-3 my-1 rounded-lg" />
              ))}
            </div>
            {/* Tab body: left + right */}
            <div className="grid grid-cols-[1.15fr_1fr] divide-x divide-neutral-100">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-3 w-full" />
                    ))}
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <Skeleton className="h-5 w-20" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="space-y-2 pb-4 border-b border-neutral-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-full ml-10" />
                    <Skeleton className="h-3 w-3/4 ml-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          MOBILE — stacked skeleton
          ══════════════════════════════ */}
      <div className="block lg:hidden w-full px-4 pt-5 space-y-6">
        {/* Gallery */}
        <div className="space-y-3">
          <Skeleton className="w-full aspect-4/3 rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-18 rounded-xl flex-1" />
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-5 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-14 rounded-2xl" />
        </div>

        {/* Rental card */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
          <Skeleton className="h-11 rounded-xl" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="flex gap-1 border-b border-neutral-100 px-2 py-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 flex-1 rounded-lg" />
            ))}
          </div>
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
