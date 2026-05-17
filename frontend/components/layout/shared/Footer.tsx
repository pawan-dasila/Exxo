"use client";

import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/config/site";
import { BrandLogo } from "@/components/layout/shared/BrandLogo";

export const Footer = () => {
  return (
    <div className="px-1 sm:px-4 pb-1 sm:pb-4">
      <footer
        data-nosnippet
        className="bg-black text-background pt-10 pb-4 md:pb-12 rounded-2xl md:rounded-[3rem]"
      >
        <div className="max-w-none w-full px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 mb-14 md:mb-24">
            <div className="col-span-2 lg:col-span-5">
              <BrandLogo size="lg" forceLight className="mb-6" />
              <p className="text-muted-foreground mb-8 max-w-sm text-xs md:text-sm leading-relaxed">
                {siteConfig.description}
              </p>
              <form
                className="flex w-full group mb-8"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Newsletter subscription"
              >
                <div className="relative flex-1">
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent border border-muted-foreground/30 rounded-full px-6 py-4 w-full focus:outline-none focus:border-white transition-all text-sm pr-[120px]"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 bg-white text-black px-8 rounded-full text-xs font-bold hover:bg-stone-200 transition-colors uppercase tracking-wider"
                  >
                    Submit
                  </button>
                </div>
              </form>
              <div className="flex gap-4">
                {siteConfig.socials.instagram && (
                  <Link
                    href={siteConfig.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-muted-foreground/20 flex items-center justify-center hover:bg-white/10 transition-all group"
                    aria-label="Instagram"
                  >
                    <Image
                      src="/svg/instagram.svg"
                      alt="Instagram"
                      width={20}
                      height={20}
                      className="transition-all sm:w-5 sm:h-5 group-hover:scale-110"
                    />
                  </Link>
                )}
                {siteConfig.socials.facebook && (
                  <Link
                    href={siteConfig.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-muted-foreground/20 flex items-center justify-center hover:bg-white/10 transition-all group"
                    aria-label="Facebook"
                  >
                    <Image
                      src="/svg/facebook.svg"
                      alt="Facebook"
                      width={20}
                      height={20}
                      className="transition-all sm:w-5 sm:h-5 group-hover:scale-110"
                    />
                  </Link>
                )}
                {siteConfig.socials.twitter && (
                  <Link
                    href={siteConfig.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-muted-foreground/20 flex items-center justify-center hover:bg-white/10 transition-all group"
                    aria-label="X (formerly Twitter)"
                  >
                    <Image
                      src="/svg/x.svg"
                      alt="X"
                      width={18}
                      height={18}
                      className="invert transition-all sm:w-4 sm:h-4 group-hover:scale-110"
                    />
                  </Link>
                )}
              </div>
            </div>

            <nav
              aria-hidden="true"
              className="col-span-1 lg:col-span-2 lg:col-start-9"
              aria-labelledby="footer-popular-heading"
            >
              <h3
                id="footer-popular-heading"
                className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-6"
              >
                POPULAR
              </h3>
              <ul className="space-y-4 text-xs md:text-sm text-muted-foreground">
                {siteConfig.navigation.footer.popular.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav
              className="col-span-1 lg:col-span-2 lg:col-start-11"
              aria-labelledby="footer-other-heading"
            >
              <h3
                id="footer-other-heading"
                className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-6"
              >
                SUPPORT
              </h3>
              <ul className="space-y-4 text-xs md:text-sm text-muted-foreground">
                {siteConfig.navigation.footer.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav
              className="col-span-1 lg:col-span-2 lg:col-start-13"
              aria-labelledby="footer-legal-heading"
            >
              <h3
                id="footer-legal-heading"
                className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-6"
              >
                LEGAL
              </h3>
              <ul className="space-y-4 text-xs md:text-sm text-muted-foreground">
                {siteConfig.navigation.footer.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="border-t border-muted-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div className="flex gap-6">
              {siteConfig.navigation.footer.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-background transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
