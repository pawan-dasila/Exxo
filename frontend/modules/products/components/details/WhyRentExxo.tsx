import React from "react";
import { ShieldCheck, Zap, Sparkles, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const REASONS = [
  {
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Secure Payments",
    desc: "100% secure escrow transactions",
  },
  {
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "Damage Protection",
    desc: "Accidental scratch coverage program",
  },
  {
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    title: "Hygiene Guaranteed",
    desc: "Sanitized completely prior to delivery",
  },
  {
    icon: HelpCircle,
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
    title: "24/7 Support",
    desc: "Around the clock community help desk",
  },
];

export function WhyRentExxo() {
  return (
    <Card className="rounded-3xl border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      <CardHeader className="pb-3 pt-5 px-6">
        <CardTitle className="text-xs uppercase font-extrabold text-neutral-800 tracking-wider">
          Why Rent on Exxo?
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-4">
        {REASONS.map(({ icon: Icon, color, bg, border, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${color} border ${border} shadow-sm shrink-0`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <h5 className="text-xs font-extrabold text-neutral-900">{title}</h5>
              <p className="text-[10px] text-neutral-400 font-bold mt-0.5 uppercase tracking-wide">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
