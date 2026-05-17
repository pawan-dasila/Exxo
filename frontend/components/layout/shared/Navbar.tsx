"use client";

import { useState, memo, useCallback } from "react";
import { Menu, X, Sparkles, ShoppingBag, LucideIcon } from "lucide-react";
import Link from "next/link";
// import { useCartItems } from "@/modules/cart/hooks";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { BrandLogo } from "@/components/layout/shared/BrandLogo";
import { NavbarSearch } from "./NavbarSearch";
import * as Icons from "lucide-react";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config/site";
import { useUI } from "@/components/context/UIContext";

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
  const { openCart } = useUI();
  // const { data: cartItems = [] } = useCartItems();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const itemCount = cartItems.length;
  const itemCount = 3;

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
      <div className="max-w-none w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {siteConfig.navigation.main.map((item) => {
            const IconComponent =
              (Icons[item.icon as keyof typeof Icons] as LucideIcon) ||
              Icons.Sparkles;

            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.ariaLabel}
                className={`group relative flex items-center gap-1.5 text-[12px] font-bold uppercase transition-all duration-300 whitespace-nowrap ${isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground"}`}
              >
                <IconComponent
                  className={`w-3.5 h-3.5 stroke-[1.2] transition-colors ${isActive ? "text-brand-gold" : "group-hover:text-brand-gold"}`}
                />
                <span>{item.name}</span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 flex justify-start md:justify-center">
          <Link
            href="/"
            aria-label={`${siteConfig.name} - Return to Homepage`}
            className="group flex items-center transition-all hover:scale-[1.02] active:scale-95 duration-300"
          >
            <BrandLogo size="md" className="md:hidden" />
            <BrandLogo size="lg" className="hidden md:flex" />
          </Link>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end gap-1 md:gap-2 flex-1">
          {/* <NavbarSearch /> */}
          <UserProfile />
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            aria-label="Open shopping bag"
            className="rounded-full hover:bg-brand-gold hover:text-white transition-all relative outline-offset-2"
          >
            <ShoppingBag
              className="w-6 h-6 md:w-9 md:h-9 stroke-[1.5]"
              aria-hidden="true"
            />
            {itemCount > 0 && (
              <span
                aria-live="polite"
                aria-atomic="true"
                className="absolute top-2 right-2.5 bg-emerald-500 w-2.5 h-2.5 rounded-full border-2 border-white"
              >
                <span className="sr-only">{itemCount} items in bag</span>
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-brand-gold hover:text-white transition-all outline-offset-2"
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
              <X className="w-6 h-6 stroke-[1.5]" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Expansion */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border overflow-hidden">
          <div className="px-6 py-10 flex flex-col gap-8">
            <div aria-hidden="true" className="flex flex-col gap-6">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="text-2xl font-serif flex items-center gap-4 text-left uppercase group w-fit"
              >
                <Icons.Home
                  className={`w-6 h-6 stroke-[1.2] transition-colors ${pathname === "/" ? "text-brand-gold" : "text-stone-400 group-hover:text-brand-gold"}`}
                />
                <span className="relative">
                  Home
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all ${pathname === "/" ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </span>
              </Link>
              {siteConfig.navigation.main.map((item) => {
                const IconComponent =
                  (Icons[item.icon as keyof typeof Icons] as LucideIcon) ||
                  Icons.Sparkles;

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="text-2xl font-serif flex items-center gap-4 text-left uppercase group w-fit"
                  >
                    <IconComponent
                      className={`w-6 h-6 stroke-[1.2] transition-colors ${isActive ? "text-brand-gold" : "text-stone-400 group-hover:text-brand-gold"}`}
                    />
                    <span className="relative">
                      {item.name}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col gap-4 pt-6 border-t border-border">
              <Link
                href="/products?filter=new"
                onClick={closeMobileMenu}
                className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 uppercase"
              >
                <Sparkles className="w-4 h-4" /> Drops
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
