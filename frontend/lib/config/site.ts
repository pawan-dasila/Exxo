export const siteConfig = {
  name: "EXXO",
  description:
    "India's first peer-to-peer item sharing platform. Borrow cameras, gadgets, clothes, trekking gear and more from verified neighbors near you. Save money, reduce waste, build community.",
  tagline: "Before You Buy, Check if You Can Borrow.",
  url: "https://exxo.in",
  ogImage: "https://exxo.in/og-image.png",
  logo: "/svg/logo.svg",

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
    "peer to peer sharing India",
    "rent cameras Bangalore",
    "borrow gadgets near me",
    "circular economy India",
    "sharing economy platform India",
    "rent clothes online India",
    "borrow trekking gear Bangalore",
    "item sharing app India",
    "neighbors sharing platform",
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
