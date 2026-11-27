import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { StoreLayout } from "@/components/layout";
import { Button, ListRowSkeleton, Skeleton, Toast } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/utils/formatters";
import { useCart, CART_KEYS } from "@/hooks/use-cart";
import { clearCartApi } from "@/services/cart.service";
import {
  useCreateOrder,
  useApplyVoucher,
  useRemoveVoucher,
  useCreatePayment,
  usePaymentStatus,
} from "@/hooks/use-orders";
import { subscribePaymentSSE, fetchPaymentStatus } from "@/services/orders.service";
import { useCartStore, type CartStore } from "@/stores/use-cart-store";
import type { CartProductItem } from "@/types/api";
import { useMidtransSnap, createSnapToken } from "@/features/checkout";
import { useAuthStore } from "@/stores/use-auth-store";
import { toast } from "@/stores/use-toast-store";

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
  subscriptionPlanId?: number;
  itemType?: "product" | "subscription";
  title: string;
  imageSrc: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Auth state
  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Zustand state
  const clearCart = useCartStore((s: CartStore) => s.clearCart);
  const activeOrderNumber = useCartStore((s: CartStore) => s.orderNumber);
  const activeOrderId = useCartStore((s: CartStore) => s.orderId);
  const setOrderDetails = useCartStore((s: CartStore) => s.setOrderDetails);
  const clearOrderDetails = useCartStore((s: CartStore) => s.clearOrderDetails);
  const setGatewayReference = useCartStore((s: CartStore) => s.setGatewayReference);
  const storeCartItems = useCartStore((s: CartStore) => s.cartItems);

  // TanStack Query Cart data
  const { data: cartApiRes, isLoading: isCartLoading } = useCart();

  // Direct purchase session checkout items (strictly scoped to ?mode=direct)
  const [sessionItems, setSessionItems] = React.useState<CheckoutItem[]>([]);
  const [hasInitializedCheckout, setHasInitializedCheckout] = React.useState(false);
  const isRedirectingAfterSuccessRef = React.useRef(false);
  const hasRedirectedEmptyRef = React.useRef(false);
  const isDirectMode = router.query.mode === "direct";

  // Midtrans Snap SDK hook
  const { openSnap } = useMidtransSnap();
  const [isSnapLoading, setIsSnapLoading] = React.useState(false);

  // Selected Payment Method (defaults to Midtrans Snap Sandbox)
  const selectedPayment = "midtrans";

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

  React.useEffect(() => {
    if (!router.isReady || typeof window === "undefined") return;

    hasRedirectedEmptyRef.current = false;

    // Reset any stale order/payment state from previous transactions on entry
    clearOrderDetails();
    setQrisModalData(null);
    setActiveReference(null);
    setAppliedVoucher(null);
    setApiDiscountAmount(null);
    setDiscountPercent(0);
    setVoucherInput("");
    setVoucherError(null);

    if (isDirectMode) {
      let loadedItems: CheckoutItem[] = [];
      try {
        const stored = sessionStorage.getItem("gamezygo_checkout_items");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedItems = parsed.map((item: Record<string, unknown>, idx: number) => ({
              id: String(item.id || item.productId || `item-${idx}`),
              productId: Number(item.productId || item.id) || idx + 1,
              subscriptionPlanId: item.subscriptionPlanId
                ? Number(item.subscriptionPlanId)
                : undefined,
              itemType:
                item.itemType === "subscription" ||
                String(item.id || "").startsWith("sub-")
                  ? "subscription"
                  : "product",
              title: String(item.title || item.name || "Game"),
              imageSrc: String(
                item.imageSrc || item.cover_image_url || item.thumbnail || ""
              ),
              price: Number(item.price) || 0,
            }));
          }
        }
      } catch {
        // ignore parsing error
      }
      setSessionItems(loadedItems);
    } else {
      // Direct URL visit to /checkout must NOT reuse stale sessionStorage items
      try {
        sessionStorage.removeItem("gamezygo_checkout_items");
      } catch {
        // ignore
      }
      setSessionItems([]);
    }

    setHasInitializedCheckout(true);
  }, [router.isReady, router.asPath, isDirectMode, clearOrderDetails]);

  // Clean up checkout state when navigating away from /checkout
  React.useEffect(() => {
    const handleRouteChange = (nextUrl: string) => {
      if (nextUrl.startsWith("/checkout") || nextUrl.startsWith("/login")) {
        return;
      }
      clearOrderDetails();
      try {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("gamezygo_checkout_items");
        }
      } catch {
        // ignore
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, clearOrderDetails]);

  // Checkout items state (derived dynamically from direct sessionStorage, API, or Zustand store)
  const checkoutItems: CheckoutItem[] = React.useMemo(() => {
    if (isDirectMode && sessionItems.length > 0) {
      return sessionItems;
    }
    if (isAuthenticated) {
      if (cartApiRes?.data?.items && cartApiRes.data.items.length > 0) {
        return cartApiRes.data.items.map((item: CartProductItem) => ({
          id: String(item.id),
          productId: item.id,
          title: item.name,
          imageSrc: item.thumbnail || "",
          price: item.discount_price > 0 ? item.discount_price : item.price,
        }));
      }
      return [];
    }
    if (storeCartItems && storeCartItems.length > 0) {
      return storeCartItems.map((item, idx) => ({
        id: String(item.productId || `item-${idx}`),
        productId: Number(item.productId) || (idx + 1),
        title: item.product?.title || "Game",
        imageSrc: item.product?.imageSrc || item.product?.cover_image_url || "",
        price: Number(item.product?.price) || 0,
      }));
    }
    return [];
  }, [isDirectMode, sessionItems, isAuthenticated, cartApiRes, storeCartItems]);

  // Ensure empty checkout never retains stale order state & redirects back to /cart
  React.useEffect(() => {
    if (
      !router.isReady ||
      !isAuthenticated ||
      !hasInitializedCheckout ||
      isCartLoading ||
      isRedirectingAfterSuccessRef.current
    ) {
      return;
    }

    if (checkoutItems.length === 0) {
      if (activeOrderId || activeOrderNumber) {
        clearOrderDetails();
      }
      setQrisModalData(null);
      setActiveReference(null);

      if (!hasRedirectedEmptyRef.current) {
        hasRedirectedEmptyRef.current = true;
        toast.warning(
          "Harap masukkan item terlebih dahulu sebelum checkout.",
          "Keranjang Kosong"
        );
        router.replace("/cart");
      }
    }
  }, [
    router,
    isAuthenticated,
    hasInitializedCheckout,
    isCartLoading,
    checkoutItems.length,
    activeOrderId,
    activeOrderNumber,
    clearOrderDetails,
  ]);

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
    const handleSuccess = async () => {
      isRedirectingAfterSuccessRef.current = true;
      setQrisModalData(null);
      setActiveReference(null);
      clearCart();
      await clearCartApi().catch(() => null);
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["library"] });
      queryClient.invalidateQueries({ queryKey: ["user-library"] });
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
  }, [paymentStatusRes, activeReference, clearCart, router, queryClient]);

  // Calculations
  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount =
    apiDiscountAmount !== null
      ? apiDiscountAmount
      : Math.round(subtotal * (discountPercent / 100));
  const totalBelanja = Math.max(0, subtotal - discountAmount);

  // Apply Voucher (Always validates via Backend API: POST /api/v1/user/orders/{orderId}/voucher)
  const handleApplyVoucher = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVoucherError(null);

    const cleanCode = voucherInput.trim().toUpperCase();
    if (!cleanCode) {
      setVoucherError("Masukkan kode voucher terlebih dahulu.");
      return;
    }

    if (!isAuthenticated) {
      const msg = "Silakan login terlebih dahulu untuk menggunakan voucher.";
      setVoucherError(msg);
      showToast("error", "Login Diperlukan", msg);
      return;
    }

    if (checkoutItems.length === 0) {
      const msg = "Tidak ada item checkout untuk menerapkan voucher.";
      setVoucherError(msg);
      showToast("error", "Checkout Kosong", msg);
      return;
    }

    let targetOrderId = activeOrderId;

    // Ensure an order exists in backend before validating voucher
    if (!targetOrderId) {
      const firstItem = checkoutItems[0];
      const isSubscription = String(firstItem.id).startsWith("sub-");
      const numericId = Number(firstItem.productId || firstItem.id);

      try {
        const orderRes = await createOrderMutation.mutateAsync(
          isSubscription
            ? {
                item_type: "subscription",
                subscription_plan_id:
                  !isNaN(numericId) && numericId > 0 ? numericId : 1,
              }
            : {
                item_type: "product",
                product_id: !isNaN(numericId) && numericId > 0 ? numericId : 1,
              }
        );

        if (orderRes?.data?.id) {
          targetOrderId = String(orderRes.data.id);
          setOrderDetails(orderRes.data.order_number, targetOrderId);
        }
      } catch (orderErr: unknown) {
        let msg = "Gagal menyiapkan pesanan untuk validasi voucher.";
        if (axios.isAxiosError(orderErr)) {
          msg = orderErr.response?.data?.message || msg;
        }
        setVoucherError(msg);
        showToast("error", "Voucher Gagal", msg);
        return;
      }
    }

    if (!targetOrderId) {
      const msg = "Gagal membuat pesanan untuk memvalidasi voucher.";
      setVoucherError(msg);
      showToast("error", "Voucher Gagal", msg);
      return;
    }

    try {
      const res = await applyVoucherMutation.mutateAsync({
        orderId: targetOrderId,
        voucherCode: cleanCode,
      });

      if (res?.data) {
        const discountVal = Number(res.data.discount_amount ?? 0);
        setAppliedVoucher(cleanCode);
        setDiscountPercent(0);
        setApiDiscountAmount(discountVal);
        showToast(
          "success",
          "Voucher Berhasil Digunakan!",
          `Diskon ${formatRupiah(discountVal)} berhasil diterapkan.`
        );
        return;
      }

      const fallbackMsg = "Kode voucher tidak valid atau telah kedaluwarsa.";
      setVoucherError(fallbackMsg);
      showToast("error", "Voucher Gagal", fallbackMsg);
    } catch (err: unknown) {
      let msg = "Kode voucher tidak valid atau telah kedaluwarsa.";
      if (axios.isAxiosError(err)) {
        const errors = err.response?.data?.errors as
          | Record<string, string[]>
          | undefined;
        const firstFieldErr = errors
          ? Object.values(errors)[0]?.[0]
          : undefined;
        msg = firstFieldErr || err.response?.data?.message || msg;
      }
      setAppliedVoucher(null);
      setDiscountPercent(0);
      setApiDiscountAmount(null);
      setVoucherError(msg);
      showToast("error", "Voucher Gagal", msg);
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
    if (!isAuthenticated) {
      showToast("error", "Login Diperlukan", "Silakan login terlebih dahulu untuk melakukan pembayaran.");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (checkoutItems.length === 0) {
      showToast("error", "Checkout Kosong", "Tidak ada item untuk dibayar.");
      return;
    }

    // 1. Create order in Laravel backend for ALL items in checkoutItems
    let targetOrderId = activeOrderId;
    let targetOrderNumber = activeOrderNumber;
    let primaryGatewayRef = "";

    const createdOrdersList: Array<{
      orderId: string;
      orderNumber: string;
      gatewayRef?: string;
      grossAmount: number;
    }> = [];

    if (activeOrderId && activeOrderNumber) {
      createdOrdersList.push({
        orderId: activeOrderId,
        orderNumber: activeOrderNumber,
        gatewayRef: activeReference || undefined,
        grossAmount: totalBelanja,
      });
    } else {
      // Loop through each item in checkoutItems to create real database orders
      for (const item of checkoutItems) {
        const isSubscription =
          item.itemType === "subscription" || String(item.id).startsWith("sub-");
        const rawProdId = Number(
          isSubscription
            ? item.subscriptionPlanId || item.productId || String(item.id).replace(/\D/g, "")
            : item.productId || item.id
        );
        const prodId = !isNaN(rawProdId) && rawProdId > 0 ? rawProdId : 1;

        try {
          const orderRes = await createOrderMutation.mutateAsync(
            isSubscription
              ? {
                  item_type: "subscription",
                  subscription_plan_id: prodId,
                }
              : {
                  item_type: "product",
                  product_id: prodId,
                }
          );

          if (orderRes?.data) {
            const oId = String(orderRes.data.id);
            const oNum = orderRes.data.order_number;

            if (!targetOrderId) {
              targetOrderId = oId;
              targetOrderNumber = oNum;
              setOrderDetails(oNum, oId);
            }

            let gRef = "";
            try {
              const payRes = await createPaymentMutation.mutateAsync({
                orderId: oId,
                paymentMethod: "midtrans",
              });
              if (payRes?.data) {
                const pData = payRes.data as unknown as Record<string, unknown> & {
                  gateway_reference?: string;
                  payment?: { gateway_reference?: string };
                };
                gRef =
                  pData.gateway_reference ||
                  pData.payment?.gateway_reference ||
                  "";
                if (!primaryGatewayRef && gRef) {
                  primaryGatewayRef = gRef;
                  setGatewayReference(gRef);
                }
              }
            } catch (payErr) {
              console.warn("Backend createPayment fallback:", payErr);
            }

            createdOrdersList.push({
              orderId: oId,
              orderNumber: oNum,
              gatewayRef: gRef,
              grossAmount: item.price,
            });
          }
        } catch (orderErr) {
          console.warn("Backend order creation error:", orderErr);
        }
      }

      // If voucher was entered, apply it to the first order
      if (appliedVoucher && targetOrderId) {
        try {
          const vRes = await applyVoucherMutation.mutateAsync({
            orderId: targetOrderId,
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

    // Trigger Payment
    if (selectedPayment === "midtrans") {
      try {
        setIsSnapLoading(true);
        const orderNumber =
          targetOrderNumber ||
          activeOrderNumber ||
          `GZG-${Date.now().toString().slice(-6)}`;

        showToast(
          "success",
          "Menyiapkan Transaksi",
          "Menghubungkan ke Midtrans Sandbox Gateway..."
        );

        let snapToken = "";
        let gatewayRef = primaryGatewayRef;

        // Attempt 1: Call Laravel backend payment endpoint to link primary order if not already obtained
        if (targetOrderId && !snapToken) {
          try {
            const paymentRes = await createPaymentMutation.mutateAsync({
              orderId: targetOrderId,
              paymentMethod: "midtrans",
            });
            if (paymentRes?.data) {
              const pData = paymentRes.data as unknown as Record<string, unknown> & {
                gateway?: { snap_token?: string };
                snap_token?: string;
                gateway_reference?: string;
                payment?: { gateway_reference?: string };
              };
              snapToken = pData.gateway?.snap_token || pData.snap_token || "";
              gatewayRef =
                gatewayRef ||
                pData.gateway_reference ||
                pData.payment?.gateway_reference ||
                "";
              if (gatewayRef) {
                setGatewayReference(gatewayRef);
              }
            }
          } catch (payErr) {
            console.warn("Backend createPayment fallback:", payErr);
          }
        }

        // Attempt 2: Next.js API /api/midtrans/token with orderNumber & customer info
        if (!snapToken) {
          const snapData = await createSnapToken({
            order_id: orderNumber,
            gross_amount: totalBelanja,
            items: checkoutItems.map((item) => ({
              id: item.productId || item.id,
              name: item.title,
              price: item.price,
              quantity: 1,
            })),
            customer_details: {
              first_name: authUser?.name || "Customer",
              email: authUser?.email || "customer@gamezygo.com",
            },
          });
          snapToken = snapData.token;
        }

        if (snapToken) {
          openSnap(snapToken, {
            onSuccess: async (result) => {
              isRedirectingAfterSuccessRef.current = true;
              clearCart();
              await clearCartApi().catch(() => null);
              try {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("gamezygo_checkout_items");
                }
              } catch {
                // ignore
              }

              // Save specific payment method from Midtrans result (e.g. Visa / Mastercard, QRIS, etc.)
              const pType = (result.payment_type || "").toLowerCase();
              let detectedMethod = "Visa / Mastercard";
              if (pType === "credit_card") {
                detectedMethod = "Visa / Mastercard";
              } else if (pType === "qris") {
                detectedMethod = "QRIS";
              } else if (pType === "gopay") {
                detectedMethod = "GoPay";
              } else if (pType === "shopeepay") {
                detectedMethod = "ShopeePay";
              } else if (pType === "bank_transfer") {
                const resObj = result as { bank?: string; va_numbers?: Array<{ bank?: string }> };
                const bankName = (resObj.bank || resObj.va_numbers?.[0]?.bank || "BCA").toUpperCase();
                detectedMethod = `${bankName} Virtual Account`;
              } else if (result.payment_type) {
                detectedMethod = result.payment_type;
              }

              try {
                if (typeof window !== "undefined") {
                  const existing = JSON.parse(
                    localStorage.getItem("gamezygo_order_payment_methods") || "{}"
                  );
                  if (targetOrderNumber) existing[targetOrderNumber] = detectedMethod;
                  if (targetOrderId) existing[targetOrderId] = detectedMethod;
                  if (result.order_id) existing[result.order_id] = detectedMethod;
                  createdOrdersList.forEach((o) => {
                    if (o.orderId) existing[o.orderId] = detectedMethod;
                    if (o.orderNumber) existing[o.orderNumber] = detectedMethod;
                    if (o.gatewayRef) existing[o.gatewayRef] = detectedMethod;
                  });
                  localStorage.setItem(
                    "gamezygo_order_payment_methods",
                    JSON.stringify(existing)
                  );
                }
              } catch {
                // ignore
              }

              // 1. Trigger backend order fulfillment proxy for ALL purchased games
              const ordersPayload =
                createdOrdersList.length > 0
                  ? createdOrdersList.map((o) => ({
                      order_id: o.orderNumber || o.orderId,
                      gateway_reference: o.gatewayRef,
                      gross_amount: o.grossAmount,
                    }))
                  : [
                      {
                        order_id:
                          targetOrderNumber || targetOrderId || result.order_id,
                        gateway_reference: gatewayRef || primaryGatewayRef,
                        gross_amount: totalBelanja,
                      },
                    ];

              try {
                await fetch("/api/midtrans/fulfill", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orders: ordersPayload,
                    order_id:
                      targetOrderNumber || targetOrderId || result.order_id,
                    gateway_reference: gatewayRef || primaryGatewayRef,
                    gross_amount: totalBelanja,
                    status_code: result.status_code || "200",
                    transaction_status: result.transaction_status || "settlement",
                    fraud_status: result.fraud_status || "accept",
                    payment_type: result.payment_type || "credit_card",
                  }),
                });
              } catch (fulfillErr) {
                console.warn("Proxy fulfillment error:", fulfillErr);
              }

              // 2. Synchronize payment status in backend for all items
              for (const ord of createdOrdersList) {
                const ref = ord.gatewayRef || ord.orderNumber || ord.orderId;
                if (ref) {
                  try {
                    await fetchPaymentStatus(ref);
                  } catch {
                    // ignore sync error
                  }
                }
              }

              // Invalidate React Query caches so Library, History, and Profile update immediately
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              queryClient.invalidateQueries({ queryKey: ["user-orders"] });
              queryClient.invalidateQueries({ queryKey: ["library"] });
              queryClient.invalidateQueries({ queryKey: ["user-library"] });
              queryClient.invalidateQueries({ queryKey: ["user-profile"] });
              queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
              queryClient.invalidateQueries({ queryKey: ["cart"] });

              showToast(
                "success",
                "Pembayaran Berhasil!",
                "Transaksi Midtrans berhasil diselesaikan. Akun game siap digunakan!"
              );
              setTimeout(() => {
                router.push("/checkout/success");
              }, 800);
            },
            onPending: (result) => {
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              queryClient.invalidateQueries({ queryKey: ["user-orders"] });
              showToast(
                "success",
                "Menunggu Pembayaran",
                `Transaksi pending [${result.order_id}]. Silakan selesaikan pembayaran di simulator.`
              );
            },
            onError: async (result) => {
              const failedOrdersPayload =
                createdOrdersList.length > 0
                  ? createdOrdersList.map((o) => ({
                      order_id: o.orderNumber || o.orderId,
                      gateway_reference: o.gatewayRef,
                      gross_amount: o.grossAmount,
                    }))
                  : [
                      {
                        order_id:
                          targetOrderNumber || targetOrderId || result.order_id,
                        gateway_reference: gatewayRef || primaryGatewayRef,
                        gross_amount: totalBelanja,
                      },
                    ];

              const rawTxStatus = (result.transaction_status || "").toLowerCase();
              const failedTxStatus =
                rawTxStatus === "expire"
                  ? "expire"
                  : rawTxStatus === "cancel"
                  ? "cancel"
                  : "deny";

              try {
                await fetch("/api/midtrans/fulfill", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orders: failedOrdersPayload,
                    order_id:
                      targetOrderNumber || targetOrderId || result.order_id,
                    gateway_reference: gatewayRef || primaryGatewayRef,
                    gross_amount: totalBelanja,
                    status_code: result.status_code || "202",
                    transaction_status: failedTxStatus,
                    fraud_status: result.fraud_status || "deny",
                    payment_type: result.payment_type || "credit_card",
                  }),
                });
              } catch (syncErr) {
                console.warn("Failed payment webhook sync error:", syncErr);
              }

              clearOrderDetails();
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              queryClient.invalidateQueries({ queryKey: ["user-orders"] });
              showToast(
                "error",
                "Pembayaran Gagal",
                result.status_message || "Transaksi ditolak atau gagal."
              );
            },
            onClose: () => {
              clearOrderDetails();
              showToast(
                "error",
                "Pembayaran Ditutup",
                "Anda menutup popup pembayaran sebelum transaksi selesai."
              );
            },
          });
        }
      } catch (err: unknown) {
        let msg = "Gagal memproses Midtrans Snap token.";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        showToast("error", "Midtrans Snap Error", msg);
      } finally {
        setIsSnapLoading(false);
      }
      return;
    }

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

    // Non-QRIS payment simulation (Midtrans Gateway)
    const currentMethod = "Midtrans Gateway";

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
  const handleSimulateSuccess = async () => {
    isRedirectingAfterSuccessRef.current = true;
    setQrisModalData(null);
    setActiveReference(null);
    clearCart();
    await clearCartApi().catch(() => null);
    queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    queryClient.invalidateQueries({ queryKey: ["library"] });
    queryClient.invalidateQueries({ queryKey: ["user-library"] });
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

  // Prevent flash of checkout content while verifying authentication or redirecting empty checkout
  if (
    !isAuthenticated ||
    !hasInitializedCheckout ||
    (!isCartLoading && checkoutItems.length === 0)
  ) {
    return (
      <StoreLayout activeNavId="toko" hideNavbar={true} hideSidebar={true}>
        <Head>
          <title>Checkout - Gamezygo</title>
        </Head>
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-20 py-10 flex flex-col gap-8">
          <Skeleton className="h-10 w-44" />
          <div className="grid grid-cols-1 lg:grid-cols-14 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <ListRowSkeleton key={idx} />
              ))}
            </div>
            <div className="lg:col-span-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col gap-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

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
        <div className="w-full border-b-gradient-secondary py-10 pb-4 mb-10 lg:mb-20 flex items-center justify-between">
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
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-14 gap-8 lg:gap-12 items-start w-full mb-24">
          {/* ======================================================
              LEFT COLUMN: Subheader (Total: N Items) + Items List
             ====================================================== */}
          <div className="lg:col-span-8 flex flex-col w-full">
            {/* Subheader: Total Items */}
            <div className="flex items-center justify-between mb-5 pb-6 border-b-gradient-secondary">
              <span className="text-body-sm text-gray-400">
                Total: {checkoutItems.length} Items
              </span>
              {activeOrderNumber && checkoutItems.length > 0 && (
                <span className="text-label-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Order #{activeOrderNumber}
                </span>
              )}
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4 w-full">
              {isCartLoading && checkoutItems.length === 0 ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <ListRowSkeleton key={idx} />
                ))
              ) : checkoutItems.length > 0 ? (
                checkoutItems.map((item, idx) => (
                  <div
                    key={`checkout-item-${item.id}-${idx}`}
                    className="w-full bg-surface-secondary-default rounded-lg p-2 flex items-center gap-4 transition-all duration-150 hover:border-white/10 select-none"
                  >
                    {/* Thumbnail Cover Game */}
                    <div className="w-16.25 h-17.5 rounded-md overflow-hidden shrink-0 bg-deep-blue-950 relative flex items-center justify-center">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          sizes="65px"
                          priority={idx === 0}
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-deep-blue-900/40 flex items-center justify-center text-gray-500">
                          <svg className="w-6 h-6 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
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
                ))
              ) : (
                <div className="w-full bg-surface-secondary-default rounded-lg p-8 flex flex-col items-center justify-center text-center gap-3 border border-white/5">
                  <p className="text-gray-400 text-body-sm">Keranjang checkout Anda kosong.</p>
                  <Button variant="secondary" size="sm" onClick={() => router.push("/store")}>
                    Jelajahi Toko
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================
              RIGHT COLUMN: "Detail Transaksi" Checkout Summary Card
             ====================================================== */}
          <div className="lg:col-span-6 w-full lg:sticky top-28">
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
                    disabled={
                      applyVoucherMutation.isPending ||
                      createOrderMutation.isPending
                    }
                  >
                    {applyVoucherMutation.isPending ||
                    createOrderMutation.isPending
                      ? "Memeriksa..."
                      : "Gunakan"}
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
                  isSnapLoading ||
                  createOrderMutation.isPending ||
                  createPaymentMutation.isPending ||
                  checkoutItems.length === 0
                }
                className="w-full flex items-center justify-center gap-2 py-3.5 "
              >
                <span>
                  {isSnapLoading
                    ? "Membuka Midtrans Snap..."
                    : createOrderMutation.isPending || createPaymentMutation.isPending
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
            <div className="bg-deep-blue-950/95 border border-white/15 rounded-2xl p-6 sm:p-8 w-full max-w-110 shadow-2xl backdrop-blur-xl relative flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
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
