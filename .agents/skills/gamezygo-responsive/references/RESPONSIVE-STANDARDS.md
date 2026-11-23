# Responsive Design Standards — Gamezygo Frontend

This document defines the responsive design rules for the Gamezygo frontend. It extends the existing **Next.js 16 & React 19 Coding Standards** and must be followed for every page, feature module, and shared component.

## Core Principles

- **Mobile-first**: write base (unprefixed) Tailwind classes for mobile, then layer up with `sm:`, `md:`, `lg:`, `xl:`, `2xl:` for larger viewports. Never write desktop-first with `max-*` overrides unless there is no alternative.
- **Fluid over fixed**: prefer relative units (`%`, `rem`, `fr`, `auto`, `min-content`, `max-content`) over hardcoded pixel widths/heights. Fixed `px` values are only acceptable for icons, borders, and very small UI details (≤ 24px).
- **Content-driven breakpoints**: don't just follow Tailwind's default breakpoints blindly — add a breakpoint only where the layout actually breaks, using arbitrary breakpoints (`min-[560px]:`) when the default scale doesn't fit.
- **Consistency with the Glassmorphism Dark Mode system**: responsive rules must not break the existing `backdrop-blur-md bg-white/5 border border-white/10 shadow-xl` primitives — blur/opacity/shadow values stay constant across breakpoints unless there's a performance reason (see §6).

---

## 1. Breakpoint Scale

Gamezygo uses Tailwind CSS v4's default breakpoint scale. Do not override `--breakpoint-*` tokens unless approved by the frontend lead.

| Alias | Min Width | Primary Target |
| :--- | :--- | :--- |
| *(base)* | `0px` | Small phones (iPhone SE, older Androids) |
| `sm` | `640px` | Large phones (landscape), small tablets |
| `md` | `768px` | Tablets (portrait), small laptops in split view |
| `lg` | `1024px` | Laptops, admin dashboard default target |
| `xl` | `1280px` | Desktop monitors |
| `2xl` | `1536px` | Large/ultrawide monitors |

**Rule of thumb for Gamezygo layouts:**
- Storefront / catalog grid → design for `base`, `sm`, `md`, `lg`.
- Checkout & library (vault) pages → design for `base` and `md` primarily (most Gamezygo checkout traffic is mobile).
- Admin dashboard & CMS pages → design for `md` and up only; `base`/`sm` may show a "desktop recommended" notice instead of a fully responsive layout (see §7).

---

## 2. Layout Primitives

### A. Container
Use a shared `Container` component (`src/components/layout/Container.tsx`) instead of repeating max-width classes across pages.

```tsx
// src/components/layout/Container.tsx
import { cn } from '@/lib/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export function Container({ className, ref, ...props }: ContainerProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    />
  );
}
```

### B. Grid System
Use CSS Grid (`grid grid-cols-*`) for catalog/product listings, and Flexbox for one-dimensional UI (navbars, form rows, cart line items).

```tsx
// Product/catalog grid — mobile-first
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### C. Stacking Direction
Any layout that changes from stacked (mobile) to side-by-side (desktop) must use `flex-col` → `md:flex-row`, never `hidden`/`block` toggling of duplicated markup.

```tsx
// Correct — one DOM tree, direction changes at md
<div className="flex flex-col gap-6 md:flex-row md:items-start">
  <aside className="w-full md:w-72 shrink-0">{/* filters */}</aside>
  <main className="flex-1">{/* product grid */}</main>
</div>
```

---

## 3. Typography

- Base font size stays `16px` (`text-base`) at all breakpoints — never scale down body text below `14px` (`text-sm`) on mobile for readability/accessibility.
- Headings scale with responsive utilities, not fixed `rem` overrides:

```tsx
<h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
  Gamezygo Store
</h1>
```

- Use `text-balance` (Tailwind v4 utility) on hero/marketing headings to avoid awkward line breaks on narrow viewports.
- Line length: constrain long-form text (blog, review, ToS pages) with `max-w-prose` regardless of breakpoint.

---

## 4. Navigation & Header

- **Mobile (`base`–`sm`)**: collapsed hamburger menu → slide-in drawer (Zustand-controlled `isMobileNavOpen` state, same pattern as the cart drawer). No dropdown mega-menus on mobile.
- **Tablet (`md`)**: condensed horizontal nav, icons-only for secondary actions (search, cart, profile).
- **Desktop (`lg`+)**: full horizontal nav with labels, mega-menu/dropdown for catalog categories allowed.
- The header height itself is fixed (`h-16`) across all breakpoints for layout stability; only inner content density changes.

---

## 5. Forms & Inputs (Checkout, Login, Admin CMS)

- Inputs and buttons must be full-width (`w-full`) on `base`/`sm`, constrained (`max-w-sm`, `max-w-md`) from `md` up.
- Minimum touch target: `h-11` (44px) on any interactive element rendered below `md`, per mobile accessibility guidance. This applies even inside `useActionState`-driven forms (§3D of the coding standard).
- Multi-column forms (e.g., billing address) stack to a single column below `md`:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  <Input name="firstName" label="First Name" />
  <Input name="lastName" label="Last Name" />
</div>
```

---

## 6. Images, Media & Performance

- Always use `next/image` with `sizes` explicitly set to match the responsive grid, so the browser doesn't over-fetch large images on mobile:

```tsx
<Image
  src={product.thumbnail}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
  className="object-cover"
/>
```

- Respect the Next.js 16 `minimumCacheTTL` (4 hours) default from the coding standard — don't override it per-image without cause.
- **Glassmorphism on mobile**: `backdrop-blur-md` is GPU-expensive on low-end Android devices. For components rendered in long scrollable lists (catalog cards), it's acceptable to drop to `backdrop-blur-sm` or a solid `bg-neutral-900/80` fallback below `sm` for performance — desktop/tablet keep the full blur.

---

## 7. Admin Dashboard Exception

The `admin/dashboard.tsx` and `admin/catalog.tsx` routes (data tables, financial charts) are **not required to be fully responsive down to mobile**. Standard:

- `base`/`sm` (< `md`): render a lightweight `<DesktopOnlyNotice />` component instead of squeezing data tables into a phone screen.
- `md` and up: fully responsive, with data tables switching to horizontal scroll (`overflow-x-auto`) rather than card-stacking below `lg`.

---

## 8. Testing & Verification

- Every new page/component must be visually checked at minimum: `375px` (small phone), `768px` (tablet), `1280px` (desktop).
- Playwright E2E tests (per the Gamezygo PRD stack) should include at least one responsive viewport assertion per critical flow (checkout, login, library/vault) using `page.setViewportSize()`.
- No horizontal scroll (`overflow-x: hidden` leakage) is allowed on any page at any breakpoint except intentional horizontal-scroll components (carousels, admin tables).

---

## 9. Naming & File Conventions (extends §2 of the coding standard)

| Item | Convention | Example |
| :--- | :--- | :--- |
| Responsive layout components | `PascalCase.tsx` in `src/components/layout/` | `Container.tsx`, `ResponsiveGrid.tsx` |
| Breakpoint-aware hooks | `use-kebab-case.ts` in `src/hooks/` | `use-breakpoint.ts`, `use-is-mobile.ts` |
| Viewport constants | `UPPER_SNAKE_CASE` in `src/constants/` | `BREAKPOINTS.MD = 768` |
