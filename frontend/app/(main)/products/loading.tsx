import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full max-w-[100vw] min-h-screen bg-white">
      <main className="flex-1 transition-all duration-300">
        <div className="px-4 md:px-8 pb-30 md:pt-2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-end justify-between gap-4 mb-8 md:mb-12">
              <div className="flex-1 space-y-4">
                <Skeleton className="h-3 w-32 bg-stone-100" />
                <Skeleton className="h-10 w-48 bg-stone-100" />
                <Skeleton className="h-4 w-24 bg-stone-100" />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Skeleton className="h-10 w-24 md:w-32 bg-stone-100" />
                <Skeleton className="hidden md:block h-10 w-20 bg-stone-100" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-3/4 w-full rounded-none bg-stone-100" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-stone-100" />
                    <Skeleton className="h-4 w-1/4 bg-stone-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
