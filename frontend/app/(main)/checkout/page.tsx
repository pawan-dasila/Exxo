import { Metadata } from "next";
import { CheckoutContent } from "./_components/CheckoutContent";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCartItemsAction } from "@/modules/cart/actions";
import { getCurrentUser } from "@/modules/users/actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout — Vestrostyles",
  description: "Complete your order and join the Vestrostyles collection.",
  robots: { index: false, follow: true }, // Don't index checkout page
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/checkout");
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["cart"],
      queryFn: () => getCartItemsAction(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["user"],
      queryFn: () => Promise.resolve(user),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutContent />
    </HydrationBoundary>
  );
}
