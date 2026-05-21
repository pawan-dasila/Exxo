"use client";

import { Share2 } from "lucide-react";

interface ProductShareButtonProps {
  name: string;
  price: number;
}

export function ProductShareButton({ name, price }: ProductShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title: name,
      text: `Rent the ${name} for just ₹${price}/day on Exxo!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Share this listing"
      className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm mt-0.5"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}
