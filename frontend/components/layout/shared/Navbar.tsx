"use client";

import React, { useState, memo, useCallback, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  MapPin,
  ChevronDown,
  PlusCircle,
  Bell,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/lib/config/site";
import { useUI } from "@/components/context/UIContext";
import { BrandLogo } from "@/components/layout/shared/BrandLogo";

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
  const pathname = usePathname();
  const router = useRouter();
  const { openCart } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Koramangala, Bangalore");

  const itemCount = 3;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      const loc = params.get("location") || "Koramangala, Bangalore";
      setSearchQuery(q);
      setLocation(loc);
    }
  }, [pathname]);

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    [],
  );
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    if (location.trim() && location !== "Koramangala, Bangalore") {
      params.set("location", location.trim());
    }
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <header
      data-nosnippet
      className="relative z-50 transition-all duration-300 w-full bg-white border-b border-border/50"
    >
      <div className="max-w-none w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px] gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            aria-label={`${siteConfig.name} - Return to Homepage`}
            className="group flex items-center transition-all hover:scale-[1.02] active:scale-95 duration-300"
          >
            <BrandLogo size="md" />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-2xl">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center bg-[#f4f5f8] border border-transparent focus-within:border-stone-200 focus-within:bg-white focus-within:shadow-md rounded-full px-4 py-2 transition-all duration-200 gap-2"
          >
            <div className="flex-1 flex items-center gap-2.5 min-w-0">
              <Search className="text-stone-400 shrink-0 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for items (e.g. Camera, Laptop, Tent...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-[13px] text-stone-800 placeholder:text-stone-400/80 w-full min-w-0"
              />
            </div>

            <div className="w-px h-5 bg-stone-300 shrink-0" />

            <div className="flex items-center gap-2 shrink-0 min-w-0">
              <MapPin className="text-stone-500 shrink-0 w-4 h-4" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-xs font-semibold text-stone-700 placeholder:text-stone-400/80 w-[140px] truncate"
              />
              <span className="bg-stone-200/60 px-2 py-0.5 rounded-full text-[10px] font-bold text-stone-600 shrink-0 select-none">
                5 km
              </span>
              <ChevronDown className="text-stone-400 w-3.5 h-3.5 shrink-0 ml-0.5" />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          <Link
            href="/how-it-works"
            className="text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap hidden lg:inline-flex items-center"
          >
            Become a Lender
          </Link>

          <Link
            href="/products?create=true"
            className="bg-[#0b1b3d] hover:bg-[#152e61] active:scale-[0.98] text-white px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide transition-all shadow-sm hidden sm:flex items-center gap-1.5 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>List Your Item</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            aria-label="Open shopping bag"
            className="rounded-full cursor-pointer transition-all relative w-10 h-10 text-stone-600 hover:text-stone-800 hover:bg-stone-100"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span
                aria-live="polite"
                aria-atomic="true"
                className="absolute top-2 right-2 bg-emerald-500 w-2 h-2 rounded-full border border-white"
              >
                <span className="sr-only">{itemCount} items in bag</span>
              </span>
            )}
          </Button>

          <button
            aria-label="Notifications"
            className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center relative cursor-pointer text-stone-600 hover:text-stone-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <UserProfile />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-stone-100 transition-all w-10 h-10 shrink-0"
            onClick={toggleMobileMenu}
            aria-label={
              isMobileMenuOpen
                ? "Close main navigation menu"
                : "Open main navigation menu"
            }
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

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border overflow-hidden absolute top-full left-0 w-full shadow-lg z-50">
          <div className="px-5 py-6 flex flex-col gap-6">
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
              <div className="flex items-center bg-[#f4f5f8] border border-transparent focus-within:border-stone-200 focus-within:bg-white rounded-xl px-4 py-2.5 gap-2">
                <Search className="text-stone-400 shrink-0 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-sm text-stone-800 placeholder:text-stone-400 w-full"
                />
              </div>

              <div className="flex items-center bg-[#f4f5f8] border border-transparent focus-within:border-stone-200 focus-within:bg-white rounded-xl px-4 py-2.5 gap-2">
                <MapPin className="text-stone-500 shrink-0 w-4 h-4" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 text-sm font-semibold text-stone-700 placeholder:text-stone-400 w-full"
                />
                <span className="bg-stone-200/60 px-2 py-0.5 rounded-full text-[10px] font-bold text-stone-600 shrink-0">
                  5 km
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0b1b3d] hover:bg-[#152e61] text-white py-2.5 rounded-xl text-sm font-bold"
              >
                Search
              </Button>
            </form>

            <div className="flex flex-col gap-4 pt-4 border-t border-stone-100">
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
