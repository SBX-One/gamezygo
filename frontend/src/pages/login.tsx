import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { Toast } from "@/components/ui/Toast";
import { useAuthStore } from "@/stores/use-auth-store";
import { cn } from "@/lib/utils";

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
 * Mail Icon (18px)
 */
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 6L12 13L2 6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Lock Icon (18px)
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
 * User Icon (18px)
 */
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
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
 * Animated SVG Spinner (no rounded-full)
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
  const updateUser = useAuthStore((s) => s.updateUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Active Tab: derived from router query param ?tab=signup
  const activeTab: "login" | "signup" = tab === "signup" ? "signup" : "login";

  const handleTabChange = (nextTab: "login" | "signup") => {
    router.replace(nextTab === "signup" ? "/login?tab=signup" : "/login", undefined, {
      shallow: true,
    });
  };

  // If already authenticated, redirect automatically
  React.useEffect(() => {
    if (isAuthenticated) {
      const destination = typeof redirect === "string" ? redirect : "/";
      router.push(destination);
    }
  }, [isAuthenticated, redirect, router]);

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

  // Form Fields - Login
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);

  // Form Fields - Register
  const [registerName, setRegisterName] = React.useState("");
  const [registerEmail, setRegisterEmail] = React.useState("");
  const [registerPassword, setRegisterPassword] = React.useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = React.useState("");
  const [showRegisterPassword, setShowRegisterPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  // Submitting States
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      showToast("Harap masukkan email atau username Anda.", "error");
      return;
    }
    if (!loginPassword) {
      showToast("Harap masukkan password akun Anda.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: loginEmail.trim() });
      showToast("Login berhasil! Mengalihkan ke Gamezygo...", "success");
      setTimeout(() => {
        const destination = typeof redirect === "string" ? redirect : "/";
        router.push(destination);
      }, 700);
    } catch {
      showToast("Gagal masuk. Periksa kembali email dan password Anda.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim()) {
      showToast("Harap masukkan nama lengkap Anda.", "error");
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes("@")) {
      showToast("Harap masukkan alamat email yang valid.", "error");
      return;
    }
    if (registerPassword.length < 6) {
      showToast("Password minimal 6 karakter.", "error");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      showToast("Konfirmasi password tidak cocok.", "error");
      return;
    }
    if (!agreeTerms) {
      showToast("Anda harus menyetujui Syarat & Ketentuan Gamezygo.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: registerEmail.trim() });
      updateUser({ name: registerName.trim(), email: registerEmail.trim() });
      showToast("Akun berhasil dibuat! Selamat datang di Gamezygo.", "success");
      setTimeout(() => {
        const destination = typeof redirect === "string" ? redirect : "/";
        router.push(destination);
      }, 700);
    } catch {
      showToast("Terjadi kesalahan saat mendaftar. Silakan coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth Action
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      // Simulate Google OAuth response
      await login({ email: "google.gamer@gamezygo.com" });
      updateUser({
        name: "Google Gamer",
        email: "google.gamer@gamezygo.com",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
      });
      showToast("Berhasil masuk dengan akun Google!", "success");
      setTimeout(() => {
        const destination = typeof redirect === "string" ? redirect : "/";
        router.push(destination);
      }, 700);
    } catch {
      showToast("Gagal menghubungkan ke Google OAuth.", "error");
    } finally {
      setIsSubmitting(false);
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

      <StoreLayout
        navbarVariant="guest"
        activeNavId=""
        hideSidebar={true}
        contentClassName="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex flex-col items-center justify-center min-h-[calc(100vh-180px)]"
      >
        {/* Toast Alert Notification */}
        {toast && (
          <div className="fixed top-24 right-4 sm:right-8 z-50  w-full animate-in fade-in slide-in-from-top-4 duration-200">
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

        {/* Main Authentication Card */}
        <div className="w-full max-w-2/7  mx-auto flex flex-col">
          {/* Outer Glass Card Panel (NO SHADOW, MAX ROUNDED-LG) */}
          <div className="w-full bg-deep-blue-900 border border-white/10 rounded-lg p-6 sm:p-8 flex flex-col gap-6 shadow-none">
            {/* Header: Logo & Branding */}
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
                    : "Daftar sekarang untuk ribuan game impian harga hemat."}
                </p>
              </div>
            </div>

            {/* Segmented Tab Switcher (Masuk / Daftar) */}
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

            {/* Google Social Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-body-sm font-semibold text-gray-200 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none shadow-none"
            >
              <GoogleIcon />
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold select-none">
                atau dengan email
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form Content: TAB LOGIN */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                {/* Email / Username Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="login-email"
                    className="text-body-xs font-medium text-gray-300 select-none"
                  >
                    Email atau Username
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      <MailIcon />
                    </div>
                    <input
                      id="login-email"
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nama@email.com"
                      autoComplete="username"
                      required
                      className="w-full min-h-11 bg-deep-blue-950 border border-white/10 rounded-lg pl-10.5 pr-4 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-rose-500/80 transition-colors shadow-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="text-body-xs font-medium text-gray-300 select-none"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => showToast("Fitur reset password dikirim ke email terdaftar.")}
                      className="text-[11px] font-medium text-rose-400 hover:text-rose-300 transition-colors cursor-pointer select-none"
                    >
                      Lupa password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      <LockIcon />
                    </div>
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full min-h-11 bg-deep-blue-950 border border-white/10 rounded-lg pl-10.5 pr-11 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-rose-500/80 transition-colors shadow-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                      aria-label={showLoginPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showLoginPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-white/20 bg-deep-blue-950 text-rose-500 accent-rose-500 cursor-pointer shadow-none"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-body-xs text-gray-400 select-none cursor-pointer"
                  >
                    Ingat saya di perangkat ini
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full min-h-11 mt-2 flex items-center justify-center gap-2 bg-linear-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-500 text-white font-semibold text-body-sm rounded-lg transition-all duration-150 cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-none"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <SpinnerIcon className="w-4 h-4 text-white" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Masuk ke Akun</span>
                  )}
                </button>
              </form>
            )}

            {/* Form Content: TAB DAFTAR (SIGN UP) */}
            {activeTab === "signup" && (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                {/* Full Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reg-name"
                    className="text-body-xs font-medium text-gray-300 select-none"
                  >
                    Nama Lengkap
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      <UserIcon />
                    </div>
                    <input
                      id="reg-name"
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="Contoh: Rendy Pratama"
                      autoComplete="name"
                      required
                      className="w-full min-h-11 bg-deep-blue-950 border border-white/10 rounded-lg pl-10.5 pr-4 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-rose-500/80 transition-colors shadow-none"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reg-email"
                    className="text-body-xs font-medium text-gray-300 select-none"
                  >
                    Alamat Email
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      <MailIcon />
                    </div>
                    <input
                      id="reg-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="nama@email.com"
                      autoComplete="email"
                      required
                      className="w-full min-h-11 bg-deep-blue-950 border border-white/10 rounded-lg pl-10.5 pr-4 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-rose-500/80 transition-colors shadow-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reg-pass"
                    className="text-body-xs font-medium text-gray-300 select-none"
                  >
                    Password Baru (Min. 6 Karakter)
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      <LockIcon />
                    </div>
                    <input
                      id="reg-pass"
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      className="w-full min-h-11 bg-deep-blue-950 border border-white/10 rounded-lg pl-10.5 pr-11 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-rose-500/80 transition-colors shadow-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                      aria-label={showRegisterPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showRegisterPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="reg-pass-confirm"
                    className="text-body-xs font-medium text-gray-300 select-none"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-gray-400">
                      <LockIcon />
                    </div>
                    <input
                      id="reg-pass-confirm"
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required
                      className="w-full min-h-11 bg-deep-blue-950 border border-white/10 rounded-lg pl-4 pr-4 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-rose-500/80 transition-colors shadow-none"
                    />
                  </div>
                </div>

                {/* Agree Terms Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="w-4 h-4 mt-0.5 rounded-sm border-white/20 bg-deep-blue-950 text-rose-500 accent-rose-500 cursor-pointer shrink-0 shadow-none"
                  />
                  <label
                    htmlFor="agree-terms"
                    className="text-body-xs text-gray-400 leading-snug select-none cursor-pointer"
                  >
                    Saya menyetujui{" "}
                    <button
                      type="button"
                      onClick={() => showToast("Syarat & Ketentuan Layanan Gamezygo")}
                      className="text-rose-400 hover:underline inline cursor-pointer"
                    >
                      Syarat & Ketentuan
                    </button>{" "}
                    serta{" "}
                    <button
                      type="button"
                      onClick={() => showToast("Kebijakan Privasi Pengguna Gamezygo")}
                      className="text-rose-400 hover:underline inline cursor-pointer"
                    >
                      Kebijakan Privasi
                    </button>
                    .
                  </label>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full min-h-11 mt-2 flex items-center justify-center gap-2 bg-linear-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-500 text-white font-semibold text-body-sm rounded-lg transition-all duration-150 cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-none"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <SpinnerIcon className="w-4 h-4 text-white" />
                      <span>Mendaftarkan...</span>
                    </>
                  ) : (
                    <span>Buat Akun Gamezygo</span>
                  )}
                </button>
              </form>
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
                      Daftar sekarang
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
