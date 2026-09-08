import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { Button, Toast } from "@/components/ui";
import { cn } from "@/lib/utils";

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

export interface CheckoutItem {
  id: string;
  title: string;
  imageSrc: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

// 4 Initial checkout items matching Figma screenshot exactly
const DEFAULT_CHECKOUT_ITEMS: CheckoutItem[] = [
  {
    id: "gta-1",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    price: 219500,
  },
  {
    id: "gta-2",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    price: 219500,
  },
  {
    id: "gta-3",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    price: 219500,
  },
  {
    id: "gta-4",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    price: 219500,
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

const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

export default function CheckoutPage() {
  const router = useRouter();

  // Checkout items state
  const [checkoutItems] = React.useState<CheckoutItem[]>(DEFAULT_CHECKOUT_ITEMS);

  // Selected Payment Method (defaults to BCA as in design)
  const [selectedPayment, setSelectedPayment] = React.useState<string>("bca");

  // Voucher state
  const [voucherInput, setVoucherInput] = React.useState("");
  const [appliedVoucher, setAppliedVoucher] = React.useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = React.useState<number>(0);
  const [voucherError, setVoucherError] = React.useState<string | null>(null);

  // Loading state during payment processing
  const [isProcessing, setIsProcessing] = React.useState(false);

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
  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const totalBelanja = Math.max(0, subtotal - discountAmount);

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

  // Handle Pay / Checkout
  const handlePay = () => {
    if (checkoutItems.length === 0) {
      showToast("error", "Checkout Kosong", "Tidak ada item untuk dibayar.");
      return;
    }

    const currentMethod = PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.name || "Pembayaran";

    setIsProcessing(true);
    showToast(
      "success",
      "Memproses Pembayaran",
      `Menghubungkan ke ${currentMethod}... Total: ${formatCurrency(totalBelanja)}`
    );

    setTimeout(() => {
      setIsProcessing(false);
      showToast(
        "success",
        "Pembayaran Berhasil!",
        "Game telah berhasil dibeli dan ditambahkan ke Library Akun Anda."
      );
      setTimeout(() => {
        router.push("/library");
      }, 1200);
    }, 1800);
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
        contentClassName="w-full max-w-360 mx-auto px-4 sm:px-8 lg:px-20 flex flex-col"
      >
        {/* ========================================================
            1. PAGE TITLE & FULL-WIDTH DIVIDER (Matching Profile & Cart)
           ======================================================== */}
        <div className="w-full border-b-gradient-secondary py-10 pb-4 mb-20">
          <div className="w-full mx-auto px-4 sm:px-0">
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
            <span className="text-body-sm text-gray-400 mb-5 pb-6 border-b-gradient-secondary">
              Total: {checkoutItems.length} Items
            </span>

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
                      {formatCurrency(item.price)}
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
            <div className="rounded-lg border-gradient-secondary p-6 flex flex-col gap-8">
              {/* VOUCHER SECTION */}
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="voucher-input"
                  className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider"
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
                      variant="inactive"
                      size="xs"
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
              </div>


              {/* ORDER BREAKDOWN (Subtotal, Voucher, Tax) */}
              <div className="flex flex-col gap-3 py-8 border-y-gradient-secondary">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-300">Item(s) Subtotal</span>
                  <span className="text-white font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-400">Voucher</span>
                  <span className="text-gray-400">
                    {discountAmount > 0 ? `-${formatCurrency(discountAmount)}` : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-gray-400">-</span>
                </div>
              </div>

              {/* PAYMENT METHODS (2x2 Grid) */}
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

              {/* TOTAL BELANJA BOX */}
              <div className="bg-surface-secondary-default border-gradient-secondary rounded-lg px-4 py-3.5 flex items-center justify-between">
                <span className="text-body-sm font-semibold text-white">
                  Total Belanja
                </span>
                <span className="text-body-md font-semibold text-white">
                  {formatCurrency(totalBelanja)}
                </span>
              </div>

              {/* PAY BUTTON */}
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handlePay}
                disabled={isProcessing || checkoutItems.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3.5"
              >
                <span>Bayar {formatCurrency(totalBelanja)}</span>
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
