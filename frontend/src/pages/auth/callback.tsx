import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/use-auth-store";
import { fetchUserProfile } from "@/services/profile.service";
import { useCartStore } from "@/stores/use-cart-store";
import { addToCart } from "@/services/cart.service";
import type { User } from "@/types";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = React.useState("Memverifikasi Akun Google...");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!router.isReady) return;

    const { token, error } = router.query;

    const processLogin = async () => {
      if (error) {
        setErrorMessage(
          typeof error === "string" ? error : "Terjadi kesalahan saat autentikasi Google."
        );
        setTimeout(() => {
          router.replace("/login");
        }, 2500);
        return;
      }

      if (typeof token !== "string" || !token) {
        setErrorMessage("Token autentikasi tidak ditemukan.");
        setTimeout(() => {
          router.replace("/login");
        }, 2500);
        return;
      }

      try {
        setStatusMessage("Menghubungkan profil pengguna...");

        // Set token in Zustand store so subsequent requests attach it
        useAuthStore.getState().setToken(token);

        // Fetch user profile from backend using the token
        const profileRes = await fetchUserProfile();
        const profileData = profileRes?.data;

        const mappedUser: User = {
          id: String(profileData?.id || Date.now()),
          name: profileData?.name || "Pengguna Google",
          email: profileData?.email || "",
          role: profileData?.role === "admin" ? "admin" : "customer",
          avatarUrl:
            profileData?.avatar_url ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
        };

        const mappedRole: "guest" | "user" | "admin" =
          mappedUser.role === "admin" ? "admin" : "user";

        useAuthStore.setState({
          user: mappedUser,
          token,
          role: mappedRole,
          isAuthenticated: true,
          isLoading: false,
        });

        // Sync guest cart items to backend if any
        const guestCartItems = useCartStore.getState().cartItems;
        if (guestCartItems && guestCartItems.length > 0) {
          for (const item of guestCartItems) {
            const numId = Number(item.productId);
            if (!isNaN(numId) && numId > 0) {
              try {
                await addToCart(numId);
              } catch {
                // ignore duplicate error
              }
            }
          }
        }

        setStatusMessage(
          mappedRole === "admin"
            ? "Login Admin berhasil! Mengalihkan ke Dashboard..."
            : "Login berhasil! Mengalihkan ke halaman utama..."
        );
        setTimeout(() => {
          if (mappedRole === "admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/");
          }
        }, 600);
      } catch (err) {
        console.error("Auth callback error:", err);
        setErrorMessage("Gagal memuat profil pengguna dari Google.");
        setTimeout(() => {
          router.replace("/login");
        }, 2500);
      }
    };

    processLogin();
  }, [router, router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>Autentikasi Google - Gamezygo</title>
      </Head>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-deep-blue-950 text-gray-100 select-none p-4">
        <div className="w-105 max-w-[95vw] flex flex-col items-center gap-5 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl animate-fade-in text-center">
          {errorMessage ? (
            <>
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-body-md font-semibold text-rose-400">Autentikasi Gagal</p>
                <p className="text-body-xs text-gray-400">{errorMessage}</p>
                <p className="text-body-xs text-gray-500 mt-2">Mengarahkan kembali ke halaman masuk...</p>
              </div>
            </>
          ) : (
            <>
              {/* Spinner */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-rose-500/20" />
                <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-rose-500 border-r-rose-400 animate-spin" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-body-md font-semibold text-gray-100">{statusMessage}</p>
                <p className="text-body-xs text-gray-400">Mohon tunggu sebentar, sedang menyiapkan akun Anda.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

