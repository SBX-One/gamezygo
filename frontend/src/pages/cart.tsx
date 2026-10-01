import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { Button, EmptyState, Toast, Item } from "@/components/ui";
import { useCart, useRemoveFromCart } from "@/hooks/use-cart";
import { formatRupiah, formatDiscount } from "@/utils/formatters";

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

// 4 Initial cart items matching Figma screenshots 1 & 3 exactly
const INITIAL_CART_ITEMS: CartItemData[] = [
  {
    id: "cart-1",
    title: "Dead By Daylight",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900_2x.jpg",
    discount: "-30%",
    originalPrice: 439000,
    originalPriceFormatted: "Rp 439.000,00",
    price: 219500,
  },
  {
    id: "cart-2",
    title: "EA SPORTS FC™ 24",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    discount: "-30%",
    originalPrice: 439000,
    originalPriceFormatted: "Rp 439.000,00",
    price: 219500,
  },
  {
    id: "cart-3",
    title: "Red Dead Redemption II",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    discount: "-30%",
    originalPrice: 439000,
    originalPriceFormatted: "Rp 439.000,00",
    price: 219500,
  },
  {
    id: "cart-4",
    title: "Phantom Blade Zero",
    imageSrc:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=900&q=80",
    discount: "-30%",
    originalPrice: 439000,
    originalPriceFormatted: "Rp 439.000,00",
    price: 219500,
  },
];

const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

export default function CartPage() {
  const router = useRouter();

  // Server-side Cart API Hook
  const { data: cartApiRes } = useCart();
  const removeCartMutation = useRemoveFromCart();

  // Local state fallback
  const [localCartItems, setLocalCartItems] = React.useState<CartItemData[]>(INITIAL_CART_ITEMS);

  // Computed Cart Items (API priority or local fallback)
  const cartItems: CartItemData[] = React.useMemo(() => {
    if (cartApiRes?.data?.items) {
      return cartApiRes.data.items.map((item) => ({
        id: String(item.id),
        title: item.name,
        imageSrc: item.thumbnail,
        discount: formatDiscount(item.discount),
        originalPrice: item.price,
        originalPriceFormatted: formatRupiah(item.price),
        price: item.discount_price || item.price,
      }));
    }
    return localCartItems;
  }, [cartApiRes, localCartItems]);

  // Voucher input & applied states
  const [voucherInput, setVoucherInput] = React.useState("");
  const [appliedVoucher, setAppliedVoucher] = React.useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = React.useState<number>(0);
  const [voucherError, setVoucherError] = React.useState<string | null>(null);

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
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const totalBelanja = Math.max(0, subtotal - discountAmount);

  // Remove individual item
  const handleRemoveItem = (id: string, title: string) => {
    if (cartApiRes?.data) {
      removeCartMutation.mutate(id, {
        onSuccess: () => {
          showToast("success", "Item Dihapus", `${title} berhasil dihapus dari keranjang.`);
        },
        onError: () => {
          showToast("error", "Gagal Menghapus", `Gagal menghapus ${title} dari keranjang.`);
        },
      });
    } else {
      setLocalCartItems((prev) => prev.filter((item) => item.id !== id));
      showToast("success", "Item Dihapus", `${title} berhasil dihapus dari keranjang.`);
    }
  };

  // Clear all items (switches to Empty State in Screenshot 2)
  const handleClearAll = () => {
    setLocalCartItems([]);
    setAppliedVoucher(null);
    setDiscountPercent(0);
    setVoucherInput("");
    showToast("success", "Keranjang Dikosongkan", "Semua item di keranjang telah dihapus.");
  };

  // Apply Voucher
  const handleApplyVoucher = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVoucherError(null);

    const cleanCode = voucherInput.trim().toUpperCase();
    if (!cleanCode) {
      setVoucherError("Masukkan kode voucher terlebih dahulu.");
      return;
    }

    if (cleanCode === "DISCOUNT10" || cleanCode === "GAMEZYGO10" || cleanCode === "SUMMER26") {
      setAppliedVoucher(cleanCode);
      setDiscountPercent(10);
      showToast("success", "Voucher Berhasil Digunakan!", "Diskon 10% berhasil diterapkan pada total belanja.");
    } else if (cleanCode === "DISCOUNT50") {
      setAppliedVoucher(cleanCode);
      setDiscountPercent(50);
      showToast("success", "Voucher Berhasil Digunakan!", "Diskon 50% berhasil diterapkan pada total belanja.");
    } else {
      setVoucherError("Kode voucher tidak valid atau telah kedaluwarsa.");
      showToast("error", "Voucher Gagal", "Kode voucher tidak valid atau tidak ditemukan.");
    }
  };

  // Buy Now on Single Item
  const handleBuyNow = (item: CartItemData) => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("gamezygo_checkout_items", JSON.stringify([item]));
      }
    } catch {
      // ignore storage error
    }
    showToast("success", "Membeli Sekarang", `Melanjutkan pembelian langsung untuk ${item.title}...`);
    setTimeout(() => {
      router.push("/checkout");
    }, 400);
  };

  // Proceed to Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast("error", "Keranjang Kosong", "Tambahkan game ke keranjang terlebih dahulu.");
      return;
    }
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("gamezygo_checkout_items", JSON.stringify(cartItems));
      }
    } catch {
      // ignore storage error
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
        <div className="w-full border-b-gradient-secondary py-10 pb-4 mb-20 flex items-center justify-between">
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
        <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 lg:gap-12 items-start w-full">
          {/* ======================================================
              LEFT COLUMN: Subheader (Total Items + Hapus Semua) + Items
             ====================================================== */}
          <div className="lg:col-span-8 flex flex-col w-full">
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

            {/* CASE A: EMPTY CART (Matching Screenshot 2) */}
            {isEmpty ? (
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
                {cartItems.map((item) => (
                  <Item
                    key={item.id}
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
          <div className="lg:col-span-6 w-full sticky top-28">
            <div className=" rounded-lg border-gradient-secondary p-6 flex flex-col gap-8">
              {/* Card Header */}
              {/* <div className="flex flex-col gap-4">
                <h2 className="text-body-lg font-semibold text-white tracking-normal">
                  Detail Transaksi
                </h2>
                <div className="w-full border-b-gradient-secondary" />
              </div> */}

              {/* VOUCHER INPUT SECTION */}
              {/* <div className="flex flex-col gap-3">
                <label
                  htmlFor="voucher-input"
                  className="text-label-xs font-semibold text-gray-400 uppercase "
                >
                  VOUCHER
                </label>
                <form onSubmit={handleApplyVoucher} className="flex items-center gap-2">
                  <div className="flex-1 relative flex items-center bg-deep-blue-900 rounded-lg px-3.5 py-2.5">
                    <input
                      id="voucher-input"
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      placeholder="Kode voucher"
                      className="w-full bg-transparent text-body-sm text-gray-50 placeholder:text-gray-400 outline-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Gunakan
                  </Button>
                </form>

                {voucherError && (
                  <p className="text-label-xs text-pale-red-400 mt-0.5">
                    {voucherError}
                  </p>
                )}
                {appliedVoucher && (
                  <div className="flex items-center justify-between text-label-xs text-emerald-400 mt-0.5">
                    <span>
                      Voucher &quot;{appliedVoucher}&quot; aktif (-{discountPercent}%)
                    </span>
                    <Button
                      type="button"
                      variant='inactive'
                      onClick={() => {
                        setAppliedVoucher(null);
                        setDiscountPercent(0);
                        setVoucherInput("");
                        showToast("success", "Voucher Dihapus", "Kode voucher telah dilepas.");
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                )}
              </div> */}

              {/* DETAIL PESANAN SECTION */}
              {/* <div className="flex flex-col gap-3">
                <span className="text-label-xs font-semibold text-gray-400 uppercase ">
                  DETAIL PESANAN
                </span>

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-300">Item(s) Subtotal</span>
                  <span className="text-white font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {appliedVoucher && discountAmount > 0 && (
                  <div className="flex items-center justify-between text-body-sm text-emerald-400">
                    <span>Diskon Voucher ({discountPercent}%)</span>
                    <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-400">Pajak</span>
                  <span className="text-gray-400">-</span>
                </div>

                <div className="flex items-center justify-between text-body-sm pb-8 border-b-gradient-secondary">
                  <span className="text-gray-400">Pajak</span>
                  <span className="text-gray-400">-</span>
                </div>

              </div> */}

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
          <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
            <Toast
              variant={toastMessage.type === "success" ? "success" : "error"}
              title={toastMessage.title}
              description={toastMessage.description}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
