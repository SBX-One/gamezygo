import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { Button, EmptyState, ListRowSkeleton, Toast, Item } from "@/components/ui";
import { useCart, useRemoveFromCart, useClearCart } from "@/hooks/use-cart";
import { useUserLibrary } from "@/hooks/use-library";
import { isPubliclyVisibleProduct } from "@/services/products.service";
import { formatRupiah, formatDiscount } from "@/utils/formatters";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCartStore } from "@/stores/use-cart-store";

/**
 * Arrow Right Icon for Checkout button
 */
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


/**
 * Cart Outline Icon for Empty State
 */
const CartOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-7 h-7 shrink-0 text-white"
    {...props}
  >
    <path
      d="M3 3H5L6.68 14.39C6.77144 15.0134 7.08779 15.5768 7.56846 15.9723C8.04912 16.3678 8.66127 16.5687 9.28 16.53H18.4C19.0187 16.5687 19.6309 16.3678 20.1115 15.9723C20.5922 15.5768 20.9086 15.0134 21 14.39L22 7H6M10 21C10.5523 21 11 20.5523 11 20C11 19.4477 10.5523 19 10 19C9.44772 19 9 19.4477 9 20C9 20.5523 9.44772 21 10 21ZM19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20C18 20.5523 18.4477 21 19 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface CartItemData {
  id: string;
  title: string;
  imageSrc: string;
  discount: string;
  originalPrice: number;
  originalPriceFormatted: string;
  price: number;
}

const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

export default function CartPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Zustand Store Cart
  const storeCartItems = useCartStore((s) => s.cartItems);
  const removeItemFromStore = useCartStore((s) => s.removeItem);
  const clearCartStore = useCartStore((s) => s.clearCart);
  const clearOrderDetails = useCartStore((s) => s.clearOrderDetails);

  // Server-side Cart API Hook
  const { data: cartApiRes, isLoading: isCartApiLoading } = useCart();
  const removeCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  // Fetch user's library games to identify and filter out games the user already owns
  const { data: libraryRes } = useUserLibrary(undefined, { enabled: isAuthenticated });

  const ownedGameIds = React.useMemo(() => {
    const set = new Set<string>();
    const items = libraryRes?.data;
    if (Array.isArray(items)) {
      items.forEach((p) => {
        if (p.id) set.add(String(p.id));
        if (p.slug) set.add(String(p.slug).toLowerCase().trim());
        if (p.name) set.add(String(p.name).toLowerCase().trim());
      });
    }
    return set;
  }, [libraryRes]);

  const isCartItemAvailable = React.useCallback((item: unknown): boolean => {
    if (!isPubliclyVisibleProduct(item)) return false;
    const raw = item as { is_available?: boolean; available?: boolean };
    if (raw.is_available === false || raw.available === false) return false;
    return true;
  }, []);

  // Computed Cart Items (prioritizes API when authenticated, else local Zustand store)
  const cartItems: CartItemData[] = React.useMemo(() => {
    if (isAuthenticated) {
      if (cartApiRes?.data?.items) {
        return cartApiRes.data.items
          .filter((item) => {
            // Never show games that are archived/de-listed/unavailable (BUG-014)
            if (!isCartItemAvailable(item)) return false;
            // Never show games that the user already owns!
            const idMatch = ownedGameIds.has(String(item.id));
            const nameMatch = ownedGameIds.has(item.name.toLowerCase().trim());
            return !idMatch && !nameMatch;
          })
          .map((item) => ({
            id: String(item.id),
            title: item.name,
            imageSrc: item.thumbnail || "",
            discount: formatDiscount(item.discount),
            originalPrice: item.price,
            originalPriceFormatted: formatRupiah(item.price),
            price: item.discount_price > 0 ? item.discount_price : item.price,
          }));
      }
      // While API is loading for authenticated user, do NOT flash stale local storage items
      if (isCartApiLoading) {
        return [];
      }
      return [];
    }
    return storeCartItems
      .filter((item) => {
        if (item.product && !isCartItemAvailable(item.product)) return false;
        const idMatch = ownedGameIds.has(String(item.productId));
        const nameMatch = ownedGameIds.has((item.product?.title || "").toLowerCase().trim());
        return !idMatch && !nameMatch;
      })
      .map((item) => ({
        id: String(item.productId),
        title: item.product?.title || "Game",
        imageSrc: item.product?.imageSrc || item.product?.cover_image_url || "",
        discount: item.product?.discount || "",
        originalPrice: item.product?.originalPrice || item.product?.price || 0,
        originalPriceFormatted: formatRupiah(item.product?.originalPrice || item.product?.price || 0),
        price: item.product?.price || 0,
      }));
  }, [isAuthenticated, cartApiRes, isCartApiLoading, storeCartItems, ownedGameIds, isCartItemAvailable]);

  // Auto-prune de-listed, archived, or unavailable items from cart & notify user (BUG-014)
  const notifiedUnavailableRef = React.useRef<Set<string>>(new Set());
  React.useEffect(() => {
    if (!isAuthenticated || !cartApiRes?.data?.items) return;

    const unavailableItems = cartApiRes.data.items.filter(
      (item) => !isCartItemAvailable(item)
    );

    if (unavailableItems.length > 0) {
      const newlyDetected = unavailableItems.filter(
        (item) => !notifiedUnavailableRef.current.has(String(item.id))
      );
      unavailableItems.forEach((item) => {
        notifiedUnavailableRef.current.add(String(item.id));
        removeItemFromStore(String(item.id));
        removeCartMutation.mutate(item.id);
      });
      if (newlyDetected.length > 0) {
        const names = newlyDetected.map((i) => `"${i.name}"`).join(", ");
        setToastMessage({
          type: "error",
          title: "Produk Tidak Tersedia",
          description: `${names} sedang di-delist atau diarsipkan dan telah dihapus dari keranjang Anda.`,
        });
      }
    }
  }, [isAuthenticated, cartApiRes?.data?.items, isCartItemAvailable, removeCartMutation, removeItemFromStore]);

  // Auto-cleanup: If backend cart database returns items that the user already owns in Library,
  // silently delete them from the database so cart in DB stays clean!
  React.useEffect(() => {
    if (!isAuthenticated || !cartApiRes?.data?.items || ownedGameIds.size === 0) return;

    const ownedInCart = cartApiRes.data.items.filter((item) => {
      const idMatch = ownedGameIds.has(String(item.id));
      const nameMatch = ownedGameIds.has(item.name.toLowerCase().trim());
      return idMatch || nameMatch;
    });

    if (ownedInCart.length > 0) {
      ownedInCart.forEach((item) => {
        removeCartMutation.mutate(item.id);
      });
    }
  }, [isAuthenticated, cartApiRes?.data?.items, ownedGameIds, removeCartMutation]);

  // Also clean up local store if any owned items are in it
  React.useEffect(() => {
    if (storeCartItems.length > 0 && ownedGameIds.size > 0) {
      storeCartItems.forEach((item) => {
        const idMatch = ownedGameIds.has(String(item.productId));
        const nameMatch = ownedGameIds.has((item.product?.title || "").toLowerCase().trim());
        if (idMatch || nameMatch) {
          removeItemFromStore(item.productId);
        }
      });
    }
  }, [storeCartItems, ownedGameIds, removeItemFromStore]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = React.useState<{
    type: "success" | "error";
    title: string;
    description: string;
  } | null>(null);

  const showToast = (type: "success" | "error", title: string, description: string) => {
    setToastMessage({ type, title, description });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const totalBelanja = subtotal;

  // Remove individual item
  const handleRemoveItem = (id: string, title: string) => {
    removeItemFromStore(id);
    if (isAuthenticated && cartApiRes?.data) {
      removeCartMutation.mutate(id, {
        onSuccess: () => {
          showToast("error", "Item Dihapus", `${title} berhasil dihapus dari keranjang.`);
        },
        onError: () => {
          showToast("error", "Gagal Menghapus", `Gagal menghapus ${title} dari keranjang.`);
        },
      });
    } else {
      showToast("error", "Item Dihapus", `${title} berhasil dihapus dari keranjang.`);
    }
  };

  // Clear all items (switches to Empty State)
  const handleClearAll = () => {
    clearCartStore();
    clearOrderDetails();
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("gamezygo_checkout_items");
      }
    } catch {
      // ignore storage error
    }
    if (isAuthenticated && cartApiRes?.data) {
      clearCartMutation.mutate();
    }
    showToast("error", "Keranjang Dikosongkan", "Semua item di keranjang telah dihapus.");
  };

  // Buy Now on Single Item
  const handleBuyNow = (item: CartItemData) => {
    clearOrderDetails();
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("gamezygo_checkout_items", JSON.stringify([item]));
      }
    } catch {
      // ignore storage error
    }

    if (!isAuthenticated) {
      showToast("error", "Login Diperlukan", "Silakan login terlebih dahulu untuk melanjutkan checkout.");
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent("/checkout?mode=direct")}`);
      }, 500);
      return;
    }

    showToast("success", "Membeli Sekarang", `Melanjutkan pembelian langsung untuk ${item.title}...`);
    setTimeout(() => {
      router.push("/checkout?mode=direct");
    }, 400);
  };

  // Proceed to Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast("error", "Keranjang Kosong", "Tambahkan game ke keranjang terlebih dahulu.");
      return;
    }
    clearOrderDetails();
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("gamezygo_checkout_items");
      }
    } catch {
      // ignore storage error
    }

    if (!isAuthenticated) {
      showToast("error", "Login Diperlukan", "Silakan login terlebih dahulu untuk melanjutkan checkout.");
      setTimeout(() => {
        router.push("/login?redirect=/checkout");
      }, 500);
      return;
    }

    showToast("success", "Menuju Pembayaran", "Mengarahkan ke halaman checkout...");
    setTimeout(() => {
      router.push("/checkout");
    }, 400);
  };

  const isEmpty = cartItems.length === 0;

  return (
    <>
      <Head>
        <title>Keranjang Belanja - Gamezygo</title>
        <meta
          name="description"
          content="Lihat dan kelola game favorit yang ada di keranjang belanjamu di Gamezygo."
        />
      </Head>

      <StoreLayout
        hideNavbar={true}
        hideSidebar={true}
        contentClassName="w-full mx-auto px-4 sm:px-8 lg:px-20 flex flex-col"
      >
        {/* ========================================================
            1. PAGE TITLE & FULL-WIDTH DIVIDER (With Back Button)
           ======================================================== */}
        <div className="w-full border-b-gradient-secondary py-10 pb-4 mb-10 sm:mb-20 flex items-center justify-between">
          <div className="w-full mx-auto px-4 sm:px-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-lg bg-surface-secondary-default hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
              aria-label="Kembali ke Beranda"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-body-lg sm:text-h6 font-semibold text-white">
              Keranjang
            </h1>
          </div>
        </div>

        {/* ========================================================
            2. TWO-COLUMN LAYOUT: Left (Cart List/Empty) & Right (Detail Transaksi)
           ======================================================== */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          {/* ======================================================
              LEFT COLUMN: Subheader (Total Items + Hapus Semua) + Items
             ====================================================== */}
          <div className="lg:col-span-7 flex flex-col w-full min-w-0">
            {/* Subheader bar */}
            <div className="flex items-center justify-between pb-4 border-b-gradient-secondary mb-6">
              <span className="text-body-sm  text-gray-400">
                Total: {cartItems.length} Items
              </span>
              <Button
                type="button"
                variant="inactive"
                size="sm"
                onClick={handleClearAll}
                disabled={isEmpty}
              >
                Hapus semua
              </Button>
            </div>

            {/* CASE A: LOADING OR EMPTY CART */}
            {isCartApiLoading && isAuthenticated ? (
              <div className="flex flex-col gap-4 w-full">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <ListRowSkeleton key={idx} />
                ))}
              </div>
            ) : isEmpty ? (
              <div className="w-full py-16 sm:py-24 flex flex-col items-center justify-center">
                <EmptyState
                  icon={<CartOutlineIcon />}
                  title="Keranjang Anda Kosong"
                  description="Belum ada game di keranjangmu. Mulai jelajahi toko untuk menemukan game favorit!"
                  backLabel="Kembali"
                  searchLabel="Lihat Toko"
                  onBack={() => router.back()}
                  onSearch={() => router.push("/store")}
                  className="p-0 max-w-80"
                />
              </div>
            ) : (
              /* CASE B: CART ITEMS LIST (Using Item Component) */
              <div className="flex flex-col gap-4 w-full">
                {cartItems.map((item, idx) => (
                  <Item
                    key={`cart-item-${item.id}-${idx}`}
                    id={item.id}
                    title={item.title}
                    imageSrc={item.imageSrc}
                    discount={item.discount}
                    originalPrice={item.originalPriceFormatted}
                    price={formatCurrency(item.price)}
                    onBuyNow={() => handleBuyNow(item)}
                    onDelete={() => handleRemoveItem(item.id, item.title)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ======================================================
              RIGHT COLUMN: "Detail Transaksi" Summary Card
             ====================================================== */}
          <div className="lg:col-span-5 w-full lg:sticky top-28 min-w-0">
            <div className=" rounded-lg border-gradient-secondary p-6 flex flex-col gap-8">
              {/* TOTAL BELANJA BOX */}
              <div className="bg-surface-secondary-default border-gradient-secondary rounded-lg px-4 py-3.5 flex items-center justify-between">
                <span className="text-body-sm font-semibold text-white">
                  Total Belanja
                </span>
                <span className="text-body-md  font-semibold text-white">
                  {formatCurrency(totalBelanja)}
                </span>
              </div>

              {/* CHECKOUT BUTTON */}
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleCheckout}
                disabled={isEmpty}
                className="w-full"
              >
                <span>Lanjut Checkout</span>
                <ArrowRightIcon className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Toast Feedback Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant={toastMessage.type === "success" ? "success" : "error"}
              title={toastMessage.title}
              description={toastMessage.description}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
