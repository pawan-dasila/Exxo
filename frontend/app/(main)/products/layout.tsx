import React from "react";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#fafbff] min-h-screen">
      <div className="max-w-full mx-auto min-h-screen">{children}</div>
    </div>
  );
}
