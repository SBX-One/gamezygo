import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { Toast } from "@/components/ui/Toast";
import { useAuthStore } from "@/stores/use-auth-store";
import { addToCart } from "@/services/cart.service";
import { useCartStore } from "@/stores/use-cart-store";
import { cn } from "@/lib/utils";

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  expires_in?: number;
  token_type?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void | Promise<void>;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

/**
 * Gamezygo Brand Emblem SVG
 */
const GamezygoEmblem = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="45"
    height="24"
    viewBox="0 0 45 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <path
      d="M0 24L17.7974 0H45L40.8762 4.18018H21.1978L8.46463 20.9009H16.3505L24.8875 12.6126L16.3505 14.7027L20.1849 9.22523H35.0161L22.4277 24H0Z"
      fill="url(#login-brand-gradient)"
    />
    <path
      d="M27.492 19.6757L24.0916 24H29.5177L33.4244 19.6757H27.492Z"
      fill="url(#login-brand-gradient)"
    />
    <defs>
      <linearGradient
        id="login-brand-gradient"
        x1="0"
        y1="0"
        x2="45"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Official Google Multi-Color G Icon SVG
 */
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 shrink-0"
    {...props}
  >
    <path
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
      fill="#34A853"
    />
    <path
      d="M5.28 14.27A7.195 7.195 0 0 1 4.9 12c0-.79.14-1.56.38-2.27V6.58H1.24A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.24 5.42l4.04-3.15z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      fill="#EA4335"
    />
  </svg>
);

/**
 * Lock Icon
 */
const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4.5 h-4.5 text-gray-400 shrink-0"
    {...props}
  >
    <rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Shield Check Icon (Security Indicator)
 */
const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-emerald-400 shrink-0"
    {...props}
  >
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * User Badge Icon
 */
const UserBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4.5 h-4.5 text-gray-400 shrink-0"
    {...props}
  >
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
    <path
      d="M17 11l2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Key Icon (Admin Key)
 */
const KeyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 text-rose-400 shrink-0"
    {...props}
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12.5 12.5L21 21M17 17l2 2M15 19l2 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Alert Triangle Icon (Lockout Notice)
 */
const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-amber-400 shrink-0"
    {...props}
  >
    <path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

/**
 * Eye Icon (Show Password)
 */
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4.5 h-4.5 text-gray-400 hover:text-gray-200 transition-colors shrink-0"
    {...props}
  >
    <path
      d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

/**
 * Eye Off Icon (Hide Password)
 */
const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4.5 h-4.5 text-gray-400 hover:text-gray-200 transition-colors shrink-0"
    {...props}
  >
    <path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A18.45 18.45 0 0 1 5.06 6.06M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A18.5 18.5 0 0 1 19.78 16.5M1 1L23 23"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.88 9.88A3 3 0 1 0 14.12 14.12"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Animated SVG Spinner
 */
const SpinnerIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("animate-spin shrink-0", className)}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      className="opacity-25"
    />
    <path
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      fill="currentColor"
      className="opacity-75"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { tab, redirect } = router.query;

  // Global Auth Store
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Active Tab: derived from router query param ?tab=signup
  const activeTab: "login" | "signup" = tab === "signup" ? "signup" : "login";

  const handleTabChange = (nextTab: "login" | "signup") => {
    router.replace(nextTab === "signup" ? "/login?tab=signup" : "/login", undefined, {
      shallow: true,
    });
  };

  // Submitting State
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // If already authenticated, redirect automatically
  React.useEffect(() => {
    if (isAuthenticated && !isSubmitting) {
      if (role === "admin" || user?.role === "admin") {
        const destination =
          typeof redirect === "string" && redirect.startsWith("/admin")
            ? redirect
            : "/admin/dashboard";
        router.replace(destination);
      } else {
        const destination =
          typeof redirect === "string" && !redirect.startsWith("/admin")
            ? redirect
            : "/";
        router.replace(destination);
      }
    }
  }, [isAuthenticated, isSubmitting, role, user, redirect, router]);

  // Toast Notification State
  const [toast, setToast] = React.useState<{
    message: string;
    variant: "success" | "error" | "default";
  } | null>(null);

  const showToast = (message: string, variant: "success" | "error" | "default" = "default") => {
    setToast({ message, variant });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Admin Form Fields
  const [adminUsername, setAdminUsername] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showAdminPassword, setShowAdminPassword] = React.useState(false);

  // Security: Brute-Force & DDoS Mitigation (Failed Attempts + Lockout Timer)
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [lockoutSeconds, setLockoutSeconds] = React.useState<number>(0);

  // Sync lockout state from session storage on mount
  React.useEffect(() => {
    try {
      const storedLockout = sessionStorage.getItem("gamezygo_auth_lockout_until");
      if (storedLockout) {
        const remaining = Math.ceil((Number(storedLockout) - Date.now()) / 1000);
        if (remaining > 0) {
          setTimeout(() => setLockoutSeconds(remaining), 0);
          return;
        }
        sessionStorage.removeItem("gamezygo_auth_lockout_until");
      }
    } catch {
      // ignore storage error
    }
  }, []);

  // Countdown timer for lockout
  React.useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("gamezygo_auth_lockout_until");
          }
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const recordFailedAttempt = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    if (nextAttempts >= 5) {
      const lockDuration = 60; // 60 seconds lockout
      setLockoutSeconds(lockDuration);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "gamezygo_auth_lockout_until",
          String(Date.now() + lockDuration * 1000)
        );
      }
      showToast(
        "Terlalu banyak percobaan gagal. Akses dibatasi selama 60 detik demi keamanan sistem.",
        "error"
      );
    }
  };

  // Handle Admin Login Submit (Strictly for Administrator Authentication)
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutSeconds > 0) {
      showToast(
        `Akses login terkunci. Silakan tunggu ${lockoutSeconds} detik sebelum mencoba lagi.`,
        "error"
      );
      return;
    }

    if (isSubmitting) return;

    // Sanitize input
    const cleanUsername = adminUsername.trim().replace(/[<>]/g, "").slice(0, 100);
    const cleanPassword = adminPassword.slice(0, 100);

    if (!cleanUsername) {
      showToast("Harap masukkan username atau email admin.", "error");
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      showToast("Password admin minimal 4 karakter.", "error");
      return;
    }

    // Auto-normalize admin email format if user only enters username (e.g. 'admin' -> 'admin@gamezygo.com')
    const finalEmail = cleanUsername.includes("@")
      ? cleanUsername
      : `${cleanUsername}@gamezygo.com`;

    setIsSubmitting(true);
    try {
      await login({
        email: finalEmail,
        password: cleanPassword,
        isAdmin: true,
      });

      // Reset lockout state on success
      setFailedAttempts(0);
      setLockoutSeconds(0);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("gamezygo_auth_lockout_until");
      }

      showToast("Login Admin berhasil! Mengalihkan ke Dashboard...", "success");

      // Verifikasi Admin: Arahkan LANGSUNG ke Admin Dashboard
      // Jangan pernah kembalikan admin ke tempat terakhir saat menjadi guest
      const destination =
        typeof redirect === "string" && redirect.startsWith("/admin")
          ? redirect
          : "/admin/dashboard";

      router.replace(destination);
    } catch (err) {
      recordFailedAttempt();
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Gagal masuk sebagai admin. Periksa kembali username dan password Anda.";
      showToast(errorMsg, "error");
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth Action (Client-side GSI Popup -> POST /api/v1/auth/google-login)
  const handleGoogleLogin = async () => {
    if (lockoutSeconds > 0) {
      showToast(
        `Akses dibatasi sementara. Silakan tunggu ${lockoutSeconds} detik.`,
        "error"
      );
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    const googleClientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "984193698369-bhb0q6iqd67g4glt9ek2dmk4c8bvchb2.apps.googleusercontent.com";

    const triggerGoogleTokenClient = () => {
      try {
        if (!window.google?.accounts?.oauth2) {
          throw new Error("Google SDK belum siap. Silakan muat ulang halaman.");
        }

        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: "email profile openid",
          callback: async (response: GoogleTokenResponse) => {
            if (response.error) {
              setIsSubmitting(false);
              showToast("Autentikasi Google dibatalkan atau gagal.", "error");
              return;
            }

            if (response.access_token) {
              try {
                await loginWithGoogle(response.access_token);

                // Sync guest cart items to backend if any
                const guestCartItems = useCartStore.getState().cartItems;
                if (guestCartItems && guestCartItems.length > 0) {
                  for (const item of guestCartItems) {
                    const numId = Number(item.productId);
                    if (!isNaN(numId) && numId > 0) {
                      try {
                        await addToCart(numId);
                      } catch {
                        // ignore duplicate
                      }
                    }
                  }
                }

                showToast(
                  activeTab === "signup"
                    ? "Pendaftaran berhasil! Selamat datang di Gamezygo."
                    : "Login berhasil! Mengalihkan ke Gamezygo...",
                  "success"
                );

                const currentRole = useAuthStore.getState().role;
                const currentUser = useAuthStore.getState().user;
                const isAdmin = currentRole === "admin" || currentUser?.role === "admin";

                const destination = isAdmin
                  ? typeof redirect === "string" && redirect.startsWith("/admin")
                    ? redirect
                    : "/admin/dashboard"
                  : typeof redirect === "string" && !redirect.startsWith("/admin")
                  ? redirect
                  : "/";

                router.replace(destination);
              } catch (err) {
                const msg =
                  err instanceof Error
                    ? err.message
                    : "Gagal memproses autentikasi Google.";
                showToast(msg, "error");
                setIsSubmitting(false);
              }
            }
          },
        });

        client.requestAccessToken();
      } catch (err) {
        setIsSubmitting(false);
        const msg =
          err instanceof Error ? err.message : "Gagal memuat Google Sign-In.";
        showToast(msg, "error");
      }
    };

    if (window.google?.accounts?.oauth2) {
      triggerGoogleTokenClient();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        triggerGoogleTokenClient();
      };
      script.onerror = () => {
        setIsSubmitting(false);
        showToast("Gagal memuat script Google OAuth. Periksa koneksi internet.", "error");
      };
      document.body.appendChild(script);
    }
  };

  return (
    <>
      <Head>
        <title>
          {activeTab === "login"
            ? "Masuk ke Akun — Gamezygo"
            : "Daftar Akun Baru — Gamezygo"}
        </title>
        <meta
          name="description"
          content="Masuk atau buat akun baru di Gamezygo untuk mengakses koleksi ribuan game original dengan harga terjangkau dan pengiriman instan."
        />
      </Head>
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />

      <StoreLayout
        navbarVariant="guest"
        activeNavId=""
        hideSidebar={true}
        contentClassName="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-160px)]"
      >
        {/* Toast Alert Notification */}
        {toast && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant={toast.variant}
              title={
                toast.variant === "success"
                  ? "Berhasil"
                  : toast.variant === "error"
                  ? "Peringatan"
                  : "Informasi"
              }
              description={toast.message}
              onClose={() => setToast(null)}
              className="rounded-lg shadow-none"
            />
          </div>
        )}

        {/* ===================================================================
            MAIN AUTHENTICATION CARD
            Canonical spacing classes for Mobile & Tablet
            =================================================================== */}
        <div className="w-115 max-w-[92vw] sm:w-120 md:w-125 mx-auto flex flex-col">
          <div className="w-full bg-deep-blue-900 border border-white/10 rounded-xl p-6 sm:p-8 md:p-9 flex flex-col gap-6 shadow-2xl backdrop-blur-md">
            
            {/* 1. Header: Logo & Branding */}
            <div className="flex flex-col items-center text-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer"
              >
                <GamezygoEmblem className="w-11 h-6" />
                <span className="text-h6 font-black tracking-wider text-gray-50 uppercase">
                  GAMEZYGO
                </span>
              </Link>
              <div className="flex flex-col gap-1">
                <h1 className="text-h5 sm:text-h4 font-bold text-gray-50 tracking-tight">
                  {activeTab === "login" ? "Selamat Datang Kembali" : "Mulai Petualangan Game"}
                </h1>
                <p className="text-body-xs sm:text-body-sm text-gray-400">
                  {activeTab === "login"
                    ? "Akses vault dan koleksi game original Anda."
                    : "Pendaftaran instan eksklusif dengan Google Auth."}
                </p>
              </div>
            </div>

            {/* 2. Segmented Tab Switcher (Masuk / Daftar) */}
            <div className="grid grid-cols-2 p-1 bg-deep-blue-950 border border-white/10 rounded-lg shadow-none">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={cn(
                  "py-2.5 text-body-sm font-semibold rounded-md transition-colors duration-150 cursor-pointer text-center select-none shadow-none",
                  activeTab === "login"
                    ? "bg-white/10 text-white border border-white/15"
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("signup")}
                className={cn(
                  "py-2.5 text-body-sm font-semibold rounded-md transition-colors duration-150 cursor-pointer text-center select-none shadow-none",
                  activeTab === "signup"
                    ? "bg-white/10 text-white border border-white/15"
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                Daftar
              </button>
            </div>

            {/* Lockout Banner (if rate limited / locked out) */}
            {lockoutSeconds > 0 && (
              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <AlertTriangleIcon className="shrink-0" />
                <div className="text-body-xs">
                  <p className="font-semibold">Keamanan: Akses Dibatasi Sementara</p>
                  <p className="text-amber-300/80">
                    Terlalu banyak percobaan gagal. Silakan tunggu{" "}
                    <span className="font-mono font-bold text-white">{lockoutSeconds}</span> detik.
                  </p>
                </div>
              </div>
            )}

            {/* ===============================================================
                TAB 1: MASUK (LOGIN)
                - Pelanggan / Gamers: Google Auth
                - Admin / Staf Gamezygo: Username & Password
                =============================================================== */}
            {activeTab === "login" && (
              <div className="flex flex-col gap-6">
                
                {/* Section A: Customer Google Login */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 select-none">
                    Pelanggan & Gamers
                  </span>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting || isLoading || lockoutSeconds > 0}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-body-sm font-semibold text-gray-100 transition-all duration-150 cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-none"
                  >
                    <GoogleIcon />
                    <span>Lanjutkan dengan Google</span>
                  </button>
                  <p className="text-[11px] text-gray-400 text-center">
                    Masuk instan untuk mengakses perpustakaan & riwayat pesanan game Anda.
                  </p>
                </div>
              </div>
            )}

            {/* ===============================================================
                TAB 2: DAFTAR (SIGN UP)
                - Eksklusif Google Auth (Tidak ada form manual)
                - Keamanan & Perlindungan Anti-Bot / Anti-Spam
                =============================================================== */}
            {activeTab === "signup" && (
              <div className="flex flex-col gap-6">
                
                {/* Primary Google Registration Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting || isLoading || lockoutSeconds > 0}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-body-sm font-bold text-white transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-98 shadow-lg"
                >
                  <GoogleIcon />
                  <span>Daftar dengan Google</span>
                </button>

                {/* Benefits / Security Highlights */}
                <div className="flex flex-col gap-3 p-4 rounded-lg bg-deep-blue-950/70 border border-white/5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                    Kenapa Menggunakan Google Auth?
                  </span>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheckIcon className="mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-body-xs font-semibold text-gray-200">
                        Aktivasi Akun Otomatis
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Langsung aktif seketika tanpa perlu verifikasi email manual.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheckIcon className="mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-body-xs font-semibold text-gray-200">
                        Keamanan & Perlindungan Terenkripsi
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Dilindungi protokol Google OAuth 2.0 dan vault kredensial game AES-256.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheckIcon className="mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-body-xs font-semibold text-gray-200">
                        Akses Instan Game Library
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Riwayat pembelian dan kredensial game langsung terikat ke akun Google Anda.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Note regarding DDoS & Bot Prevention */}
                <div className="text-center px-1">
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Gamezygo menerapkan registrasi berbasis Google OAuth untuk memverifikasi keaslian pengguna, mencegah pembuatan akun massal (bot/DDoS), serta menjamin integritas transaksi game.
                  </p>
                </div>

                {/* Terms of Service notice */}
                <div className="text-center pt-1 border-t border-white/5">
                  <p className="text-[11px] text-gray-400 select-none">
                    Dengan mendaftar, Anda menyetujui{" "}
                    <button
                      type="button"
                      onClick={() => showToast("Syarat & Ketentuan Layanan Gamezygo")}
                      className="text-rose-400 hover:underline inline cursor-pointer font-medium"
                    >
                      Syarat & Ketentuan
                    </button>{" "}
                    dan{" "}
                    <button
                      type="button"
                      onClick={() => showToast("Kebijakan Privasi Pengguna Gamezygo")}
                      className="text-rose-400 hover:underline inline cursor-pointer font-medium"
                    >
                      Kebijakan Privasi
                    </button>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Footer Switcher */}
            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-body-xs text-gray-400 select-none">
                {activeTab === "login" ? (
                  <>
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("signup")}
                      className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer select-none"
                    >
                      Daftar dengan Google
                    </button>
                  </>
                ) : (
                  <>
                    Sudah memiliki akun?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange("login")}
                      className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer select-none"
                    >
                      Masuk di sini
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}
