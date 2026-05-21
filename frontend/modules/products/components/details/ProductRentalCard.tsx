"use client";

import React, { useState, useMemo } from "react";
import { CalendarIcon, Info, Zap } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ExtendedProduct } from "./types";
import { cn } from "@/lib/utils";

interface ProductRentalCardProps {
  product: ExtendedProduct;
}

export function ProductRentalCard({ product }: ProductRentalCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
  });

  const [pickupOpen, setPickupOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const rentalDays = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const days = differenceInDays(dateRange.to, dateRange.from);
    return days > 0 ? days : 1;
  }, [dateRange]);

  const basePricePerDay = product.rentalPrice;
  const discountRate = rentalDays >= 7 ? 0.2 : rentalDays >= 3 ? 0.1 : 0;
  const actualPricePerDay = Math.round(basePricePerDay * (1 - discountRate));
  const itemsTotal = actualPricePerDay * rentalDays;
  const serviceFee = 49;
  const depositAmount = product.depositAmount || 0;
  const totalPayable = itemsTotal + serviceFee + depositAmount;

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] space-y-5">
      {/* ── Title ── */}
      <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
        Select Rental Dates
      </h3>

      {/* ── Date Pickers ── */}
      <div className="space-y-3">
        {/* Pick-up date */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Pick-up Date
          </p>
          <Popover open={pickupOpen} onOpenChange={setPickupOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between rounded-xl border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left font-semibold text-sm h-11",
                  !dateRange?.from && "text-muted-foreground",
                )}
              >
                {dateRange?.from
                  ? format(dateRange.from, "dd MMM yyyy")
                  : "Select date"}
                <CalendarIcon className="h-4 w-4 text-neutral-400 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
              <Calendar
                mode="single"
                selected={dateRange?.from}
                onSelect={(day) => {
                  if (!day) return;
                  setDateRange((prev) => ({
                    from: day,
                    to:
                      prev?.to && prev.to > day
                        ? prev.to
                        : new Date(day.getTime() + 2 * 24 * 60 * 60 * 1000),
                  }));
                  setPickupOpen(false);
                }}
                disabled={{ before: today }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return date */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Return Date
          </p>
          <Popover open={returnOpen} onOpenChange={setReturnOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between rounded-xl border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-left font-semibold text-sm h-11",
                  !dateRange?.to && "text-muted-foreground",
                )}
              >
                {dateRange?.to
                  ? format(dateRange.to, "dd MMM yyyy")
                  : "Select date"}
                <CalendarIcon className="h-4 w-4 text-neutral-400 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
              <Calendar
                mode="single"
                selected={dateRange?.to}
                onSelect={(day) => {
                  if (!day) return;
                  setDateRange((prev) => ({
                    from: prev?.from ?? today,
                    to: day,
                  }));
                  setReturnOpen(false);
                }}
                disabled={{ before: dateRange?.from ?? today }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Separator />

      {/* ── Pricing Breakdown ── */}
      <div className="space-y-3 text-xs font-semibold text-neutral-700">
        {/* Duration header */}
        <div className="flex items-center justify-between font-bold">
          <span className="text-neutral-500 uppercase tracking-wide">
            {rentalDays} {rentalDays === 1 ? "Day" : "Days"} Rental
          </span>
          <span className="text-neutral-900 font-extrabold">₹{itemsTotal}</span>
        </div>

        {/* Price calc */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pl-2 border-l-2 border-neutral-100">
          <span>
            Price (₹{basePricePerDay} X {rentalDays} days)
          </span>
          <span>₹{basePricePerDay * rentalDays}</span>
        </div>

        {/* Duration discount */}
        {discountRate > 0 && (
          <div className="flex items-center justify-between text-[11px] pl-2 border-l-2 border-emerald-100 text-emerald-600">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Duration Discount ({discountRate * 100}%)
            </span>
            <span>
              −₹{Math.round(basePricePerDay * discountRate * rentalDays)}
            </span>
          </div>
        )}

        {/* Delivery fee */}
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 uppercase tracking-wide">
            Delivery Fee
          </span>
          <span className="text-emerald-600 font-extrabold">Free</span>
        </div>

        {/* Service fee */}
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 uppercase tracking-wide">
            Service Fee
          </span>
          <span className="text-neutral-900 font-extrabold">₹{serviceFee}</span>
        </div>

        {/* Security deposit */}
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 uppercase tracking-wide">
            Security Deposit{" "}
            <span className="font-medium text-[10px] normal-case text-neutral-400">
              (Refundable)
            </span>
          </span>
          <span className="text-neutral-900 font-extrabold">
            ₹{depositAmount}
          </span>
        </div>

        <Separator className="bg-neutral-100" />

        {/* Total */}
        <div className="flex items-center justify-between font-black text-neutral-900 text-sm pt-1">
          <span className="uppercase tracking-wider">Total Payable</span>
          <span className="text-lg">₹{totalPayable}</span>
        </div>
      </div>

      {/* ── CTA ── */}
      <div>
        <Button className="w-full h-10 cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-xl shadow-md transition-all hover:shadow-lg uppercase tracking-wider text-xs">
          Rent Now
        </Button>
      </div>

      <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-3.5 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
        <p className="text-[10px] font-semibold text-neutral-400 leading-relaxed">
          You won&apos;t be charged yet. Once the owner confirms, you&apos;ll be
          able to complete the secure payment.
        </p>
      </div>
    </div>
  );
}
