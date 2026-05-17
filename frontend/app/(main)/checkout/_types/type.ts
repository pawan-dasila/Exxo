import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { CheckoutAddress } from "@/modules/checkout/types";

// --- Razorpay Types ---

export interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, unknown>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    animation?: boolean;
    confirm_close?: boolean;
  };
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  timeout?: number;
  callback_url?: string;
  redirect?: boolean;
}

// --- Checkout Form Schemas & Types ---

export const checkoutSchema = z.object({
  payment_method: z.enum(["razorpay", "cod"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const addressSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  address_line_1: z.string().min(5, "Address too short"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postal_code: z.string().length(6, "Must be 6 digits"),
  country: z.string(),
  recipient_phone: z.string().length(10, "Must be 10 digits"),
});

export type AddressSelectorValues = z.infer<typeof addressSchema>;

// --- Component Prop Interfaces ---

export interface AddressSelectorProps {
  addresses: CheckoutAddress[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddAddress: (values: AddressSelectorValues) => Promise<{
    data: { id: string } | null;
    error: string | { message: string } | null;
  }>;
  isAddingAddress: boolean;
  isLoading?: boolean;
}

import { CartItem } from "@/modules/cart/types";

export interface CouponResult {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  discountAmount: number;
}

export interface CheckoutSidebarProps {
  cartItems: CartItem[]; // Using any[] to match existing loosely typed items if needed, or keep CartItem[]
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  appliedCoupon?: CouponResult | null;
  onApplyCoupon: (coupon: CouponResult | null) => void;
  isCalculatingShipping: boolean;
  isPlacingOrder: boolean;
  onPlaceOrder: () => void;
  isServiceable?: boolean;
  isCheckingServiceability?: boolean;
  expectedDeliveryDate?: string | null;
}

export interface UnifiedAddressFormProps {
  form: UseFormReturn<AddressSelectorValues>;
}

export interface PaymentSectionProps {
  form: UseFormReturn<CheckoutFormValues>;
  supportsCOD?: boolean;
  isCheckingServiceability?: boolean;
}
