"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartItems } from "@/modules/cart/hooks";
import { useCheckout } from "@/modules/checkout/hooks/useCheckout";
import { useUser } from "@/modules/users/hooks/use-user";
import { useCheckoutTotals } from "@/modules/checkout/hooks/useCheckoutTotals";
import { useRazorpay } from "@/modules/checkout/hooks/useRazorpay";

import { AddressSelector } from "@/modules/checkout/components/AddressSelector";
import { CheckoutSidebar } from "@/modules/checkout/components/CheckoutSidebar";
import { PaymentSection } from "@/modules/checkout/components/PaymentSection";
import { CheckoutEmptyState } from "./CheckoutEmptyState";
import { CheckoutTransientError } from "./CheckoutTransientError";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import Script from "next/script";
import {
  checkoutSchema,
  CheckoutFormValues,
  CouponResult,
} from "../_types/type";

export function CheckoutContent() {
  const { data: cartItems = [], isLoading: isLoadingCart } = useCartItems();
  const { data: user } = useUser();
  const checkout = useCheckout();
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);

  // 1. Domain Logic Hooks
  const { subtotal, totalWeight, discountAmount } = useCheckoutTotals({
    cartItems,
    appliedCoupon,
    shippingCost: checkout.shippingCost,
  });

  const selectedAddress = checkout.addresses.find(
    (a) => a.id === checkout.selectedAddressId,
  );

  const {
    initiatePayment,
    isVerifyingPayment,
    isInitializingPayment,
    transientError,
  } = useRazorpay({
    user,
    cartItems,
    subtotal,
    shippingCost: checkout.shippingCost,
    discountAmount,
    couponId: appliedCoupon?.id,
    selectedAddressId: checkout.selectedAddressId,
    selectedAddress,
  });

  // 2. Form Setup
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: "razorpay",
    },
  });

  // 3. Side Effects (Shipping Recalculation)
  // Vercel Best Practice: rerender-dependencies
  // Use specific primitives in the dependency array to avoid redundant triggers

  const { calculateShipping, selectedAddressId } = checkout;

  useEffect(() => {
    if (selectedAddressId) {
      calculateShipping(selectedAddressId, totalWeight, subtotal);
    }
  }, [calculateShipping, selectedAddressId, totalWeight, subtotal]);

  // ── Rendering Logic ──────────────────────────────────────────────────────

  if (isLoadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (transientError) {
    return (
      <CheckoutTransientError
        orderId={transientError.orderId}
        paymentId={transientError.paymentId}
      />
    );
  }

  if (cartItems.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* Payment Verification Overlay */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm gap-4">
          <div className="w-10 h-10 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground">
            Verifying Payment...
          </p>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border/10 py-6 px-6 lg:px-12 flex justify-between items-center group">
        <Link
          href="/"
          className="flex items-center gap-3 text-[10px] font-black uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </div>

      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-px bg-border/10 h-full">
        {/* Main Form Area */}
        <div className="lg:col-span-7 bg-background p-6 lg:p-12 lg:pr-16">
          <Form {...form}>
            <div className="space-y-10">
              <Accordion
                type="multiple"
                defaultValue={["delivery", "payment"]}
                className="w-full space-y-8"
              >
                <AccordionItem value="delivery" className="border-none">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 mb-6">
                    <span className="w-6 h-6 rounded-md bg-muted/20 flex items-center justify-center text-[10px]">
                      1
                    </span>
                    Delivery Destination
                  </h2>
                  <AccordionContent className="pt-0 pb-2 overflow-visible">
                    <AddressSelector
                      addresses={checkout.addresses}
                      selectedId={checkout.selectedAddressId}
                      onSelect={checkout.setSelectedAddressId}
                      onAddAddress={async (values) => {
                        return await checkout.addAddressAsync({
                          recipient_name: `${values.first_name} ${values.last_name}`,
                          recipient_phone: values.recipient_phone,
                          address_line_1: values.address_line_1,
                          address_line_2: values.address_line_2 ?? null,
                          city: values.city,
                          state: values.state,
                          postal_code: values.postal_code,
                          country: values.country,
                          type: "shipping",
                        });
                      }}
                      isAddingAddress={checkout.isAddingAddress}
                      isLoading={checkout.isLoadingAddresses}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment" className="border-none">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 mb-6">
                    <span className="w-6 h-6 rounded-md bg-muted/20 flex items-center justify-center text-[10px]">
                      2
                    </span>
                    Secure Payment
                  </h2>
                  <AccordionContent className="pt-0 pb-6">
                    <form
                      onSubmit={form.handleSubmit(initiatePayment)}
                      className="space-y-6"
                    >
                      <PaymentSection
                        form={form}
                        supportsCOD={checkout.supportsCOD}
                        isCheckingServiceability={
                          checkout.isCheckingServiceability
                        }
                      />
                    </form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Form>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 bg-muted/5 p-6 lg:p-12 lg:pl-16 border-l border-border/10">
          <CheckoutSidebar
            cartItems={cartItems}
            subtotal={subtotal}
            shippingCost={checkout.shippingCost}
            discountAmount={discountAmount}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
            isCalculatingShipping={checkout.isCalculatingShipping}
            isServiceable={checkout.isServiceable}
            isCheckingServiceability={checkout.isCheckingServiceability}
            expectedDeliveryDate={checkout.expectedDeliveryDate}
            isPlacingOrder={
              isInitializingPayment ||
              isVerifyingPayment ||
              checkout.isPlacingOrder
            }
            onPlaceOrder={form.handleSubmit(initiatePayment)}
          />
        </div>
      </div>
    </div>
  );
}
