import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-20">
      <div className="max-w-full mx-auto px-4 mt-6">
        <div className="mb-8 space-y-3 animate-pulse">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-10 bg-zinc-100 rounded-md" />
            <span className="text-zinc-200 text-xs">/</span>
            <Skeleton className="h-3 w-14 bg-zinc-100 rounded-md" />
            <span className="text-zinc-200 text-xs">/</span>
            <Skeleton className="h-3 w-16 bg-zinc-100 rounded-md" />
          </div>

          <Skeleton className="h-8.5 w-64 bg-zinc-100 rounded-xl" />

          <Skeleton className="h-3.5 w-96 max-w-full bg-zinc-100 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6.5 items-start">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-100/80 rounded-2xl p-5 space-y-4 shadow-2xs">
              <Skeleton className="h-4.5 w-24 bg-zinc-100 rounded-lg" />
              <div className="space-y-3.5 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 bg-zinc-100 rounded-md" />
                      <Skeleton className="h-3.5 w-20 bg-zinc-100 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-5 bg-zinc-100 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-zinc-100/80 rounded-2xl p-5 space-y-6 shadow-2xs">
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-16 bg-zinc-100 rounded-lg" />
                <Skeleton className="h-9 w-full bg-zinc-100 rounded-xl" />
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20 bg-zinc-100 rounded-lg" />
                  <Skeleton className="h-4 w-14 bg-zinc-100 rounded-lg" />
                </div>
                <Skeleton className="h-1.5 w-full bg-zinc-100 rounded-full" />
              </div>

              <div className="space-y-3 pt-1">
                <Skeleton className="h-4 w-20 bg-zinc-100 rounded-lg" />
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {["S", "M", "L", "XL"].map((size) => (
                    <Skeleton
                      key={size}
                      className="w-8.5 h-8.5 bg-zinc-100 rounded-xl"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 pb-4">
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-6.5 w-28 bg-zinc-100 rounded-lg" />
                <Skeleton className="h-4 w-20 bg-zinc-100 rounded-md" />
              </div>
              <Skeleton className="h-9 w-36 bg-zinc-100 rounded-xl" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-zinc-100/80 rounded-2xl p-2.5 space-y-3.5 shadow-2xs"
                >
                  <div className="relative aspect-square w-full bg-zinc-50 rounded-xl overflow-hidden">
                    <Skeleton className="w-full h-full bg-zinc-100/80" />

                    <Skeleton className="absolute top-2.5 right-2.5 w-7.5 h-7.5 bg-white/95 rounded-full" />
                  </div>

                  <div className="px-1 pt-0.5 space-y-3">
                    <Skeleton className="h-4 w-11/12 bg-zinc-100 rounded-md" />

                    <div className="flex justify-between items-center pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Skeleton className="h-3 w-3 bg-zinc-100 rounded-full" />
                        <Skeleton className="h-3 w-10 bg-zinc-100 rounded-md" />
                      </div>
                      <Skeleton className="h-4.5 w-14 bg-zinc-100 rounded-md" />
                    </div>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      <Skeleton className="h-4.5 w-12 bg-zinc-100 rounded-full" />
                      <Skeleton className="h-4.5 w-12 bg-zinc-100 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-zinc-100 pt-6 mt-4">
              <Skeleton className="h-4 w-32 bg-zinc-100 rounded-md" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-8.5 h-8.5 bg-zinc-100 rounded-xl" />
                <Skeleton className="w-8.5 h-8.5 bg-zinc-100 rounded-xl" />
                <Skeleton className="w-8.5 h-8.5 bg-zinc-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
