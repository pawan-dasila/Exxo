import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 bg-stone-100" />
          <Skeleton className="h-4 w-64 bg-stone-50" />
        </div>
        <Skeleton className="h-11 w-full md:w-72 bg-stone-50 border-stone-100" />
      </header>

      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-stone-100 p-6 space-y-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-3 w-20 bg-stone-100" />
                  <Skeleton className="h-5 w-16 bg-stone-900/5" />
                </div>
                <Skeleton className="h-4 w-32 bg-stone-100" />
                <Skeleton className="h-3 w-40 bg-stone-50 italic" />
              </div>
              <div className="flex flex-col md:items-end gap-1">
                <Skeleton className="h-3 w-20 bg-stone-100" />
                <Skeleton className="h-7 w-24 bg-stone-900/5" />
              </div>
            </div>

            <div className="flex gap-3">
              {[1, 2].map((j) => (
                <Skeleton
                  key={j}
                  className="w-16 h-20 bg-stone-50 rounded-none border border-stone-100"
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-stone-50">
              <Skeleton className="h-3 w-32 bg-stone-50" />
              <div className="flex items-center gap-2 ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                <Skeleton className="h-9 w-28 bg-stone-50" />
                <Skeleton className="h-9 w-28 bg-stone-100" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="pt-16 border-t border-stone-50 flex flex-col items-center space-y-4">
        <Skeleton className="h-3 w-72 bg-stone-50" />
        <Skeleton className="h-6 w-64 bg-stone-50 opacity-30" />
      </footer>
    </div>
  );
}
