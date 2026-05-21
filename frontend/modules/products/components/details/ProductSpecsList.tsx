"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_SPECS = [
  "24.1 MP APS-C CMOS Sensor",
  "Dual Pixel CMOS AF",
  "Wi-Fi, NFC & Bluetooth",
  "4K Video Recording",
  "3-inch Vari-angle Touch Screen",
  "ISO Range: 100 - 25600",
  "Continuous Shooting: 7 fps",
  "Built-in Flash with E-TTL II",
  "Weight: 449 g (body only)",
  "Battery Life: ~1,300 shots",
];

const INITIAL_COUNT = 5;

export function ProductSpecsList() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? ALL_SPECS : ALL_SPECS.slice(0, INITIAL_COUNT);

  return (
    <div className="space-y-1.5">
      <ul className="space-y-1.5">
        {visible.map((spec) => (
          <li
            key={spec}
            className="flex items-start gap-2 text-xs font-semibold text-neutral-700"
          >
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
            {spec}
          </li>
        ))}
      </ul>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-1 h-auto p-0 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-transparent gap-1"
      >
        {expanded ? (
          <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
        ) : (
          <>Show more <ChevronDown className="h-3.5 w-3.5" /></>
        )}
      </Button>
    </div>
  );
}
