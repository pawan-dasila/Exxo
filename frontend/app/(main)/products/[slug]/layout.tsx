import React from "react";

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      {children}
    </div>
  );
}
