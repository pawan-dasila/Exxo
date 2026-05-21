"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Menu, X, ShoppingBag, PlusCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function NavbarActions({
  onToggleMenu,
  isMenuOpen,
}: {
  onToggleMenu: () => void;
  isMenuOpen: boolean;
}) {
  const { openCart } = useUI();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      <Link
        // href="/how-it-works"
        href="/"
        className="text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap hidden lg:inline-flex items-center"
      >
        Become a Lender
      </Link>

      <Link
        href="/products?create=true"
        className="bg-[#0b1b3d] hover:bg-[#152e61] active:scale-[0.98] text-white px-5 py-2.5 rounded-full text-[12px] font-bold tracking-wide transition-all shadow-sm hidden xl:flex items-center gap-1.5 whitespace-nowrap"
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
      </Button>

      <UserProfile />

      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden rounded-full hover:bg-stone-100 transition-all w-10 h-10 shrink-0"
        onClick={onToggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        {isMenuOpen ? (
          <X className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}

// ─── Mobile Menu Drawer ───────────────────────────────────────────────────────

export function MobileMenuDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="lg:hidden bg-white border-b border-border overflow-hidden absolute top-full left-0 w-full shadow-lg z-50">
      <div className="px-5 py-6 flex flex-col gap-5">
        <nav className="flex flex-col gap-4 pt-2">
          <Link
            href="/products"
            onClick={onClose}
            className="text-base font-bold text-stone-800 flex items-center gap-3"
          >
            <ShoppingBag className="w-5 h-5 text-stone-500" />
            Browse Products
          </Link>
          <Link
            href="/how-it-works"
            onClick={onClose}
            className="text-base font-bold text-stone-800 flex items-center gap-3"
          >
            <Info className="w-5 h-5 text-stone-500" />
            Become a Lender
          </Link>
          <Link
            href="/products?create=true"
            onClick={onClose}
            className="text-base font-bold text-stone-800 flex items-center gap-3"
          >
            <PlusCircle className="w-5 h-5 text-stone-500" />
            List Your Item
          </Link>
        </nav>
      </div>
    </div>
  );
}

// ─── NavbarInteractive — owns menu open/close state ──────────────────────────
// Wraps NavbarActions + MobileMenuDrawer so the parent Navbar stays server-side

export function NavbarInteractive() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsMenuOpen((p) => !p), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <>
      <NavbarActions onToggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      {isMenuOpen && <MobileMenuDrawer onClose={closeMenu} />}
    </>
  );
}
