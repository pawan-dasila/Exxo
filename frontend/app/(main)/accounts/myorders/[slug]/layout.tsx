import React from "react";
import { Metadata } from "next";
import { ArrowLeft, Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { checkoutService } from "@/modules/checkout/services/checkout-service";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";

interface OrderDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const awaitedParams = await params;
  const orderId = awaitedParams.slug;
  const supabase = await createClient();
  const { data: order } = await checkoutService.getOrderById(supabase, orderId);

  return {
    title: order
      ? `Order #${order.id.slice(-8).toUpperCase()} — Vestrostyles`
      : "Order Details",
    description: "Manage and track your Vestrostyles boutique order.",
  };
}

export default async function OrderDetailLayout({
  children,
  params,
}: OrderDetailLayoutProps) {
  const awaitedParams = await params;
  const orderId = awaitedParams.slug;
  const supabase = await createClient();
  const { data: order } = await checkoutService.getOrderById(supabase, orderId);

  if (!order) return <>{children}</>;

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-stone-100 text-stone-500 border-stone-200";
    switch (status.toLowerCase()) {
      case "delivered":
      case "completed":
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "processing":
      case "confirmed":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "shipped":
      case "in transit":
        return "bg-sky-50 text-sky-700 border-sky-100";
      case "pending":
      case "awaiting payment":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "cancelled":
      case "failed":
      case "returned":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-stone-100 text-stone-500 border-transparent";
    }
  };

  return (
    <div className="max-w-full mx-auto px-4">
      <div className="flex flex-col gap-8 mb-10">
        <Link
          href="/accounts/myorders"
          className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-[#986A33] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-100 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={getStatusColor(order.order_status).split(" ")[1]}
              >
                {order.order_status}
              </Badge>
              <div className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                Order ID: #{order.id.slice(-12).toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-italiana text-stone-900 leading-tight">
              Order Details
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-500 font-medium italic">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Placed {format(new Date(order.created_at!), "MMMM dd, yyyy")}
              </span>
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                {order.order_items?.length} Items
              </span>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 bg-stone-50/50 p-6 border border-stone-100 w-full md:w-auto">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
              Grand Total
            </span>
            <span className="text-3xl font-italiana text-[#986A33]">
              ₹{(order.total_amount ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
