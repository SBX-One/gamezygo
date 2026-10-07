import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { StoreLayout } from "@/components/layout";
import { Button, Toast } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/utils/formatters";
import { useCart } from "@/hooks/use-cart";
import {
  useCreateOrder,
  useApplyVoucher,
  useRemoveVoucher,
  useCreatePayment,
  usePaymentStatus,
} from "@/hooks/use-orders";
import { subscribePaymentSSE } from "@/services/orders.service";
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
 * Copy Icon
 */
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface CheckoutItem {
  id: string;
  productId?: number;
  title: string;
  imageSrc: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

// Initial checkout items matching Figma screenshot fallback
const DEFAULT_CHECKOUT_ITEMS: CheckoutItem[] = [
  {
    id: "gta-1",
    productId: 1,
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    price: 219500,
  },
  {
    id: "rdr2-1",
    productId: 2,
    title: "Red Dead Redemption 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    price: 219000,
  },
  {
    id: "ac-1",
    productId: 3,
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    price: 219500,
  },
  {
    id: "ghost-1",
    productId: 4,
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    price: 439500,
  },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bca",
    name: "BCA",
    icon: "/assets/svg/fluent_@-24-BCA.svg",
  },
  {
    id: "mandiri",
    name: "Mandiri",
    icon: "/assets/svg/fluent_@-24-Mandiri.svg",
  },
  {
    id: "qris",
    name: "QRIS",
    icon: "/assets/svg/fluent_@-24-QRIS.svg",
  },
  {
    id: "bni",
    name: "BNI",
    icon: "/assets/svg/fluent_@-24-BNI.svg",
  },
];

export default function CheckoutPage() {
  const router = useRouter();

  // Zustand state
  const clearCart = useCartStore((s) => s.clearCart);
  const activeOrderNumber = useCartStore((s) => s.orderNumber);
  const activeOrderId = useCartStore((s) => s.orderId);
  const setOrderDetails = useCartStore((s) => s.setOrderDetails);
  const setGatewayReference = useCartStore((s) => s.setGatewayReference);

  // TanStack Query Cart data
  const { data: cartApiRes } = useCart();

  // Checkout items state (defaults to API items if present, else fallback)
  const [checkoutItems, setCheckoutItems] = React.useState<CheckoutItem[]>(DEFAULT_CHECKOUT_ITEMS);

  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("gamezygo_checkout_items");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped: CheckoutItem[] = parsed.map((item: any, idx: number) => ({
              id: item.id || `item-${idx}`,
              productId: typeof item.id === "number" ? item.id : idx + 1,
              title: item.title || item.name || "Game",
              imageSrc: item.imageSrc || item.thumbnail || DEFAULT_CHECKOUT_ITEMS[0].imageSrc,
              price: item.price || 219500,
            }));
            setCheckoutItems(mapped);
            return;
          }
        }
      }
    } catch {
      // ignore parsing error
    }

    if (cartApiRes?.data?.items && cartApiRes.data.items.length > 0) {
      const mapped: CheckoutItem[] = cartApiRes.data.items.map((item) => ({
        id: String(item.id),
        productId: item.id,
        title: item.name,
        imageSrc: item.thumbnail,
        price: item.discount_price > 0 ? item.discount_price : item.price,
      }));
      setCheckoutItems(mapped);
    }
  }, [cartApiRes]);

  // Selected Payment Method (defaults to QRIS or BCA)
  const [selectedPayment, setSelectedPayment] = React.useState<string>("qris");

  // Voucher state
  const [voucherInput, setVoucherInput] = React.useState("");
  const [appliedVoucher, setAppliedVoucher] = React.useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = React.useState<number>(0);
  const [apiDiscountAmount, setApiDiscountAmount] = React.useState<number | null>(null);
  const [voucherError, setVoucherError] = React.useState<string | null>(null);

  // Active Order & Payment mutations
  const createOrderMutation = useCreateOrder();
  const applyVoucherMutation = useApplyVoucher();
  const removeVoucherMutation = useRemoveVoucher();
  const createPaymentMutation = useCreatePayment();

  // QRIS Modal state
  const [qrisModalData, setQrisModalData] = React.useState<{
    reference: string;
    amount: number;
    expiredAt: string;
  } | null>(null);

  // Active gateway reference for polling
  const [activeReference, setActiveReference] = React.useState<string | null>(null);

  // Polling payment status
  const { data: paymentStatusRes, refetch: refetchPaymentStatus } = usePaymentStatus(
    activeReference || "",
    {
      enabled: Boolean(activeReference),
      refetchInterval: 3000,
    }
  );

  // Countdown timer for QRIS expiration
  const [remainingTime, setRemainingTime] = React.useState<string>("15:00");

  React.useEffect(() => {
    if (!qrisModalData?.expiredAt) return;

    const interval = setInterval(() => {
      const diff = new Date(qrisModalData.expiredAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemainingTime("00:00");
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setRemainingTime(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrisModalData?.expiredAt]);

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

  // Watch payment status updates via Realtime SSE & Polling Fallback
  React.useEffect(() => {
    const handleSuccess = () => {
      setQrisModalData(null);
      setActiveReference(null);
      clearCart();
      try {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("gamezygo_checkout_items");
        }
      } catch {
        // ignore
      }
      showToast(
        "success",
        "Pembayaran Dikonfirmasi!",
        "Pembayaran telah berhasil diverifikasi. Membuka konfirmasi pesanan..."
      );
      setTimeout(() => {
        router.push("/checkout/success");
      }, 800);
    };

    // 1. If polling reports paid
    if (paymentStatusRes?.data?.status === "paid" || paymentStatusRes?.data?.status === "completed") {
      handleSuccess();
      return;
    }

    // 2. If activeReference is set, listen to SSE stream
    if (activeReference) {
      const unsubscribe = subscribePaymentSSE(activeReference, (orderDetail) => {
        if (orderDetail?.status === "paid" || orderDetail?.status === "completed") {
          handleSuccess();
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [paymentStatusRes, activeReference, clearCart, router]);

  // Calculations
  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount =
    apiDiscountAmount !== null
      ? apiDiscountAmount
      : Math.round(subtotal * (discountPercent / 100));
  const totalBelanja = Math.max(0, subtotal - discountAmount);

  // Apply Voucher
  const handleApplyVoucher = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVoucherError(null);

    const cleanCode = voucherInput.trim().toUpperCase();
    if (!cleanCode) {
      setVoucherError("Masukkan kode voucher terlebih dahulu.");
      return;
    }

    // If activeOrderId exists, apply via API
    if (activeOrderId) {
      try {
        const res = await applyVoucherMutation.mutateAsync({
          orderId: activeOrderId,
          voucherCode: cleanCode,
        });
        if (res?.data) {
          setAppliedVoucher(cleanCode);
          setApiDiscountAmount(res.data.discount_amount);
          showToast(
            "success",
            "Voucher Berhasil Digunakan!",
            `Diskon ${formatRupiah(res.data.discount_amount)} berhasil diterapkan.`
          );
          return;
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const msg =
            err.response?.data?.message ||
            "Subtotal belum memenuhi syarat minimal penggunaan voucher.";
          setVoucherError(msg);
          showToast("error", "Voucher Gagal", msg);
          return;
        }
      }
    }

    // Fallback client-side voucher validation
    if (cleanCode === "DISCOUNT10" || cleanCode === "GAMEZYGO10" || cleanCode === "SUMMER26") {
      setAppliedVoucher(cleanCode);
      setDiscountPercent(10);
      setApiDiscountAmount(null);
      showToast("success", "Voucher Berhasil Digunakan!", "Diskon 10% berhasil diterapkan pada total belanja.");
    } else if (cleanCode === "DISCOUNT50") {
      setAppliedVoucher(cleanCode);
      setDiscountPercent(50);
      setApiDiscountAmount(null);
      showToast("success", "Voucher Berhasil Digunakan!", "Diskon 50% berhasil diterapkan pada total belanja.");
    } else {
      setVoucherError("Kode voucher tidak valid atau telah kedaluwarsa.");
      showToast("error", "Voucher Gagal", "Kode voucher tidak valid atau tidak ditemukan.");
    }
  };

  // Remove Voucher
  const handleRemoveVoucher = async () => {
    if (activeOrderId && appliedVoucher) {
      try {
        await removeVoucherMutation.mutateAsync(activeOrderId);
      } catch {
        // Continue local cleanup
      }
    }
    setAppliedVoucher(null);
    setDiscountPercent(0);
    setApiDiscountAmount(null);
    setVoucherInput("");
    showToast("success", "Voucher Dihapus", "Kode voucher telah dilepas.");
  };

  // Handle Pay / Checkout
  const handlePay = async () => {
    if (checkoutItems.length === 0) {
      showToast("error", "Checkout Kosong", "Tidak ada item untuk dibayar.");
      return;
    }

    const currentMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.name || "Pembayaran";

    // Attempt API order creation if we have a valid product
    let targetOrderId = activeOrderId;

    if (!targetOrderId) {
      const primaryProductId = checkoutItems[0]?.productId || 1;
      const itemsPayload = checkoutItems.map((item) => ({
        product_id: item.productId || 1,
        item_type: "product",
      }));
      try {
        const orderRes = await createOrderMutation.mutateAsync({
          item_type: "product",
          product_id: primaryProductId,
          items: itemsPayload,
        });

        if (orderRes?.data) {
          targetOrderId = String(orderRes.data.id);
          setOrderDetails(orderRes.data.order_number, String(orderRes.data.id));

          // If voucher was entered, apply it now to the new order
          if (appliedVoucher) {
            try {
              const vRes = await applyVoucherMutation.mutateAsync({
                orderId: String(orderRes.data.id),
                voucherCode: appliedVoucher,
              });
              if (vRes?.data) {
                setApiDiscountAmount(vRes.data.discount_amount);
              }
            } catch {
              // Ignore voucher re-apply error on new order
            }
          }
        }
      } catch {
        // API offline fallback — proceed with local simulation
      }
    }

    // Trigger Payment
    if (selectedPayment === "qris") {
      if (targetOrderId) {
        try {
          const payRes = await createPaymentMutation.mutateAsync({
            orderId: targetOrderId,
            paymentMethod: "qris",
          });

          if (payRes?.data) {
            const { gateway_reference, amount, expired_at } = payRes.data;
            setGatewayReference(gateway_reference);
            setActiveReference(gateway_reference);
            setQrisModalData({
              reference: gateway_reference,
              amount: amount || totalBelanja,
              expiredAt:
                expired_at ||
                new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            });
            showToast("success", "QRIS Dibuat", "Silakan scan kode QRIS untuk menyelesaikan pesanan.");
            return;
          }
        } catch {
          // Fallback to simulated QRIS below
        }
      }

      // Simulated QRIS Modal (Offline / Fallback mode)
      const mockRef = `QRIS-${Date.now().toString().slice(-6)}`;
      setActiveReference(mockRef);
      setQrisModalData({
        reference: mockRef,
        amount: totalBelanja,
        expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });
      showToast("success", "QRIS Simulasi Siap", "Silakan scan kode QRIS untuk menyelesaikan pesanan.");
      return;
    }

    // Non-QRIS payment simulation (BCA, Mandiri, BNI)
    showToast(
      "success",
      "Memproses Pembayaran",
      `Menghubungkan ke ${currentMethod}... Total: ${formatRupiah(totalBelanja)}`
    );

    setTimeout(() => {
      clearCart();
      try {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("gamezygo_checkout_items");
        }
      } catch {
        // ignore
      }
      showToast(
        "success",
        "Pembayaran Berhasil!",
        "Game telah berhasil dibeli dan ditambahkan ke Library Akun Anda."
      );
      setTimeout(() => {
        router.push("/checkout/success");
      }, 600);
    }, 1500);
  };

  // Simulate instant payment success
  const handleSimulateSuccess = () => {
    setQrisModalData(null);
    setActiveReference(null);
    clearCart();
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("gamezygo_checkout_items");
      }
    } catch {
      // ignore
    }
    showToast(
      "success",
      "Pembayaran Berhasil Terverifikasi!",
      "Game telah berhasil dibeli dan ditambahkan ke Library Akun Anda."
    );
    setTimeout(() => {
      router.push("/checkout/success");
    }, 400);
  };

  return (
    <>
      <Head>
        <title>Checkout - Gamezygo</title>
        <meta
          name="description"
          content="Selesaikan pembelian game Anda dengan aman melalui berbagai metode pembayaran di Gamezygo."
        />
      </Head>

      <StoreLayout
        hideNavbar={true}
        hideSidebar={true}
        contentClassName="w-full  mx-auto px-4 sm:px-8 lg:px-20 flex flex-col"
      >
        {/* ========================================================
            1. PAGE TITLE & FULL-WIDTH DIVIDER (With Back Button)
           ======================================================== */}
        <div className="w-full border-b-gradient-secondary py-10 pb-4 mb-20 flex items-center justify-between">
          <div className="w-full mx-auto px-4 sm:px-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="w-10 h-10 rounded-lg bg-surface-secondary-default hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
              aria-label="Kembali ke Keranjang"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-body-lg sm:text-h6 font-semibold text-white">
              Checkout
            </h1>
          </div>
        </div>

        {/* ========================================================
            2. TWO-COLUMN LAYOUT: Left (Item List) & Right (Detail Transaksi)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 lg:gap-12 items-start w-full mb-24">
          {/* ======================================================
              LEFT COLUMN: Subheader (Total: N Items) + Items List
             ====================================================== */}
          <div className="lg:col-span-8 flex flex-col w-full">
            {/* Subheader: Total Items */}
            <div className="flex items-center justify-between mb-5 pb-6 border-b-gradient-secondary">
              <span className="text-body-sm text-gray-400">
                Total: {checkoutItems.length} Items
              </span>
              {activeOrderNumber && (
                <span className="text-label-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Order #{activeOrderNumber}
                </span>
              )}
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4 w-full">
              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="w-full bg-surface-secondary-default rounded-lg p-2 flex items-center gap-4 transition-all duration-150 hover:border-white/10 select-none"
                >
                  {/* Thumbnail Cover Game */}
                  <div className="w-16.25 h-17.5 rounded-md overflow-hidden shrink-0 bg-deep-blue-950 relative flex items-center justify-center">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=800&q=80";
                      }}
                    />
                  </div>

                  {/* Title & Price */}
                  <div className="flex flex-col items-start justify-center gap-3 min-w-0">
                    <h3 className="text-body-md font-semibold text-gray-50 leading-snug">
                      {item.title}
                    </h3>
                    <span className="text-body-sm text-gray-400 font-normal">
                      {formatRupiah(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================
              RIGHT COLUMN: "Detail Transaksi" Checkout Summary Card
             ====================================================== */}
          <div className="lg:col-span-6 w-full sticky top-28">
            <div className="rounded-lg border-gradient-secondary p-6 flex flex-col gap-8 bg-surface-secondary-default/50 backdrop-blur-md">
              {/* VOUCHER SECTION */}
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="voucher-input"
                  className="text-label-xs font-semibold text-gray-400 uppercase "
                >
                  VOUCHER
                </label>
                <form onSubmit={handleApplyVoucher} className="flex items-center gap-2">
                  <div className="flex-1 relative flex items-center bg-deep-blue-900 rounded-lg px-3.5 py-2.5 border border-white/5 focus-within:border-indigo-500/50 transition-colors">
                    <input
                      id="voucher-input"
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      placeholder="Kode voucher (cth: DISCOUNT10)"
                      className="w-full bg-transparent text-body-sm text-gray-50 placeholder:text-gray-400 outline-none uppercase"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={applyVoucherMutation.isPending}
                  >
                    {applyVoucherMutation.isPending ? "Memeriksa..." : "Gunakan"}
                  </Button>
                </form>

                {voucherError && (
                  <p className="text-label-xs text-rose-400 mt-0.5 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                    {voucherError}
                  </p>
                )}
                {appliedVoucher && (
                  <div className="flex items-center justify-between text-label-xs text-emerald-400 mt-0.5 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                    <span>
                      Voucher &quot;{appliedVoucher}&quot; aktif (
                      {apiDiscountAmount !== null
                        ? `-${formatRupiah(apiDiscountAmount)}`
                        : `-${discountPercent}%`}
                      )
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-gray-400 hover:text-white underline text-[11px] ml-2"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>

              {/* ORDER BREAKDOWN (Subtotal, Voucher, Tax) */}
              <div className="flex flex-col gap-3 py-8 border-y-gradient-secondary">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-300">Item(s) Subtotal</span>
                  <span className="text-white font-medium">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-400">Voucher Diskon</span>
                  <span className={cn("font-medium", discountAmount > 0 ? "text-emerald-400" : "text-gray-400")}>
                    {discountAmount > 0 ? `-${formatRupiah(discountAmount)}` : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-400">Pajak (PPN 0%)</span>
                  <span className="text-gray-400">Rp 0</span>
                </div>
              </div>

              {/* PAYMENT METHODS (2x2 Grid) */}
              <div className="flex flex-col gap-2">
                <span className="text-label-xs font-semibold text-gray-400 uppercase ">
                  Metode Pembayaran
                </span>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedPayment === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id)}
                        className={cn(
                          "flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-all duration-150 cursor-pointer select-none",
                          isSelected
                            ? "bg-surface-secondary-default border-gradient-secondary text-white shadow-md ring-1 ring-white/20"
                            : "bg-surface-secondary-default border border-white/10 hover:border-white/20 text-gray-200"
                        )}
                      >
                        <img
                          src={method.icon}
                          alt={method.name}
                          className="w-6 h-6 object-contain shrink-0"
                        />
                        <span className="text-label-sm font-semibold">{method.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TOTAL BELANJA BOX */}
              <div className="bg-surface-secondary-default border-gradient-secondary rounded-lg px-4 py-3.5 flex items-center justify-between">
                <span className="text-body-sm font-semibold text-white">
                  Total Belanja
                </span>
                <span className="text-body-md font-semibold text-white">
                  {formatRupiah(totalBelanja)}
                </span>
              </div>

              {/* PAY BUTTON */}
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handlePay}
                disabled={
                  createOrderMutation.isPending ||
                  createPaymentMutation.isPending ||
                  checkoutItems.length === 0
                }
                className="w-full flex items-center justify-center gap-2 py-3.5 "
              >
                <span>
                  {createOrderMutation.isPending || createPaymentMutation.isPending
                    ? "Menyiapkan Transaksi..."
                    : `Bayar ${formatRupiah(totalBelanja)}`}
                </span>
                <ArrowRightIcon className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. QRIS PAYMENT MODAL
           ======================================================== */}
        {qrisModalData && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-deep-blue-950/95 border border-white/15 rounded-2xl p-6 sm:p-8 w-full shadow-2xl backdrop-blur-xl relative flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
              {/* Badge & Title */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-label-xs font-semibold uppercase ">
                  QRIS Instant Pay
                </span>
              </div>
              <h2 className="text-h6 font-bold text-white mb-1">
                Scan QR untuk Membayar
              </h2>
              <p className="text-body-xs text-gray-400 mb-5">
                Buka aplikasi e-wallet (GoPay, OVO, Dana) atau Mobile Banking favoritmu.
              </p>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl shadow-inner mb-4 flex flex-col items-center justify-center relative group">
                {/* Visual SVG QR Code Graphic */}
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-44 h-44"
                >
                  <rect width="180" height="180" fill="white" />
                  {/* Top Left Marker */}
                  <rect x="10" y="10" width="40" height="40" rx="6" fill="#0F172A" />
                  <rect x="18" y="18" width="24" height="24" rx="3" fill="white" />
                  <rect x="24" y="24" width="12" height="12" rx="2" fill="#0F172A" />

                  {/* Top Right Marker */}
                  <rect x="130" y="10" width="40" height="40" rx="6" fill="#0F172A" />
                  <rect x="138" y="18" width="24" height="24" rx="3" fill="white" />
                  <rect x="144" y="24" width="12" height="12" rx="2" fill="#0F172A" />

                  {/* Bottom Left Marker */}
                  <rect x="10" y="130" width="40" height="40" rx="6" fill="#0F172A" />
                  <rect x="18" y="138" width="24" height="24" rx="3" fill="white" />
                  <rect x="24" y="144" width="12" height="12" rx="2" fill="#0F172A" />

                  {/* Matrix Pattern Blocks */}
                  <rect x="60" y="20" width="10" height="20" fill="#0F172A" />
                  <rect x="80" y="15" width="15" height="15" fill="#0F172A" />
                  <rect x="105" y="25" width="15" height="10" fill="#0F172A" />
                  <rect x="60" y="50" width="25" height="10" fill="#0F172A" />
                  <rect x="95" y="45" width="15" height="20" fill="#0F172A" />
                  <rect x="120" y="55" width="25" height="15" fill="#0F172A" />
                  <rect x="15" y="60" width="30" height="10" fill="#0F172A" />
                  <rect x="25" y="80" width="15" height="25" fill="#0F172A" />
                  <rect x="50" y="70" width="20" height="20" fill="#0F172A" />
                  <rect x="110" y="80" width="25" height="15" fill="#0F172A" />
                  <rect x="145" y="75" width="25" height="20" fill="#0F172A" />
                  <rect x="60" y="100" width="20" height="15" fill="#0F172A" />
                  <rect x="90" y="105" width="15" height="25" fill="#0F172A" />
                  <rect x="115" y="105" width="20" height="20" fill="#0F172A" />
                  <rect x="60" y="130" width="25" height="15" fill="#0F172A" />
                  <rect x="95" y="135" width="20" height="25" fill="#0F172A" />
                  <rect x="125" y="135" width="25" height="15" fill="#0F172A" />
                  <rect x="155" y="125" width="15" height="30" fill="#0F172A" />

                  {/* Center QRIS Emblem */}
                  <rect x="70" y="70" width="40" height="40" rx="8" fill="#EE2C38" />
                  <text
                    x="90"
                    y="94"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    QRIS
                  </text>
                </svg>
              </div>

              {/* Reference & Countdown */}
              <div className="w-full bg-deep-blue-900/80 rounded-xl p-3 mb-4 border border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-body-xs">
                  <span className="text-gray-400">Kode Referensi:</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(qrisModalData.reference);
                      showToast("success", "Disalin!", "Kode referensi disalin ke clipboard.");
                    }}
                    className="flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 font-mono font-medium transition-colors"
                  >
                    <span>{qrisModalData.reference}</span>
                    <CopyIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-body-xs border-t border-white/5 pt-2">
                  <span className="text-gray-400">Total Pembayaran:</span>
                  <span className="text-emerald-400 font-bold text-body-sm">
                    {formatRupiah(qrisModalData.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-xs border-t border-white/5 pt-2">
                  <span className="text-gray-400">Sisa Waktu:</span>
                  <span className="text-amber-400 font-semibold font-mono">
                    {remainingTime}
                  </span>
                </div>
              </div>

              {/* Real-time Status Indicator */}
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-label-xs text-gray-300">
                  Menunggu pembayaran... Halaman otomatis diperbarui.
                </span>
              </div>

              {/* Modal Buttons */}
              <div className="w-full flex flex-col gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => {
                    refetchPaymentStatus();
                    showToast("success", "Memeriksa Status", "Memeriksa status pembayaran ke gateway...");
                  }}
                  className="w-full"
                >
                  Cek Status Pembayaran
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSimulateSuccess}
                  className="w-full text-label-xs"
                >
                  Simulasi Pembayaran Berhasil (Dev Mode)
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setQrisModalData(null);
                    setActiveReference(null);
                  }}
                  className="text-body-xs text-gray-400 hover:text-white py-1.5 transition-colors"
                >
                  Tutup / Batalkan
                </button>
              </div>
            </div>
          </div>
        )}

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
