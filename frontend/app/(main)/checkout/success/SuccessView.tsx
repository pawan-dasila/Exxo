"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format, addDays } from "date-fns";
import { resolveVestrostylesMedia, formatPrice } from "@/lib/utils";
import type { OrderWithDetails } from "./page";

interface SuccessViewProps {
  order: OrderWithDetails;
}

export default function SuccessView({ order }: SuccessViewProps) {
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Helper to normalize image URLs
  const getImageUrl = (url: string | null | undefined) => {
    return resolveVestrostylesMedia(
      url,
      "products",
      undefined,
      "f_auto,q_auto,w_400,c_limit",
    );
  };

  const shippingDetails =
    (order.shipping_details as { expected_delivery_date?: string }) || {};
  const deliveryEstimate = shippingDetails?.expected_delivery_date;

  const estimatedDate = order.created_at
    ? addDays(new Date(order.created_at), 5)
    : addDays(new Date(), 5);

  const currentStatus = order.order_status || "pending";
  const carrier = order.carrier;

  const steps = [
    { label: "Ordered", status: ["pending", "paid", "processing"] },
    { label: "Shipped", status: ["shipped"] },
    { label: "Out for delivery", status: ["out_for_delivery"] },
    { label: "Delivered", status: ["delivered"] },
  ];

  const currentStepIndex = steps.findIndex((step) =>
    step.status.includes(currentStatus as string),
  );
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e880;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-6 py-10 animate-in fade-in duration-1000">
        {/* Arriving Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl  text-gray-900">
              Arriving{" "}
              {(() => {
                if (!deliveryEstimate) return format(estimatedDate, "EEEE, MMM d");
                const date = new Date(deliveryEstimate);
                if (isNaN(date.getTime())) return deliveryEstimate;
                return format(date, "EEEE, MMM d");
              })()}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-gray-400 text-[10px] uppercase">
                Reference #{order.id?.slice(-12).toUpperCase()}
              </p>
              {carrier && (
                <>
                  <span className="text-gray-200">|</span>
                  <p className="text-gray-400 text-[10px] uppercase font-semibold">
                    via {carrier}
                  </p>
                </>
              )}
            </div>
          </div>
          <Link
            href="/account/orders"
            className="text-gray-900 hover:text-blue-600 text-[10px]  uppercase flex items-center gap-2 group transition-colors"
          >
            Track Order{" "}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Top Product & Payment Block */}
        <div className="mb-10 w-full flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Main Image */}
          <div className="relative w-full max-w-[280px] md:w-40 aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 shrink-0">
            {order.order_items?.[0]?.product_variants?.products?.image_url && (
              <Image
                src={getImageUrl(
                  order.order_items[0].product_variants.products.image_url,
                )}
                alt={
                  order.order_items[0].product_variants.products.title ||
                  "Product"
                }
                fill
                sizes="(max-width: 768px) 280px, 160px"
                className="object-cover"
                priority
              />
            )}
          </div>

          <div className="flex-1 w-full text-center md:text-left space-y-6 pt-2">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl  text-gray-900  leading-tight">
                {order.order_items?.[0]?.product_variants?.products?.title}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[12px]  text-gray-400 uppercase ">
                <span>Qty: {order.order_items?.[0]?.quantity}</span>
                <span className="text-gray-200">|</span>
                <div className="flex items-center gap-2">
                  {order.order_items?.[0]?.product_variants?.color_hex && (
                    <div
                      className="w-2.5 h-2.5 rounded-full border border-gray-200"
                      style={{
                        backgroundColor:
                          order.order_items[0].product_variants.color_hex,
                      }}
                    />
                  )}
                  <span>
                    {order.order_items?.[0]?.product_variants?.color_name}
                  </span>
                </div>
                <span className="text-gray-200">|</span>
                <span>
                  Size : {order.order_items?.[0]?.product_variants?.size}
                </span>
              </div>
              {order.order_items && order.order_items.length > 1 && (
                <p className="text-[10px]  text-blue-600 uppercase pt-1 ">
                  + {order.order_items.length - 1} other item
                  {order.order_items.length > 2 ? "s" : ""} in this shipment
                </p>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 max-w-xs mx-auto md:mx-0">
              <p className="text-[9px]  text-gray-400 uppercase mb-3 ">
                Payment Method
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div
                  className={`px-4 py-1.5 rounded-full text-[9px]  uppercase  ${
                    order.payment_status === "paid"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {order.payment_status === "paid"
                    ? "Paid Online"
                    : "Cash on Delivery"}
                </div>
                <span className="text-xl  text-gray-900 er">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tracker Container */}
        <div className="mb-10 border-gray-100 ">
          <h2 className="text-center text-2xl  mb-10">Status</h2>

          <div className="max-w-4xl mx-auto relative px-4">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(59,130,246,0.3)]"
              style={{
                width: animateProgress
                  ? `${(activeIndex / (steps.length - 1)) * 100}%`
                  : "0%",
              }}
            />

            {/* Steps Nodes */}
            <div className="relative flex justify-between">
              {steps.map((step, idx) => {
                const isCompleted = idx < activeIndex;
                const isActive = idx === activeIndex;

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-1000 z-10 ${
                        isCompleted
                          ? "bg-blue-500 border-blue-500"
                          : isActive
                            ? "bg-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                            : "bg-white border-gray-200"
                      }`}
                    >
                      {isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      )}
                      {isActive && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                      )}
                    </div>
                    <span
                      className={`absolute -bottom-8 whitespace-nowrap text-[9px]  uppercase er sm: transition-colors duration-500 ${
                        idx <= activeIndex ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 rounded-2xl overflow-hidden shadow-sm mt-12">
          {/* Order Summary */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50/50 transition-colors">
            <h3 className="text-xs uppercase  text-gray-900 mb-6 font-sans">
              Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 ">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Shipping</span>
                <span className="text-gray-900 ">
                  {order.shipping_cost === 0
                    ? "FREE"
                    : formatPrice(order.shipping_cost)}
                </span>
              </div>
              {order.discount_amount && order.discount_amount > 0 && (
                <div className="flex justify-between text-xs font-medium text-blue-600">
                  <span>Discount</span>
                  <span className="">
                    -{formatPrice(order.discount_amount)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100 flex justify-between text-sm  text-gray-900 uppercase">
                <span>Total</span>
                <span className="text-blue-600">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50/50 transition-colors">
            <h3 className="text-xs uppercase  text-gray-900 mb-6 font-sans">
              Shipping
            </h3>
            <div className="space-y-1 text-xs text-gray-600 font-medium">
              <p className=" text-gray-900">
                {order.shipping_address?.recipient_name || "N/A"}
              </p>
              <p>{order.shipping_address?.address_line_1}</p>
              {order.shipping_address?.address_line_2 && (
                <p>{order.shipping_address.address_line_2}</p>
              )}
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.state}{" "}
                {order.shipping_address?.postal_code}
              </p>
            </div>
          </div>

          {/* Order Info */}
          <div className="p-8 hover:bg-gray-50/50 transition-colors">
            <h3 className="text-xs uppercase  text-gray-900 mb-6 font-sans">
              Info
            </h3>
            <div className="flex flex-col h-[80px] justify-between text-xs font-medium">
              <Link
                href="/account/orders"
                className="text-blue-600 hover:underline font-semibold"
              >
                View all orders
              </Link>
              <div className="space-y-1">
                <p className="text-[9px] text-gray-400  uppercase">
                  Payment: {order.payment_status?.toUpperCase() || "PENDING"}
                </p>
                <p className="text-[9px] text-gray-400  uppercase">
                  Order ID: {order.id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-20 text-center">
          <Button
            asChild
            variant="ghost"
            className="text-[10px] uppercase  hover:bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm"
          >
            <Link href="/products" className="flex items-center gap-3">
              Continue Shopping <ArrowRight className="w-4 h-4 mt-[-2px]" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
