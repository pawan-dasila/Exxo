import Link from "next/link";
import { BrandLogo } from "@/components/layout/shared/BrandLogo";
import { DesktopSearchBar, MobileSearchDialog } from "./navbar/search-bar";
import { NavbarInteractive } from "./navbar/navbar-interactive";
import { siteConfig } from "@/lib/config/site";

export function Navbar() {
  return (
    <header
      data-nosnippet
      className="relative z-50 w-full bg-white border-b border-border/50"
    >
      <div className="max-w-none w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-18 gap-3 lg:gap-4">
        {/* Logo — static server-rendered */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            aria-label={`${siteConfig.name} - Return to Homepage`}
            className="group flex items-center transition-all hover:scale-[1.02] active:scale-95 duration-300"
          >
            <BrandLogo size="md" />
          </Link>
        </div>

        <DesktopSearchBar />

        <MobileSearchDialog />

        <NavbarInteractive />
      </div>
    </header>
  );
}
