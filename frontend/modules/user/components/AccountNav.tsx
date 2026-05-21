"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/context/auth.context";

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const navItems = [
    {
      name: "Profile Settings",
      href: "/accounts",
      icon: User,
    },
    {
      name: "Order History",
      href: "/accounts/myorders",
      icon: ShoppingBag,
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

  return (
    <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none border-b lg:border-b-0 border-neutral-100">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 whitespace-nowrap",
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.name}
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl text-red-600 hover:bg-red-50/50 hover:text-red-700 transition-all duration-200 whitespace-nowrap mt-0 lg:mt-4 text-left"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Sign Out
      </button>
    </nav>
  );
}
