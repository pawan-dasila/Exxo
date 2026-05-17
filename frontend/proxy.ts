import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SECURITY_CONFIG,
  containsXssPattern,
  isSensitiveRoute,
} from "./lib/security-config";
import { checkRateLimit } from "./lib/rate-limit";

// ── IP Extraction Helper ──────────────────────────────────────────────────────
function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}

const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export default async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const ip = getIp(request);

  // 1. Sanitize Query Parameters (XSS Protection)
  let hasUnsafeParams = false;
  searchParams.forEach((value) => {
    if (containsXssPattern(value)) {
      hasUnsafeParams = true;
    }
  });

  if (hasUnsafeParams || containsXssPattern(pathname)) {
    console.warn(
      `[Security] Blocked malicious attempt on ${pathname} from IP: ${ip}`,
    );
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.search = ""; // Strip all parameters
    return NextResponse.redirect(cleanUrl);
  }

  // 2. Audit Sensitive Routes
  if (isSensitiveRoute(pathname)) {
    const ua = request.headers.get("user-agent") ?? "unknown";
    console.info(
      `[Audit] Sensitive route access: ${pathname} | IP: ${ip} | UA: ${ua}`,
    );
  }

  // 3. Rate Limiting for Auth Routes (Frontend Level)
  if (
    authRoutes.some((route) => pathname.startsWith(route)) &&
    request.method !== "GET"
  ) {
    const result = await checkRateLimit(
      `auth:${ip}`,
      SECURITY_CONFIG.RATE_LIMITING.AUTH_ROUTES,
    );
    if (!result.success) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  // 4. Route Protection
  const hasSession = request.cookies.get("has_session");
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authRoutes.some((route) => pathname.startsWith(route)) && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
