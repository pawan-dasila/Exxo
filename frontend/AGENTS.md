<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

### ⚠️ IMPORTANT: NEXT.JS VERSION

This project uses **Next.js 16.2+** (App Router).
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

### Architecture & Code Quality

- Use the **App Router** exclusively — no Pages Router.
- Colocate components, hooks, and utils close to where they are used.
- Follow clean architecture: separate concerns (UI, data fetching, business logic).
- Keep components small, focused, and reusable.
- Use **Server Components** by default; add `'use client'` only when necessary (interactivity, browser APIs, hooks).
- Use **TypeScript strictly** — no `any`. Replace existing `any` types with proper types immediately.
- Use `zod` for runtime validation of forms, API inputs, and environment variables.
- **Always follow the skills and patterns defined in the `.agents/skills` directory.**
- Use **Prisma** for database operations — keep Prisma logic in the backend or server-side services.
- Always use **shadcn/ui** components instead of making custom components.
- Use `next/image` for all images, preferably hosted on **Cloudinary**.
- Use `next/link` for all internal navigation.
- Use `next/font` to load fonts — never `@import` from Google Fonts in CSS.
- Use `next/dynamic` for heavy client-side components.
- Use **React Server Actions** or **Route Handlers** for mutations.
- Prefer `loading.tsx` and `error.tsx` co-located with routes for graceful UX.
- Use `Suspense` boundaries strategically around async data fetches.
- Whenever you make changes in the DB, ensure Prisma schema is updated and client is regenerated.

### SEO

- Every route must export a `generateMetadata()` function or a static `metadata` object.
- Include: `title`, `description`, `openGraph`, `twitter`, `canonical`, `robots`, `keywords`.
- Product pages must have dynamic OG images using `next/og` (ImageResponse).
- Use structured data (`JSON-LD`) for: `Product`, `BreadcrumbList`, `Organization`, `WebSite`.
- Sitemap: generate `/sitemap.xml` dynamically using `app/sitemap.ts`.
- Robots: maintain `app/robots.ts` to control crawler access.
- All URLs must be canonical, lowercase, and hyphenated (no underscores).
- `<title>` tags must be unique per page and under 60 characters.
- Meta descriptions must be under 160 characters and contain target keywords.
- Image `alt` text must be descriptive and keyword-aware.

```ts
// Example metadata for a product page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} — Luxe Rental`,
    description: product.seoDescription,
    openGraph: {
      title: product.name,
      description: product.seoDescription,
      images: [{ url: product.ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    alternates: {
      canonical: `https://luxerental.com/products/${params.slug}`,
    },
  };
}
```

### Accessibility (a11y)

- All interactive elements must be keyboard-navigable and have visible focus rings.
- Use semantic HTML: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`, `<aside>`.
- Never use a `<div>` or `<span>` as a button — use `<button>` or `<a>` with proper roles.
- All images require meaningful `alt` text. Decorative images use `alt=""`.
- Color contrast must meet **WCAG AA** minimum (4.5:1 for text, 3:1 for UI components).
- Form inputs must have associated `<label>` elements (not just placeholder text).
- Use `aria-label`, `aria-describedby`, `aria-live`, and `role` attributes where semantic HTML is insufficient.
- Modal/drawer components must trap focus and restore focus on close.
- Provide `aria-current="page"` on active nav links.
- Use `prefers-reduced-motion` media query to disable or reduce animations.
- Ensure all toast/notification messages are announced via `aria-live="polite"`.

### UI & Design

- Design philosophy: **minimal, premium, editorial**. Luxe Rental standard.
- Use a consistent spacing scale — stick to Tailwind's default spacing.
- Typography: **Newsreader** for headings, **Inter** for body text.
- Brand palette must be defined in `tailwind.config.ts` and used exclusively.
- All transitions must feel intentional: use Framer Motion or Tailwind transitions.
- Respect `prefers-reduced-motion` — wrap animations conditionally.
- Loading states must always be handled — use Skeleton loaders.
- Error states must be user-friendly — never show raw error messages.

### Mobile-First Design

- Write all styles mobile-first, then use `sm:`, `md:`, `lg:` breakpoints.
- Minimum touch target size: **44×44px** for all interactive elements.
- No horizontal overflow on any screen size.
- Use `svh`/`dvh` for full-screen mobile layouts (not `vh`).
- Navigation on mobile should use a drawer or bottom-sheet pattern.

### Performance

- Use `next/image` with proper `width`, `height`, `sizes`, and `priority` on LCP elements.
- Keep **Largest Contentful Paint (LCP) < 2.5s** and **Cumulative Layout Shift (CLS) < 0.1**.
- Use **TanStack Query** for client-side data fetching, caching, and deduplication.
- Use the `logger` utility in `src/lib/utils.ts` instead of `console.log`.
- Use `<Suspense>` with skeleton loaders — never block the entire page for data.
- Route handlers and Server Actions must be idempotent and include proper error handling.

### Security

- Validate and sanitize all user inputs using **Zod**.
- Use HTTP-only cookies for sensitive session data.
- Set proper security headers in `next.config.ts`.
- Use the `security-config.ts` utility for sensitive client-side operations.
- Never hardcode API keys or secrets in the source code.

### Testing & Quality

- Run `next build` and fix all TypeScript and ESLint errors before marking work complete.
- Run Lighthouse on key pages — aim for 90+ on Performance, Accessibility, SEO.

---

## ❌ DON'Ts

### Code

- ❌ Never use `any` type — ever.
- ❌ Never use the Pages Router (`pages/` directory).
- ❌ Never use `useEffect` for data fetching — use Server Components or TanStack Query.
- ❌ Never use `<img>` — always `next/image`.
- ❌ Never use `<a>` for internal links — always `next/link`.
- ❌ Never commit `.env` files or hardcoded secrets.
- ❌ Never use `console.log` in production code — use the `logger` from `@/lib/utils`.
- ❌ Never use `// @ts-ignore` — fix the type error properly.

### Database

- ❌ Never run Prisma migrations on Production without explicit approval.
- ❌ Never drop or truncate tables without confirming the environment.

### UI & Design

- ❌ Never use raw hex colors inline — use Tailwind config tokens only.
- ❌ Never show raw error messages or stack traces to users.
- ❌ Never use `vh` for full-height mobile layouts — use `dvh`.
- ❌ Never skip focus styles — visibility of focus is mandatory.

---

## 🧩 Component Checklist

- [ ] TypeScript types are complete — no `any`
- [ ] Mobile layout tested at 320px and 390px
- [ ] Keyboard navigable with visible focus ring
- [ ] Loading, empty, and error states handled
- [ ] `alt` text on all images
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No hardcoded colors — Tailwind tokens only
- [ ] Component is reusable and not tightly coupled

---

## 🚀 Pre-Deploy Checklist

- [ ] `next build` passes with zero errors
- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings reviewed
- [ ] Lighthouse score: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90
- [ ] `generateMetadata` present on all routes
- [ ] OG images verified
- [ ] Sitemap and robots.txt returning correct data
- [ ] No `.env` values hardcoded
- [ ] No `console.log` in production code

---

## 📎 Conventions Quick Reference

| Topic            | Convention                                        |
| ---------------- | ------------------------------------------------- |
| Component naming | PascalCase (`ProductCard.tsx`)                    |
| File naming      | kebab-case for routes (`product-detail/page.tsx`) |
| Hook naming      | `use` prefix (`useCart.ts`)                       |
| Constants        | UPPER_SNAKE_CASE (`MAX_CART_ITEMS`)               |
| Types/Interfaces | PascalCase (`Product`, `CartItem`)                |
| CSS classes      | Tailwind only — no custom CSS unless unavoidable  |
| Env vars         | `NEXT_PUBLIC_` prefix for client-safe vars only   |
