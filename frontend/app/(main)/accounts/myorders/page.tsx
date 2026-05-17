import { getUserOrdersAction } from "@/modules/checkout/actions";
import { OrderList } from "@/modules/checkout/components/OrderList";
import { BoutiquePagination } from "@/components/common/BoutiquePagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "My Order History — Vestrostyles",
  description:
    "View and track all your past boutique orders and current shipments.",
};

interface MyOrdersPageProps {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function MyOrdersPage({
  searchParams,
}: MyOrdersPageProps) {
  const awaitedSearchParams = await searchParams;
  const currentPage = Number(awaitedSearchParams.page) || 1;
  const searchQuery = awaitedSearchParams.q || "";
  const pageSize = 10;

  const {
    data: orders,
    count,
    error,
  } = await getUserOrdersAction({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
        <h2 className="text-xl font-italiana text-foreground tracking-widest lowercase">
          error fetching orders
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm italic">
          We encountered a problem loading your boutique orders. Please try
          again later.
        </p>
      </div>
    );
  }

  const hasOrders = (orders && orders.length > 0) || searchQuery.length > 0;
  const isSearchEmpty = searchQuery.length > 0 && (!orders || orders.length === 0);

  return (
    <div className="pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-4xl font-italiana text-foreground">
          My Order History
        </h1>
        <p className="text-xs text-muted-foreground italic">
          Manage your boutique deliveries and track real-time status.
        </p>
      </div>

      {!hasOrders ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border">
          <div className="w-16 h-16 bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-italiana text-foreground lowercase mb-2">
            {currentPage > 1
              ? "no orders found on this page"
              : "your wardrobe is awaiting its first piece"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mb-8 italic">
            {currentPage > 1
              ? "We couldn't find any orders for this specific view."
              : "Experience the pinnacle of streetwear. Start your journey with our latest collections."}
          </p>
          <Button
            asChild
            className="rounded-none px-8 py-6 text-[10px] uppercase tracking-[0.2em]"
          >
            <Link href={currentPage > 1 ? "/accounts/myorders" : "/shop"}>
              {currentPage > 1 ? "Back to page 1" : "Explore Collections"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <OrderList orders={orders || []} />
          {!isSearchEmpty && (
            <BoutiquePagination totalCount={count || 0} pageSize={pageSize} />
          )}
        </>
      )}

      <footer className="pt-24 text-[10px] text-muted-foreground uppercase tracking-[0.3em] flex flex-col items-center gap-6 border-t border-border mt-20">
        <p>vestrostyles boutiques — global shipping worldwide</p>
        <div className="flex items-center gap-12 opacity-40 grayscale contrast-125 font-bold">
          <span className="tracking-widest">razorpay secure</span>
          <span className="tracking-widest">delhivery global</span>
          <span className="tracking-widest">bluedart express</span>
        </div>
      </footer>
    </div>
  );
}
