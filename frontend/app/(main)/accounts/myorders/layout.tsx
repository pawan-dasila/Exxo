import React from "react";

interface MyOrdersLayoutProps {
  children: React.ReactNode;
}

export default function MyOrdersLayout({ children }: MyOrdersLayoutProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white border-b border-stone-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 mb-8 lg:bg-transparent lg:border-b-0 lg:p-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-italiana text-stone-900 lg:hidden">Order History</h1>
          <p className="text-xs text-stone-500 uppercase tracking-widest lg:hidden">
            Vestrostyles Boutiques — Global Shipping
          </p>
        </div>
      </div>
      
      {children}
    </div>
  );
}
