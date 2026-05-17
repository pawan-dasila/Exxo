import { notFound, redirect } from "next/navigation";
import { getOrderDetailsAction } from "@/modules/checkout/actions";
import { getCurrentUser } from "@/modules/users/actions";
import SuccessView from "./SuccessView";
import { type Database } from "@/lib/database.types";

type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

type OrderItemWithProduct = OrderItemRow & {
  product_variants: ProductVariantRow & {
    products: ProductRow | null;
  };
};

export type OrderWithDetails = OrderRow & {
  order_items: (OrderItemWithProduct | null)[] | null;
  shipping_address: AddressRow | null;
};

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;
  
  if (!orderId) {
    return notFound();
  }

  // 1. Identity Check
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/checkout/success");
  }

  // 2. Fetch Order Data
  const result = await getOrderDetailsAction(orderId);
  
  if (result.error || !result.data) {
    return notFound();
  }

  const order = result.data as OrderWithDetails;

  // 3. Ownership Verification (Security Hardening)
  if (order.user_id !== user.id) {
    redirect("/forbidden");
  }

  return <SuccessView order={order} />;
}
