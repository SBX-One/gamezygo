# Next.js 16 & React 19 Coding Standards — Gamezygo Frontend

This document defines the architecture, design principles, and coding standards for the frontend of the Gamezygo platform.

## Core Stack Assumptions

- **Framework**: Next.js 16 (Pages Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4 (configured via PostCSS / `@import "tailwindcss"` in `globals.css`)
- **State Management**: Zustand (strictly client-only UI/session state)
- **Data Fetching & Cache**: TanStack Query (React Query)
- **API Client**: Axios / Fetch with interceptors
- **Form Validation**: Zod + React Hook Form (or React 19 Action States)

> [!WARNING]
> **No Local Database or Auth.js Clients**
> Gamezygo uses a decoupled frontend/backend architecture. Do NOT install or write database connection clients (like Prisma or Drizzle) or server-only auth libraries (like Auth.js / NextAuth.js) in the frontend workspace. All authentication, data persistence, and sessions are authorized and managed solely by the decoupled Laravel REST API backend (`http://localhost:8000/api/v1`).

---

## 1. Directory Structure (Pages Router + Features Architecture)

The frontend project utilizes the **Next.js Pages Router** coupled with a domain-driven **Features Architecture**.
The `src/pages/` folder is reserved strictly for route definitions and layout compositions. All business logic, UI components, hooks, types, and api services must be organized into cohesive feature modules in `src/features/`.

```text
src/
├── pages/                      # Routing (Pages Router) — strictly for page/layout composition
│   ├── _app.tsx                # App wrapper, global styles, providers
│   ├── _document.tsx           # Document markup customization
│   ├── index.tsx               # Landing Storefront
│   ├── login.tsx               # Login page (Google OAuth Integration)
│   ├── checkout.tsx            # Checkout & Midtrans Snap trigger page
│   ├── library.tsx             # Private customer game credentials vault
│   └── admin/
│       ├── dashboard.tsx       # Admin financial reporting dashboard
│       └── catalog.tsx         # Admin games & credentials catalog CMS
│
├── features/                   # Domain-based modules (loose coupling, highly cohesive)
│   ├── auth/                   # Auth components, Zustand state, login actions
│   ├── catalog/                # Product grids, search, admin catalog tables
│   ├── checkout/               # Cart drawer, checkout validation, Midtrans Snap script loads
│   └── library/                # Private vault, credentials cards, decrypt components
│       ├── components/         # Feature-specific components
│       ├── hooks/              # Feature-specific hooks (React Query)
│       ├── services/           # Feature-specific API clients
│       ├── store/              # Feature-specific Zustand store (if any)
│       ├── types.ts            # Type definitions for the feature
│       └── utils.ts            # Pure helper functions for the feature
│
├── components/                 # Shared / Reusable components (non-feature specific)
│   ├── ui/                     # Primitive design tokens (Buttons, Inputs, Modals, Cards)
│   ├── layout/                 # Global UI structure (Header, Footer, Sidebar, Navigation)
│   └── shared/                 # Cross-feature combined components
│
├── lib/                        # Third-party configurations & clients (axios, queryClient, etc.)
├── hooks/                      # Global reusable React hooks (e.g., useDebounce, useWindowSize)
├── store/                      # Global Zustand stores (e.g., useAppStore, useCartStore)
├── services/                   # Global API services & clients
├── types/                      # Global TypeScript definitions
├── constants/                  # Global configuration parameters & endpoints
└── utils/                      # Global pure utility helpers (e.g., formatCurrency, class merger)
```

---

## 2. File & Folder Naming Conventions

| File/Folder Type | Convention | Example |
| :--- | :--- | :--- |
| **Feature Folders** | `kebab-case` | `src/features/user-management/` |
| **Component Files** | `PascalCase.tsx` | `UserCard.tsx`, `LoginForm.tsx` |
| **Hook Files** | `use-kebab-case.ts` | `use-auth.ts`, `use-fetch-users.ts` |
| **Utility/Helper Files** | `kebab-case.ts` | `format-currency.ts` |
| **Store (Zustand)** | `use-[name]-store.ts` | `use-cart-store.ts` |
| **Type Files** | `kebab-case.ts` / `types.ts` | `user.types.ts`, `types.ts` |
| **Constant Files** | `kebab-case.ts` | `api-endpoints.ts` |
| **Pages Files (Routing)** | Next.js Page defaults | `index.tsx`, `login.tsx`, `admin/dashboard.tsx` |
| **Test Files** | `[name].test.ts` / `.spec.ts` | `UserCard.test.tsx` |

### Internal Code Conventions

- **React Components**: `PascalCase` (e.g., `export function UserCard() {}`).
- **Standard Functions & Hooks**: `camelCase` (e.g., `function formatDate() {}`, `useAuth()`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `const MAX_RETRY_COUNT = 3`).
- **Interfaces & Types**: `PascalCase` (e.g., `interface UserResponse`). Do not use `I` or `T` prefixes.
- **Booleans**: Prefixed with `is`, `has`, or `should` (e.g., `isLoading`, `hasError`, `shouldRedirect`).

---

## 3. React 19 Standards & Best Practices

With **React 19**, several legacy patterns are deprecated. Follow these rules strictly:

### A. Ref as a Prop (No `forwardRef`)
You no longer need to wrap components with `forwardRef` to pass refs down. In React 19, `ref` can be passed as a normal prop.

```tsx
// Correct (React 19)
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function CustomInput({ label, ref, ...props }: CustomInputProps) {
  return (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  );
}
```

### B. Direct Context Components (No `<Context.Provider>`)
Use `<MyContext>` directly as the provider instead of `<MyContext.Provider>`.

```tsx
import { createContext } from 'react';

export const ThemeContext = createContext<'light' | 'dark'>('dark');

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Correct (React 19)
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
```

### C. Reading Promises & Context with `use()`
You can use the new `use` API to read promises or context dynamically inside loops, conditional statements, or anywhere in the render path.

```tsx
import { use } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeDisplay() {
  // Reads context dynamically using the use() hook
  const theme = use(ThemeContext);
  return <div>Current theme: {theme}</div>;
}
```

### D. Form Actions, `useActionState`, and `useFormStatus`
React 19 introduces form Actions to handle pending states, errors, and sequential updates out of the box.
- `useActionState` replaces the deprecated `useFormState`.
- `useFormStatus` enables nested child components to read parent form submitting states.

```tsx
import { useActionState } from 'react';

async function updateProfile(prevState: any, formData: FormData) {
  try {
    const response = await fetch('/api/profile', { method: 'POST', body: formData });
    return await response.json();
  } catch (error) {
    return { error: 'Failed to update profile' };
  }
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction}>
      <input type="text" name="name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Profile'}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
```

---

## 4. Next.js 16 Standards & Specific Features

### A. Stable Turbopack by Default
Next.js 16 uses **Turbopack** by default for both development and build steps.
- Do not run commands using the `--turbopack` or `--turbo` flags.
- Any webpack-specific plugins or loaders must either be migrated to Turbopack configuration or run explicitly using `next build --webpack` if absolutely necessary (discouraged).
- Turbopack configurations belong in the top-level `turbopack` key inside `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Turbopack aliases
    },
  },
};

export default nextConfig;
```

### B. Middleware Renamed to Proxy
In Next.js 16, the `middleware.ts` filename and export have been deprecated and renamed to `proxy.ts`.
- Rename your route interceptor file to `proxy.ts`.
- Rename the exported function to `proxy(request: Request)`.
- The `edge` runtime is NOT supported in proxy.ts; it runs under the standard `nodejs` runtime. If you must use the Edge runtime, stick to the legacy `middleware.ts` filename.

```ts
// src/proxy.ts
import { NextResponse } from 'next/server';
import type { Request } from 'next/server';

export function proxy(request: Request) {
  // Proxy intercepts, rewrites, and headers configuration
  return NextResponse.next();
}
```

### C. Stable React Compiler
Next.js 16 native React Compiler support is stable. It automatically memoizes components, eliminating manual `useMemo` and `useCallback` boilerplate.
- Enable it via `reactCompiler: true` in your config.
- Ensure `babel-plugin-react-compiler` is installed as a devDependency.

```ts
// next.config.ts
const nextConfig = {
  reactCompiler: true,
};
export default nextConfig;
```

### D. Next/Image Cache & Pattern Enhancements
- **Local Images with Query Strings**: Requires explicit pattern validation configuration in `next.config.ts` to prevent enumeration attacks.
- **Cache TTL**: Default cache validation lifetime `minimumCacheTTL` is now **4 hours** (previously 60s) to minimize revalidation performance costs.
- **Image Sizes**: Width `16` is removed from the default `imageSizes` arrays to optimize layout outputs.

---

## 5. Components & Modular Styling Standards

1. **Named Exports Only**: Always export components using named exports (`export function Component()`) for tooling safety. Never use default exports except for page components in the `src/pages/` folder.
2. **Glassmorphism Dark Mode Styling (Tailwind CSS v4)**:
   - Use dynamic combinations via the `cn(...)` utility (combining `clsx` and `tailwind-merge`).
   - Standard Glassmorphic Class Structure:
     `backdrop-blur-md bg-white/5 border border-white/10 shadow-xl`
   - Primary accents: Indigo (`text-indigo-400`, `bg-indigo-600`) and Violet gradients (`bg-gradient-to-r from-violet-500 to-rose-500`).

---

## 6. Decoupled Data & API Layer

- **REST Client**: Use TanStack Query (React Query) for handling fetches, caching, mutations, and query validations. Do not write manual `useEffect` handlers for CRUD logic.
- **Zustand State**: Limit Zustand strictly to global UI states (e.g., active cart drawer, user authentication tokens, theme toggles). Do not cache database items inside Zustand.
- **Authorization Flow**:
  - Store JWT bearer tokens securely (either inside Zustand memory or cookies).
  - Append bearer tokens to every query client header: `Authorization: Bearer <token>`.
  - All communication is routed to the Laravel REST API backend at `http://localhost:8000/api/v1`.