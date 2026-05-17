"use client";

import { cn } from "@/lib/utils";

interface ElitePriceProps {
  amount: number;
  className?: string;
}

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const ElitePrice = ({ amount, className = "" }: ElitePriceProps) => {
  const formatted = formatPrice(amount);
  const symbol = "Rs. ";
  const value = formatted.replace("₹", "").trim();

  return (
    <div className={cn("flex items-baseline gap-0.5 font-sans", className)}>
      <span className="text-[0.6em] font-medium text-foreground translate-y-[-0.05em]">{symbol}</span>
      <span className="font-bold tabular-nums tracking-tight">{value}</span>
    </div>
  );
};
