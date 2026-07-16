# Code standar next js

# Standar Struktur & Konvensi Next.js — Enterprise Project

Stack asumsi: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Zustand, Auth.js, Prisma/Drizzle.

---

## 1. Struktur Folder (Root Level)

```
src/
├── app/                        # Routing (App Router) — HANYA untuk routing & page composition
│   ├── (auth)/                 # Route group: auth pages (login, register)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/             # Route group: halaman setelah login
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                     # Route handlers (kalau tidak pakai backend terpisah)
│   │   └── users/
│   │       └── route.ts
│   ├── layout.tsx               # Root layout
│   ├── globals.css
│   └── not-found.tsx
│
├── features/                    # Domain/feature-based modules (INTI dari project besar)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/             # API calls khusus fitur ini
│   │   ├── store/                 # Zustand store khusus fitur ini
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── user-management/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── types.ts
│   └── billing/
│       └── ...
│
├── components/                  # Shared/reusable components (BUKAN spesifik 1 fitur)
│   ├── ui/                       # Primitives: Button, Input, Modal, dll (mirip shadcn)
│   ├── layout/                   # Navbar, Sidebar, Footer
│   └── shared/                   # Komponen gabungan yang dipakai lintas fitur
│
├── lib/                         # Konfigurasi & helper pihak ketiga
│   ├── auth.ts                   # Konfigurasi Auth.js
│   ├── db.ts                     # Prisma/Drizzle client
│   ├── redis.ts
│   └── axios.ts / fetcher.ts
│
├── hooks/                       # Custom hooks yang GLOBAL (bukan punya 1 fitur)
│   └── use-debounce.ts
│
├── store/                       # Zustand store GLOBAL (misal: auth session, theme)
│   └── use-app-store.ts
│
├── services/                    # API layer global (kalau tidak feature-based)
│   └── api-client.ts
│
├── types/                       # Global TypeScript types & interfaces
│   ├── index.ts
│   └── api.ts
│
├── constants/                   # Konstanta global (routes, roles, config)
│   └── routes.ts
│
├── utils/                       # Pure functions, tidak bergantung pada React
│   ├── format-date.ts
│   └── cn.ts                     # classnames merge helper
│
├── styles/                      # Kalau butuh CSS tambahan di luar Tailwind
│
└── middleware.ts                # Next.js middleware (auth guard, redirect, dll)
```

> **Kenapa `features/`?**
Di project besar, folder berbasis tipe file (`components/`, `hooks/`, `services/` semua digabung jadi satu untuk seluruh app) cepat jadi berantakan. Feature-based folder membuat setiap domain (auth, billing, dsb) self-contained — gampang di-onboarding-kan ke developer baru, gampang dihapus/dipisah jadi module lain.
> 

---

## 2. Konvensi Penamaan File & Folder

| Jenis | Konvensi | Contoh |
| --- | --- | --- |
| Folder | `kebab-case` | `user-management/`, `auth-forms/` |
| Component file | `PascalCase.tsx` | `UserCard.tsx`, `LoginForm.tsx` |
| Hook file | `use-kebab-case.ts` | `use-auth.ts`, `use-fetch-users.ts` |
| Utility/helper | `kebab-case.ts` | `format-currency.ts` |
| Store (Zustand) | `use-[nama]-store.ts` | `use-cart-store.ts` |
| Type/interface file | `kebab-case.ts` atau `types.ts` | `user.types.ts` |
| Constant file | `kebab-case.ts` | `api-endpoints.ts` |
| Route folder (App Router) | `kebab-case` | `app/user-profile/page.tsx` |
| Test file | `[nama].test.ts` / `.spec.ts` | `UserCard.test.tsx` |
| API route handler | selalu `route.ts` | `app/api/users/route.ts` |
| Page file | selalu `page.tsx` | wajib sesuai konvensi Next.js |

**Penamaan internal kode:**

- Komponen React → `PascalCase` (`function UserCard() {}`)
- Function biasa/hook → `camelCase` (`function formatDate() {}`, `useAuth()`)
- Konstanta → `UPPER_SNAKE_CASE` (`const MAX_RETRY_COUNT = 3`)
- Interface/Type → `PascalCase`, prefix opsional `T` atau `I` **tidak wajib** tapi harus konsisten satu tim (contoh: `UserResponse`, bukan `IUserResponse` kalau tim sepakat tanpa prefix)
- Boolean variable/props → prefix `is/has/should` (`isLoading`, `hasError`, `shouldRedirect`)

---

## 3. Aturan Component

```tsx
// components/ui/Button.tsx
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button className={cn("rounded-md px-4 py-2", variantStyles[variant], className)} {...props} />
  );
}
```

**Aturan:**

1. Satu komponen = satu file. Kalau komponen besar, boleh dipecah jadi sub-folder dengan `index.tsx` sebagai entry.
2. Gunakan **named export**, hindari default export untuk component (memudahkan auto-import & refactor konsisten). Default export hanya untuk `page.tsx`, `layout.tsx` (wajib dari Next.js).
3. Props interface diberi nama `[ComponentName]Props`.
4. Pisahkan **Server Component** (default) dan **Client Component** (`"use client"`) — jangan taruh `"use client"` di komponen besar kalau cuma butuh interaktivitas kecil; pecah jadi child component.

---

## 4. Aturan Import (Path Alias)

Set di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Urutan import (disarankan pakai `eslint-plugin-import` + `simple-import-sort`):

```tsx
// 1. External packages
import { useState } from "react";
import { z } from "zod";

// 2. Internal absolute (alias)
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/use-auth-store";

// 3. Relative import (dalam fitur yang sama)
import { LoginSchema } from "./login.schema";

// 4. Types
import type { User } from "@/types";
```

---

## 5. Layer Data & API

```
features/user-management/
├── services/
│   └── user.service.ts     # Fungsi fetch/mutate: getUsers(), createUser()
├── hooks/
│   └── use-users.ts        # React Query hook: useUsers()
└── types.ts                 # User, CreateUserPayload, dll
```

- Gunakan **TanStack Query (React Query)** untuk data fetching + caching, bukan `useEffect` manual.
- Zustand khusus untuk **client state** (UI state, auth session, cart), bukan untuk server data.
- Validasi input pakai **Zod**, schema disimpan sefile dengan form terkait (`login.schema.ts`).

---

## 6. Environment & Config

```
.env.local          # Local development (gitignored)
.env.example         # Template — WAJIB di-commit
```

Semua akses env HARUS lewat satu file validator, contoh `lib/env.ts` (pakai Zod), supaya error env langsung ketahuan saat build, bukan runtime.

---

## 7. Testing

```
src/
├── features/
│   └── auth/
│       └── __tests__/
│           └── login-form.test.tsx
```

Atau co-located: `LoginForm.tsx` + `LoginForm.test.tsx` di folder yang sama — pilih salah satu, konsisten se-tim.

---

## 8. Tooling Wajib untuk Tim Besar

| Tool | Fungsi |
| --- | --- |
| ESLint + `@typescript-eslint` | Lint konsistensi kode |
| Prettier | Format otomatis |
| Husky + lint-staged | Pre-commit hook (lint & format sebelum commit) |
| Commitlint (Conventional Commits) | `feat:`, `fix:`, `chore:`, dll |
| Turborepo (opsional) | Kalau project jadi monorepo (web + admin + api) |

Contoh commit message:

```
feat(user-management): add bulk delete user
fix(auth): resolve session expiry redirect loop
```

---

## 9. Prinsip Umum

1. **Colocation over centralization** — taruh file dekat dengan tempat dipakai (feature folder), bukan semua digeneralisir di root.
2. **Barrel export** (`index.ts`) di tiap feature folder untuk expose API publik fitur tersebut, sembunyikan detail internal.
3. Jangan biarkan `app/` folder berisi logic bisnis — `app/` cuma untuk routing & compose komponen dari `features/`.
4. Satu fitur idealnya bisa dihapus tanpa merusak fitur lain (loose coupling).