import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Profile Section Skeleton */}
      <section className="space-y-6">
        <header className="space-y-2">
          <Skeleton className="h-7 w-48 bg-stone-100" />
          <Skeleton className="h-4 w-64 bg-stone-50" />
        </header>

        <div className="space-y-4 max-w-md">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20 bg-stone-100" />
              <Skeleton className="h-10 w-full bg-stone-50" />
            </div>
          ))}
          <Skeleton className="h-10 w-32 bg-stone-100" />
        </div>
      </section>

      <Separator className="bg-stone-100" />

      {/* Address/Order Section Skeleton */}
      <section className="space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40 bg-stone-100" />
            <Skeleton className="h-4 w-56 bg-stone-50" />
          </div>
          <Skeleton className="h-9 w-24 bg-stone-100" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 border border-stone-100 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-stone-100" />
                <Skeleton className="h-3 w-48 bg-stone-50" />
                <Skeleton className="h-3 w-40 bg-stone-50" />
              </div>
              <div className="flex gap-3 pt-4 border-t border-stone-50/50">
                <Skeleton className="h-3 w-12 bg-stone-100" />
                <Skeleton className="h-3 w-12 bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="pt-12 flex flex-col items-center space-y-2">
        <Skeleton className="h-3 w-48 bg-stone-50" />
        <Skeleton className="h-3 w-32 bg-stone-50" />
      </footer>
    </div>
  );
}
