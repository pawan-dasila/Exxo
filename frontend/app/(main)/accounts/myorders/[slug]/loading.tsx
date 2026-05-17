import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-500">
      {/* Navigation & Header Skeleton */}
      <div className="flex flex-col gap-8">
        <Skeleton className="h-4 w-32 bg-stone-100 rounded-none" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-100 pb-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24 bg-stone-100 rounded-none" />
              <div className="w-1 h-1 rounded-full bg-stone-200" />
              <Skeleton className="h-4 w-40 bg-stone-100 rounded-none" />
            </div>
            <Skeleton className="h-12 w-64 bg-stone-100 rounded-none" />
            <div className="flex gap-4">
               <Skeleton className="h-4 w-32 bg-stone-100 rounded-none" />
               <Skeleton className="h-4 w-32 bg-stone-100 rounded-none" />
            </div>
          </div>

          <Skeleton className="h-24 w-full md:w-64 bg-stone-50 rounded-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <Skeleton className="h-6 w-48 bg-stone-100 rounded-none" />
            <div className="border border-stone-100 divide-y divide-stone-50">
              {[1, 2].map((i) => (
                <div key={i} className="p-6 flex flex-col md:flex-row gap-6">
                  <Skeleton className="w-full md:w-32 aspect-3/4 bg-stone-50 rounded-none" />
                  <div className="flex-1 space-y-6 py-2">
                    <div className="space-y-2">
                       <Skeleton className="h-6 w-3/4 bg-stone-100 rounded-none" />
                       <Skeleton className="h-4 w-1/2 bg-stone-50 rounded-none" />
                    </div>
                    <Skeleton className="h-10 w-full bg-stone-50 rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="h-48 w-full bg-stone-50 rounded-none" />
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-8">
           <Skeleton className="h-64 w-full bg-stone-50 rounded-none border border-stone-100" />
           <Skeleton className="h-48 w-full bg-stone-100 rounded-none" />
           <Skeleton className="h-32 w-full bg-stone-100 rounded-none" />
        </div>
      </div>
    </div>
  );
}
