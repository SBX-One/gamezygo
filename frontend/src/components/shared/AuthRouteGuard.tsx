import * as React from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/use-auth-store";
import { isUserProtectedRoute } from "@/constants/routes";

export interface AuthRouteGuardProps {
  children: React.ReactNode;
}

/**
 * AuthRouteGuard
 * Intercepts unauthorized direct access to private user dashboard routes.
 *
 * - Allows public & shared routes (/store, /leaderboard, /review, /blogs, etc.) to load freely without delay.
 * - Protects exclusive user routes (/bundle, /library, /history, /wishlist, /request, /profile, /credentials/*).
 * - Redirects guests to /login?redirect=<target_path>.
 * - Hydration-safe: prevents premature false-redirects during client state rehydration.
 */
export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Monitor Zustand persistence hydration
  React.useEffect(() => {
    // If persist already finished hydration
    if (useAuthStore.persist?.hasHydrated?.()) {
      setIsHydrated(true);
    }

    // Subscribe to finish hydration event
    const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
      setIsHydrated(true);
    });

    // Fallback in case persist.hasHydrated() is synchronous or already settled
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 50);

    return () => {
      unsub?.();
      clearTimeout(timer);
    };
  }, []);

  const isProtected =
    isUserProtectedRoute(router.pathname) || isUserProtectedRoute(router.asPath);

  // Perform redirect when state is fully hydrated and user is unauthenticated
  React.useEffect(() => {
    if (isHydrated && isProtected && !isAuthenticated) {
      const destination = router.asPath || router.pathname;
      router.replace(`/login?redirect=${encodeURIComponent(destination)}`);
    }
  }, [isHydrated, isProtected, isAuthenticated, router]);

  // 1. If not a protected route, render immediately (zero delay for public/shared routes)
  if (!isProtected) {
    return <>{children}</>;
  }

  // 2. If it is a protected route but state hasn't hydrated or user is not logged in:
  // Render a clean glassmorphic loading screen to prevent private content flash (FOUC)
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-deep-blue-950 text-gray-100 select-none">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border border-gradient-secondary backdrop-blur-md shadow-2xl animate-fade-in">
          {/* Animated Spinner with brand gradient styling */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-rose-500/20" />
            <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-rose-500 border-r-rose-400 animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-body-sm font-semibold text-gray-200">
              Memeriksa Akses Akun...
            </p>
            <p className="text-body-xs text-gray-400">
              Mengarahkan Anda ke halaman masuk
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is authenticated and permitted: render page
  return <>{children}</>;
}
