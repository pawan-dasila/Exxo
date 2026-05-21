export const siteConfig = {
  name: "EXXO",
  description:
    "EXXO helps people borrow things from nearby trusted users instead of buying them — from cameras and gadgets to fashion and outdoor gear.",
  tagline: "Borrow Anything Nearby.",
  url: "https://exxo.in",
  ogImage: "https://exxo.in/og-image.png",
  logo: "/svg/logo.svg",

  business: {
    tradeName: "EXXO",
    legalName: "EXXO Peer-to-Peer Rentals Private Limited",
    address: {
      full: "Bengaluru, Karnataka, India",
      building: "EXXO Spaces",
      street: "80 Feet Road, Koramangala",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      pin: "560034",
    },
  },

  socials: {
    instagram: "https://instagram.com/exxo.in",
    facebook: "https://facebook.com/exxo.in",
    twitter: "https://twitter.com/exxo_in",
  },

  contact: {
    email: "support@exxo.in",
    phone: "+91 7819805935",
    address: "Bengaluru, Karnataka, India",
  },

  keywords: [
    "EXXO",
    "borrow items near you",
    "rent from neighbors",
    "peer to peer rentals",
    "sharing economy India",
    "camera rentals",
    "borrow gadgets",
    "trekking gear rental",
    "fashion rentals",
    "community sharing app",
  ],

  seo: {
    titleSeparator: " — ",
    defaultTitle: "EXXO — Borrow Anything Near You",
    twitterHandle: "@exxo_in",
    siteName: "EXXO",
  },

  navigation: {
    main: [
      {
        name: "Products",
        href: "/products",
        icon: "ShoppingBag",
        ariaLabel: "View all products",
      },
      {
        name: "About",
        href: "/about",
        icon: "Info",
        ariaLabel: "About EXXO",
      },
      {
        name: "Contact",
        href: "/contact",
        icon: "Mail",
        ariaLabel: "Contact support",
      },
    ],
    footer: {
      popular: [
        { name: "Cameras & Gear", href: "/products?category=cameras" },
        { name: "Electronics", href: "/products?category=electronics" },
        { name: "Trekking & Outdoor", href: "/products?category=trekking" },
        { name: "Ethnic Wear", href: "/products?category=clothing" },
        { name: "Books & Study", href: "/products?category=books" },
        { name: "Gaming", href: "/products?category=gaming" },
      ],
      support: [
        { name: "How It Works", href: "/how-it-works" },
        { name: "List Your Item", href: "/list-item" },
        { name: "Returns & Policy", href: "/returns" },
        { name: "Trust & Safety", href: "/trust" },
        { name: "FAQ", href: "/faq" },
      ],
      legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Rental Agreement", href: "/rental-agreement" },
      ],
    },
  },
};

export type SiteConfig = typeof siteConfig;
