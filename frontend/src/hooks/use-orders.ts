import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  fetchOrderDetail,
  fetchUserOrders,
  applyVoucher,
  removeVoucher,
  createPayment,
  fetchPaymentStatus,
  type CreateOrderPayload,
  type UserOrderQueryParams,
} from "@/services/orders.service";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  list: (params?: UserOrderQueryParams) =>
    [...ORDER_KEYS.all, "list", params] as const,
  detail: (orderId: string) => [...ORDER_KEYS.all, "detail", orderId] as const,
  paymentStatus: (reference: string) =>
    [...ORDER_KEYS.all, "payment", reference] as const,
};

/**
 * Hook to fetch user orders list
 */
export function useUserOrders(params?: UserOrderQueryParams) {
  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => fetchUserOrders(params),
  });
}

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: (res) => {
      if (res?.data?.id) {
        queryClient.invalidateQueries({
          queryKey: ORDER_KEYS.detail(String(res.data.id)),
        });
      }
    },
  });
}

/**
 * Hook to fetch order details
 */
export function useOrderDetail(orderId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ORDER_KEYS.detail(orderId),
    queryFn: () => fetchOrderDetail(orderId),
    enabled: Boolean(orderId) && (options?.enabled ?? true),
  });
}

/**
 * Hook to apply voucher to an order
 */
export function useApplyVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      voucherCode,
    }: {
      orderId: string;
      voucherCode: string;
    }) => applyVoucher(orderId, voucherCode),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(vars.orderId) });
    },
  });
}

/**
 * Hook to remove voucher from an order
 */
export function useRemoveVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => removeVoucher(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(orderId) });
    },
  });
}

/**
 * Hook to create payment transaction (QRIS)
 */
export function useCreatePayment() {
  return useMutation({
    mutationFn: ({
      orderId,
      paymentMethod = "qris",
    }: {
      orderId: string;
      paymentMethod?: string;
    }) => createPayment(orderId, paymentMethod),
  });
}

/**
 * Hook to check payment status by gateway reference (with optional polling)
 */
export function usePaymentStatus(
  reference: string,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  return useQuery({
    queryKey: ORDER_KEYS.paymentStatus(reference),
    queryFn: () => fetchPaymentStatus(reference),
    enabled: Boolean(reference) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
  });
}
