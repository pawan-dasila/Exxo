"use client";

import React, { useState, memo, useCallback } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  PlusCircle,
  Bell,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useUI } from "@/components/context/UIContext";
import { BrandLogo } from "@/components/layout/shared/BrandLogo";
import { NavbarSearch } from "@/components/layout/shared/NavbarSearch";
import { siteConfig } from "@/lib/config/site";

const UserProfile = dynamic(
  () =>
    import("@/modules/user/components/user-profile").then(
      (mod) => mod.UserProfile,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-9 rounded-full bg-stone-100 animate-pulse" />
    ),
  },
);

export const Navbar = memo(function Navbar() {
  const { openCart } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    [],
  );
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <header
      data-nosnippet
      className="relative z-50 transition-all duration-300 w-full bg-white border-b border-border/50"
    >
      <div className="max-w-none w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px] gap-3 lg:gap-4">

        {/* Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            aria-label={`${siteConfig.name} - Return to Homepage`}
            className="group flex items-center transition-all hover:scale-[1.02] active:scale-95 duration-300"
          >
            <BrandLogo size="md" />
          </Link>
        </div>

        {/* Search bar — full form on md+, icon only on mobile */}
        <NavbarSearch />

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Become a Lender — lg+ only */}
          <Link
            href="/how-it-works"
            className="text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap hidden lg:inline-flex items-center"
          >
            Become a Lender
          </Link>

          {/* List Your Item — xl+ only */}
          <Link
            href="/products?create=true"
            className="bg-[#0b1b3d] hover:bg-[#152e61] active:scale-[0.98] text-white px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide transition-all shadow-sm hidden xl:flex items-center gap-1.5 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>List Your Item</span>
          </Link>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            aria-label="Open shopping bag"
            className="rounded-full cursor-pointer transition-all relative w-10 h-10 text-stone-600 hover:text-stone-800 hover:bg-stone-100"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
          </Button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="w-10 h-10 rounded-full hover:bg-stone-100 hidden sm:flex items-center justify-center relative cursor-pointer text-stone-600 hover:text-stone-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <UserProfile />

          {/* Hamburger — lg and below */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full hover:bg-stone-100 transition-all w-10 h-10 shrink-0"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-haspopup="true"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border overflow-hidden absolute top-full left-0 w-full shadow-lg z-50">
          <div className="px-5 py-6 flex flex-col gap-5">
            <nav className="flex flex-col gap-4 pt-2">
              <Link
                href="/products"
                onClick={closeMobileMenu}
                className="text-base font-bold text-stone-800 flex items-center gap-3"
              >
                <ShoppingBag className="w-5 h-5 text-stone-500" />
                Browse Products
              </Link>
              <Link
                href="/how-it-works"
                onClick={closeMobileMenu}
                className="text-base font-bold text-stone-800 flex items-center gap-3"
              >
                <Info className="w-5 h-5 text-stone-500" />
                Become a Lender
              </Link>
              <Link
                href="/products?create=true"
                onClick={closeMobileMenu}
                className="text-base font-bold text-stone-800 flex items-center gap-3"
              >
                <PlusCircle className="w-5 h-5 text-stone-500" />
                List Your Item
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
});
