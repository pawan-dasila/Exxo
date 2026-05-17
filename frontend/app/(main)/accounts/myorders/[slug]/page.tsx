import { notFound } from "next/navigation";
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  ChevronRight,
  Star,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { checkoutService } from "@/modules/checkout/services/checkout-service";
import { AdminOrder } from "@/modules/checkout/types";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveVestrostylesMedia, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { OrderReviewForm } from "@/modules/checkout/components/OrderReviewForm";
import { OrderPageTabHandler } from "@/modules/checkout/components/OrderPageTabHandler";
import { generateInvoiceSignature } from "@/modules/invoice/services/invoice-crypto";
import { InvoiceDownloader } from "@/modules/invoice/components/InvoiceDownloader";
import { redirect } from "next/navigation";
import { RequestCancellationDialog } from "@/modules/checkout/components/RequestCancellationDialog";

type LogisticsDetails = {
  expected_delivery_date?: string;
  tracking_url?: string;
};

interface OrderDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string; action?: string }>;
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const orderId = awaitedParams.slug;

  const supabase = await createClient();
  const { data, error } = await checkoutService.getOrderById(supabase, orderId);

  // Cast highly nested data to AdminOrder for strict type safety
  const order = data as AdminOrder | null;

  if (error || !order) {
    return notFound();
  }

  // Generate secure signature for the invoice if requested
  let signature = "";
  if (awaitedSearchParams.action === "invoice" && order.user_id) {
    signature = generateInvoiceSignature(order.id, order.user_id);
  }

  const logistics = (order.shipping_details as LogisticsDetails) || {};

  const getImageUrl = (url: string | null | undefined) => {
    return resolveVestrostylesMedia(
      url,
      "products",
      undefined,
      "f_auto,q_auto,w_200,c_limit",
    );
  };

  const isDelivered =
    order.order_status?.toLowerCase() === "delivered" ||
    order.order_status?.toLowerCase() === "completed";

  const isEligibleForCancellation = ["pending", "paid", "processing"].includes(
    order.order_status?.toLowerCase() ?? "",
  );

  const isCancellationRequested =
    order.order_status?.toLowerCase() === "cancellation_requested";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Client-side tab navigation handler */}
      <OrderPageTabHandler />

      {/* Secure Invoice Downloader (Triggers only when action=invoice) */}
      {awaitedSearchParams.action === "invoice" && signature && (
        <InvoiceDownloader
          order={order}
          signature={signature}
          onComplete={async () => {
            "use server";
            // Navigate back to clear the search param after download
            redirect(`/accounts/myorders/${orderId}`);
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Items & Summary */}
        <div className="lg:col-span-2 space-y-12">
          {/* Items List */}
          <section id="rate" className="scroll-mt-20 space-y-6">
            <h2 className="text-sm uppercase text-foreground flex items-center gap-3">
              <Package className="w-4 h-4 text-primary" />
              Items In Order
            </h2>
            <div className="border border-border divide-y divide-border">
              {order.order_items?.map((item, idx) => {
                const product = item.product_variants?.products;
                const variant = item.product_variants;
                const imageUrl = getImageUrl(product?.image_url);

                return (
                  <div
                    key={idx}
                    className="p-6 flex flex-col md:flex-row gap-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="relative w-full md:w-32 aspect-3/4 bg-muted shrink-0 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product?.title || "Product"}
                        fill
                        sizes="(max-width: 768px) 100vw, 128px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Link
                            href={`/products/${product?.slug}`}
                            className="text-lg font-semibold text-foreground hover:text-primary transition-colors flex items-center justify-between"
                          >
                            {product?.title}
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                            Size {variant?.size}{" "}
                            <span className="w-px h-2.5 bg-border" />{" "}
                            {variant?.color_name}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            Quantity: {item.quantity}
                          </span>
                          <span className="text-base font-italiana text-foreground">
                            {formatPrice(item.unit_price)}{" "}
                            <span className="text-[10px] font-sans italic text-muted-foreground ml-1">
                              each
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Rate Your Purchase — shown only when order is delivered */}
          {isDelivered && (
            <section id="rate" className="scroll-mt-20 space-y-6">
              <h2 className="text-sm uppercase text-foreground flex items-center gap-3">
                <Star className="w-4 h-4 text-primary" />
                Rate Your Purchase
              </h2>
              <div className="space-y-4">
                {order.order_items?.map((item, idx) => {
                  const product = item.product_variants?.products;
                  const imageUrl = getImageUrl(product?.image_url);
                  if (!product?.id) return null;
                  return (
                    <div
                      key={idx}
                      className="border border-border p-6 space-y-6"
                    >
                      {/* Product identity row */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 shrink-0 bg-muted overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={product.title || "Product"}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {product.title}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                            {item.product_variants?.size}
                            {item.product_variants?.color_name && (
                              <> · {item.product_variants.color_name}</>
                            )}
                          </p>
                        </div>
                      </div>
                      {/* Review form */}
                      <OrderReviewForm
                        productId={product.id}
                        orderId={order.id}
                        productName={product.title || "Product"}
                        initialExpand={awaitedSearchParams.tab === "rate"}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Detailed Summary */}
          <section className="p-8 bg-muted border border-border space-y-6">
            <h2 className="text-sm uppercase text-foreground">
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Subtotal
                </span>
                <span className="text-foreground font-italiana">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Shipping
                </span>
                <span className="text-foreground font-italiana">
                  {formatPrice(order.shipping_cost)}
                </span>
              </div>
              {order.discount_amount && order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span className="font-medium">Discount applied</span>
                  <span className="font-italiana">
                    - {formatPrice(order.discount_amount)}
                  </span>
                </div>
              )}
              <div className="pt-4 border-t border-border flex justify-between">
                <span className="text-[11px] uppercase tracking-widest text-foreground">
                  Grand Total
                </span>
                <span className="text-xl font-italiana text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </section>

          {/* Shipping Address (Moved from right column) */}
          <section className="p-8 border border-border space-y-6">
            <h2 className="text-sm uppercase text-foreground flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary" />
              Shipping Detail
            </h2>
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Recipient
                </span>
                <p className="text-sm text-foreground font-medium">
                  {order.shipping_address?.recipient_name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {order.shipping_address?.recipient_phone}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Delivery Address
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {order.shipping_address?.address_line_1}
                  <br />
                  {order.shipping_address?.address_line_2 && (
                    <>
                      {order.shipping_address.address_line_2}
                      <br />
                    </>
                  )}
                  {order.shipping_address?.city},{" "}
                  {order.shipping_address?.state}{" "}
                  {order.shipping_address?.postal_code}
                  <br />
                  {order.shipping_address?.country}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Logistics & Tracking */}
        <div className="space-y-8">
          {/* Tracking Section */}
          <section
            id="tracking"
            className="scroll-mt-20 p-8 border border-primary/20 space-y-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Truck className="w-12 h-12" />
            </div>
            <h2 className="text-sm uppercase text-foreground flex items-center gap-3">
              <Truck className="w-4 h-4 text-primary" />
              Logistic Info
            </h2>
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Carrier Status
                </span>
                <p className="text-sm text-foreground font-medium flex items-center gap-2">
                  {order.carrier || "Vestrostyles Logistics"}
                  <Badge
                    variant="secondary"
                    className="rounded-none text-[8px] h-4 bg-muted"
                  >
                    Live
                  </Badge>
                </p>
              </div>
              {logistics.expected_delivery_date && (
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                    Expected Delivery
                  </span>
                  <p className="text-sm text-foreground font-medium">
                    {format(
                      new Date(logistics.expected_delivery_date),
                      "EEEE, MMM d",
                    )}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Tracking Reference
                </span>
                <div className="flex items-center justify-between p-3 bg-muted border border-border animate-in fade-in duration-1000">
                  <p className="text-xs font-mono text-foreground tracking-wider">
                    {order.tracking_number || "AWAITING_ID"}
                  </p>
                  {logistics.tracking_url && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[9px] font-black uppercase hover:text-primary"
                    >
                      <Link
                        href={logistics.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        Track
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic border-l-2 border-border pl-4 py-1">
                Your order is being handled with precision. Tracking updates may
                take up to 12 hours to synchronize.
              </p>
            </div>
          </section>

          {/* Payment Status (Moved up) */}
          <section className="p-8 border border-border space-y-6">
            <h2 className="text-sm uppercase text-foreground flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-primary" />
              Payment Status
            </h2>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                Status
              </span>
              <p className="text-sm text-foreground font-medium uppercase tracking-widest flex items-center gap-2">
                {order.payment_status}
                {isCancellationRequested && (
                  <Badge
                    variant="destructive"
                    className="rounded-none text-[8px] h-4"
                  >
                    Cancellation Requested
                  </Badge>
                )}
              </p>
            </div>
            {isEligibleForCancellation && !isCancellationRequested && (
              <div className="pt-4 border-t border-border">
                <RequestCancellationDialog orderId={order.id} />
              </div>
            )}
            {isCancellationRequested && (
              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-[9px] font-bold uppercase text-muted-foreground italic">
                  Your cancellation request is being reviewed by our team.
                </p>
                {order.cancellation_reason && (
                  <p className="text-[10px] text-foreground bg-muted p-3 rounded-lg border border-border/50">
                    <span className="font-bold opacity-40 mr-1">REASON:</span>
                    {order.cancellation_reason}
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
