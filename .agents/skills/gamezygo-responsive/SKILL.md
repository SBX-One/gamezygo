# Gamezygo Responsive Conversion Skill

**Name:** `gamezygo-responsive`  
**Version:** 1.0.0  
**Description:** Convert desktop-first React/Next.js components into mobile-first responsive components following Gamezygo design standards  
**Author:** Gamezygo Frontend Team  
**Stack:** Next.js 16 + React 19 + Tailwind CSS v4 + TypeScript

---

## 🎯 Purpose

This skill transforms desktop UI components into production-ready mobile-first responsive components. It ensures consistency across all viewports while preserving the Gamezygo design system (glassmorphism, tokens, layout primitives).

---

## 📋 When to Use

Use this skill when:
- Converting a completed desktop component to responsive
- Refactoring existing desktop-first code to mobile-first
- Creating responsive variants of shared components
- Reviewing responsive implementation for compliance

**Do NOT use this skill for:**
- Initial component creation (use standard React/Next.js patterns)
- Admin dashboard pages (they have separate responsive rules)
- Static content pages (use standard Tailwind responsive utilities)

---

## 🚀 Quick Start

### Input Format
```tsx
// Desktop-first component (what you have)
<div className="flex gap-6">
  <aside className="w-72">Filters</aside>
  <main className="flex-1 grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </main>
</div>
```

### Output Format
```tsx
// Mobile-first responsive component (what you get)
<div className="flex flex-col gap-6 md:flex-row md:items-start">
  <aside className="w-full md:w-72 shrink-0">Filters</aside>
  <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </main>
</div>
```

---

## 📐 Core Rules

### 1. Mobile-First Conversion (MANDATORY)
- **Base classes (no prefix) = mobile layout** (375px - 639px)
- **Layer UP** with prefixes: `sm:` (640px+), `md:` (768px+), `lg:` (1024px+), `xl:` (1280px+)
- **NEVER** write `max-*` overrides
- **NEVER** write desktop-first (base = desktop)
- Desktop layout goes in `lg:` or `xl:` prefix, NOT base

**Why?** Mobile-first ensures optimal performance on mobile devices (smallest screen = base = no media query overhead).

### 2. Breakpoint Scale (Tailwind v4 Defaults)
| Prefix | Min Width | Target Device |
|--------|-----------|---------------|
| *(base)* | 0px | Small phones (iPhone SE, old Android) |
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets (portrait), small laptops |
| `lg` | 1024px | Laptops, admin dashboard default |
| `xl` | 1280px | Desktop monitors |
| `2xl` | 1536px | Large/ultrawide monitors |

**Gamezygo-specific guidance:**
- Storefront/catalog: design for `base`, `sm`, `md`, `lg`
- Checkout/library: design for `base` and `md` primarily (mobile-heavy traffic)
- Admin dashboard: design for `md` and up only (show "desktop recommended" on mobile)

### 3. Layout Stacking
- **Side-by-side on desktop → stacked on mobile:**
  ```tsx
  // ✅ Correct: flex-col base + md:flex-row
  <div className="flex flex-col gap-6 md:flex-row">
  
  // ❌ Wrong: hidden/block toggling
  <div className="hidden md:flex">...</div>
  <div className="flex md:hidden">...</div>
  ```

- **Grid on desktop → fewer columns on mobile:**
  ```tsx
  // ✅ Correct: progressive column count
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  
  // ❌ Wrong: same columns everywhere
  <div className="grid grid-cols-3">
  ```

### 4. Typography
- **Body text:** `text-base` (16px) minimum. NEVER below `text-sm` (14px) on mobile.
- **Headings scale up:** `text-2xl sm:text-3xl lg:text-4xl`
- **Long-form text:** constrain with `max-w-prose`
- **Hero headings:** use `text-balance` to avoid awkward line breaks

### 5. Touch Targets (CRITICAL for mobile)
- **All interactive elements** (buttons, links, inputs) below `md` breakpoint: **minimum `h-11` (44px)**
- Applies to: buttons, input fields, select dropdowns, clickable cards, nav items
- **Why?** Apple HIG and WCAG recommend 44px minimum for touch targets

```tsx
// ✅ Correct: touch-friendly on mobile
<button className="h-11 px-4 rounded-lg">Click me</button>

// ❌ Wrong: too small for mobile
<button className="h-8 px-3 rounded">Click me</button>
```

### 6. Forms & Inputs
- **Full-width on mobile:** `w-full`
- **Constrain on tablet+:** `max-w-sm` or `max-w-md` from `md:`
- **Multi-column forms:** `grid-cols-1 md:grid-cols-2`
- **Labels:** must have visible labels (no placeholder-only on mobile)

```tsx
// ✅ Correct: responsive form layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input name="firstName" label="First Name" className="w-full" />
  <Input name="lastName" label="Last Name" className="w-full" />
</div>
```

### 7. Glassmorphism (Dark Mode)
**Preserve these primitives exactly as provided:**
```css
backdrop-blur-md bg-white/5 border border-white/10 shadow-xl
```

**Mobile performance optimization:**
- On mobile (`base`/`sm`) for long scroll lists (catalog cards): may reduce to `backdrop-blur-sm` or `bg-neutral-900/80` fallback
- Desktop/tablet: keep full blur

**Why?** `backdrop-blur-md` is GPU-expensive on low-end Android devices.

### 8. Images & Media
- **ALWAYS** use `next/image` with explicit `sizes` attribute
- **Example:**
  ```tsx
  <Image
    src={product.thumbnail}
    alt={product.name}
    fill
    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
    className="object-cover"
  />
  ```
- **Object-fit:** `object-cover` for thumbnails, `object-contain` for icons

### 9. Spacing & Container
- **Use shared `Container` component:**
  ```tsx
  // src/components/layout/Container.tsx
  <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
  ```
- **Fluid spacing:** prefer `gap-3 sm:gap-4 lg:gap-6` over fixed pixel gaps
- **Page padding:** `px-4 sm:px-6 lg:px-8`

### 10. No Markup Duplication
- **ONE component file, ONE DOM tree**
- Responsive behavior via Tailwind prefix classes only
- **NEVER** create `ComponentMobile.tsx` + `ComponentDesktop.tsx` split

---

## ✅ Preservation Rules

When converting, **preserve these from the input:**
- ✅ All component props, interfaces, types
- ✅ State management hooks (useState, useEffect, etc.)
- ✅ Event handlers
- ✅ Business logic
- ✅ Import paths
- ✅ Glassmorphism styling (unless mobile perf optimization applies)

**Only CHANGE:**
- Tailwind class prefixes (add `sm:`, `md:`, `lg:`, etc.)
- Layout structure for mobile-first responsiveness

---

## 🔍 Verification Checklist

Before outputting, self-check every output against this list:

- [ ] Base classes = mobile layout (not desktop)
- [ ] No `max-*` classes used
- [ ] Single DOM tree (no hidden/block toggling)
- [ ] Interactive elements ≥ 44px on mobile (`h-11`)
- [ ] Body text ≥ 16px (`text-base`)
- [ ] Glassmorphism preserved (or optimized for mobile perf)
- [ ] Container pattern applied
- [ ] Images have `sizes` attribute
- [ ] No duplicate component files
- [ ] Touch targets are 44px minimum on mobile

**If any check fails, fix before outputting.**

---

## 📚 Reference Files

**MANDATORY:** Before starting conversion, read:
- **[`references/RESPONSIVE-STANDARDS.md`](./references/RESPONSIVE-STANDARDS.md)**

This file contains the authoritative Gamezygo design standards. If there's a conflict between this skill and `RESPONSIVE-STANDARDS.md`, **follow `RESPONSIVE-STANDARDS.md`**.

---

## ⚠️ Conflict Resolution

If this skill conflicts with [`references/RESPONSIVE-STANDARDS.md`](./references/RESPONSIVE-STANDARDS.md):
1. **Layout & Spacing:** follow RESPONSIVE-STANDARDS.md
2. **Breakpoint values:** follow RESPONSIVE-STANDARDS.md
3. **Glassmorphism:** follow RESPONSIVE-STANDARDS.md
4. **Touch target minimum:** follow RESPONSIVE-STANDARDS.md
5. **If still conflicting:** stop and coordinate with frontend team

---

## 📝 Examples

### Example 1: Sidebar Layout
**Input (Desktop-first):**
```tsx
<div className="flex gap-6">
  <aside className="w-72">Filters</aside>
  <main className="flex-1 grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </main>
</div>
```

**Output (Mobile-first):**
```tsx
<div className="flex flex-col gap-6 md:flex-row md:items-start">
  <aside className="w-full md:w-72 shrink-0">Filters</aside>
  <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </main>
</div>
```

### Example 2: Hero Section
**Input (Desktop-first):**
```tsx
<section className="py-20 px-8">
  <h1 className="text-5xl font-bold">Welcome</h1>
  <p className="text-xl mt-4">Discover amazing games</p>
  <button className="mt-8 px-8 py-3 bg-blue-600">Shop Now</button>
</section>
```

**Output (Mobile-first):**
```tsx
<section className="py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Welcome</h1>
  <p className="text-lg sm:text-xl mt-4">Discover amazing games</p>
  <button className="mt-8 px-6 py-3 h-11 bg-blue-600 rounded-lg">Shop Now</button>
</section>
```

### Example 3: Product Card with Glassmorphism
**Input (Desktop-first):**
```tsx
<div className="backdrop-blur-md bg-white/5 border border-white/10 shadow-xl p-6 rounded-xl">
  <Image src={product.image} alt={product.name} width={300} height={300} />
  <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
  <p className="text-gray-400 mt-2">${product.price}</p>
  <button className="mt-4 px-4 py-2 bg-white text-black rounded">Add to Cart</button>
</div>
```

**Output (Mobile-first):**
```tsx
<div className="backdrop-blur-sm sm:backdrop-blur-md bg-white/5 border border-white/10 shadow-xl p-4 sm:p-6 rounded-xl">
  <Image 
    src={product.image} 
    alt={product.name} 
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
    className="object-cover rounded-lg"
  />
  <h3 className="text-lg sm:text-xl font-semibold mt-4">{product.name}</h3>
  <p className="text-gray-400 mt-2">${product.price}</p>
  <button className="mt-4 px-4 py-2 h-11 bg-white text-black rounded-lg w-full sm:w-auto">Add to Cart</button>
</div>
```

---

## 🎓 Best Practices

1. **Test at all breakpoints:** 375px, 640px, 768px, 1024px, 1280px
2. **Prioritize mobile performance:** reduce blur/opacity on mobile if needed
3. **Use semantic HTML:** `<nav>`, `<main>`, `<aside>`, `<section>`
4. **Keep component logic separate from layout:** business logic in hooks, layout in JSX
5. **Document responsive decisions:** add comments for non-obvious breakpoint choices

---

## 🐛 Common Mistakes to Avoid

- ❌ Using `max-md:hidden` (desktop-first thinking)
- ❌ Creating separate mobile/desktop components
- ❌ Hardcoding pixel widths instead of using Tailwind spacing scale
- ❌ Forgetting touch targets (44px minimum)
- ❌ Using `hidden md:block` for responsive variants (use single DOM tree)
- ❌ Not testing on actual mobile devices (emulators can miss issues)

---

## 📞 Support

If you encounter issues or have questions:
1. Check `RESPONSIVE-STANDARDS.md` first
2. Review the examples in this skill
3. Consult with the frontend team lead

---

**Last Updated:** 2026-08-29  
**Maintained by:** Gamezygo Frontend Team
