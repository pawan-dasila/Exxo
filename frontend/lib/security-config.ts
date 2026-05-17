export const SECURITY_CONFIG = {
  // 1. Rate Limiting Strategy (Thresholds per 15 mins)
  RATE_LIMITING: {
    AUTH_ROUTES: 10, // Max login/register attempts
    CHECKOUT_ROUTES: 5, // Max checkout attempts
    DEFAULT: 100,
  },

  // 2. Cookie Hardening Standards
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  // Routes that should be audited when accessed
  SENSITIVE_ROUTES: ["/admin", "/checkout"],

  XSS_PATTERNS: [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
    /onload=/i,
    /<iframe/i,
  ],

  // Security Headers for Next.js
  HEADERS: [
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    {
      key: "X-Frame-Options",
      value: "SAMEORIGIN", // Changed from DENY to allow Razorpay/Self frames if needed
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(self), interest-cohort=(), accelerometer=(self), gyroscope=(self), magnetometer=(self)",
    },
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com;",
        "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://*.supabase.co https://*.analytics.google.com https://api.cloudinary.com;",
        "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.youtube-nocookie.com https://www.google.com;",
        "img-src 'self' blob: data: https://res.cloudinary.com https://*.google-analytics.com;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
        "font-src 'self' https://fonts.gstatic.com;",
        "object-src 'none';",
        "base-uri 'self';",
        "frame-ancestors 'self';",
      ].join(" "),
    },
    {
      key: "X-XSS-Protection",
      value: "1; mode=block",
    },
  ] as { key: string; value: string }[],
} as const;

/**
 * Checks if a string contains any common XSS attack patterns.
 */
export function containsXssPattern(input: string): boolean {
  return SECURITY_CONFIG.XSS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Checks if a pathname is considered "sensitive" for auditing purposes.
 */
export function isSensitiveRoute(pathname: string): boolean {
  return SECURITY_CONFIG.SENSITIVE_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
}
