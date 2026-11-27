import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { Toast } from "@/components/ui";
import { useAuthStore } from "@/stores/use-auth-store";

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const SpinnerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function AdminLoginPage() {
  const router = useRouter();
  const { redirect } = router.query;
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [adminUsername, setAdminUsername] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showAdminPassword, setShowAdminPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState<{
    message: string;
    variant: "success" | "error" | "default";
  } | null>(null);

  const showToast = (
    message: string,
    variant: "success" | "error" | "default" = "default"
  ) => {
    setToast({ message, variant });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  React.useEffect(() => {
    if (isAuthenticated && !isSubmitting && (role === "admin" || user?.role === "admin")) {
      const target =
        typeof redirect === "string" && redirect.startsWith("/admin")
          ? redirect
          : "/admin/dashboard";
      router.replace(target);
    }
  }, [isAuthenticated, isSubmitting, role, user, redirect, router]);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

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

    const normalizedEmail = cleanUsername.includes("@")
      ? cleanUsername
      : `${cleanUsername}@gamezygo.com`;

    setIsSubmitting(true);
    try {
      await login({
        email: normalizedEmail,
        password: cleanPassword,
        isAdmin: true,
      });

      showToast("Login Admin berhasil! Mengalihkan ke Dashboard...", "success");
      const target =
        typeof redirect === "string" && redirect.startsWith("/admin")
          ? redirect
          : "/admin/dashboard";
      setTimeout(() => {
        router.replace(target);
      }, 450);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal masuk sebagai admin. Periksa kembali username dan password Anda.";
      showToast(msg, "error");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login — Gamezygo</title>
        <meta
          name="description"
          content="Portal autentikasi khusus Administrator Gamezygo."
        />
      </Head>

      <StoreLayout
        navbarVariant="guest"
        activeNavId=""
        hideSidebar={true}
        contentClassName="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-160px)]"
      >
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

        <div className="w-115 max-w-[92vw] sm:w-120 md:w-125 mx-auto flex flex-col">
          <div className="w-full bg-deep-blue-900 border border-white/10 rounded-xl p-6 sm:p-8 md:p-9 flex flex-col gap-6 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col items-center text-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-90 cursor-pointer"
              >
                <span className="text-h6 font-black tracking-wider text-gray-50 uppercase">
                  GAMEZYGO ADMIN
                </span>
              </Link>
              <div className="flex flex-col gap-1">
                <h1 className="text-h5 sm:text-h4 font-bold text-gray-50 tracking-tight">
                  Login Administrator
                </h1>
                <p className="text-body-xs sm:text-body-sm text-gray-400">
                  Portal khusus staf & administrator internal Gamezygo.
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="admin-username"
                  className="text-body-xs font-medium text-gray-300 select-none flex items-center justify-between"
                >
                  <span>Username / Email Admin</span>
                  <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">
                    Internal Staf
                  </span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-gray-400">
                    <UserBadgeIcon />
                  </div>
                  <input
                    id="admin-username"
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin@gamezygo.com"
                    autoComplete="username"
                    required
                    disabled={isSubmitting}
                    className="w-full min-h-11 bg-deep-blue-950 border border-white/10 rounded-lg pl-10.5 pr-4 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-rose-500/80 transition-colors shadow-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="text-body-xs font-medium text-gray-300 select-none"
                  >
                    Password Admin
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        "Untuk reset password akun administrator, hubungi Superadmin atau DevOps Gamezygo.",
                        "default"
                      )
                    }
                    className="text-[11px] font-medium text-rose-400 hover:text-rose-300 transition-colors cursor-pointer select-none"
                  >
                    Bantuan Akses?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-gray-400">
                    <LockIcon />
                  </div>
                  <input
                    id="admin-password"
                    type={showAdminPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                    className="w-full min-h-11 bg-deep-blue-950 border border-white/10 rounded-lg pl-10.5 pr-11 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-rose-500/80 transition-colors shadow-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                    aria-label={
                      showAdminPassword ? "Sembunyikan password" : "Tampilkan password"
                    }
                  >
                    {showAdminPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-0.5">
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
                  Ingat sesi admin di perangkat ini
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full min-h-11 mt-1 flex items-center justify-center gap-2 bg-linear-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-500 text-white font-semibold text-body-sm rounded-lg transition-all duration-150 cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none shadow-none"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <SpinnerIcon className="w-4 h-4 text-white" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <span>Masuk sebagai Administrator</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </StoreLayout>
    </>
  );
}
