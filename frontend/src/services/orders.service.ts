import { apiGet, apiPost, apiDelete, API_BASE_URL } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiPaginatedResponse,
  OrderResponse,
  OrderDetailResponse,
  VoucherApplyResponse,
  PaymentResponse,
} from "@/types";

export interface OrderItemPayload {
  item_type: "product" | "subscription" | string;
  product_id?: number;
  subscription_plan_id?: number;
}

export interface CreateOrderPayload {
  item_type?: "product" | "subscription" | string;
  product_id?: number;
  subscription_plan_id?: number;
  items?: OrderItemPayload[];
}

export interface UserOrderQueryParams {
  page?: number;
  status?: string;
  search?: string;
}

/**
 * Fetch all user orders with pagination & filters
 * Endpoint: GET /api/v1/user/orders
 */
export async function fetchUserOrders(
  params?: UserOrderQueryParams
): Promise<
  ApiResponse<OrderDetailResponse[]> | ApiPaginatedResponse<OrderDetailResponse>
> {
  const queryParts: string[] = [];
  if (params?.page) queryParts.push(`page=${params.page}`);
  if (params?.status)
    queryParts.push(`status=${encodeURIComponent(params.status)}`);
  if (params?.search)
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  const qs = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

  return apiGet<ApiResponse<OrderDetailResponse[]>>(`/user/orders${qs}`);
}

/**
 * Create a new order
 * Endpoint: POST /api/v1/user/orders
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<ApiResponse<OrderResponse>> {
  return apiPost<ApiResponse<OrderResponse>, CreateOrderPayload>(
    "/user/orders",
    payload
  );
}

/**
 * Fetch single order details by orderId/order_number
 * Endpoint: GET /api/v1/user/orders/:orderId/
 */
export async function fetchOrderDetail(
  orderId: string
): Promise<ApiResponse<OrderDetailResponse>> {
  return apiGet<ApiResponse<OrderDetailResponse>>(`/user/orders/${orderId}`);
}

/**
 * Apply a voucher to an existing order
 * Endpoint: POST /api/v1/user/orders/:orderId/voucher
 */
export async function applyVoucher(
  orderId: string,
  voucherCode: string
): Promise<ApiResponse<VoucherApplyResponse>> {
  return apiPost<ApiResponse<VoucherApplyResponse>, { voucher_code: string }>(
    `/user/orders/${orderId}/voucher`,
    { voucher_code: voucherCode }
  );
}

/**
 * Remove an applied voucher from an order
 * Endpoint: DELETE /api/v1/user/orders/:orderId/voucher
 */
export async function removeVoucher(
  orderId: string
): Promise<ApiResponse<VoucherApplyResponse>> {
  return apiDelete<ApiResponse<VoucherApplyResponse>>(
    `/user/orders/${orderId}/voucher`
  );
}

/**
 * Trigger payment creation (e.g. QRIS)
 * Endpoint: POST /api/v1/user/orders/:orderId/payments
 */
export async function createPayment(
  orderId: string,
  paymentMethod: string = "qris"
): Promise<ApiResponse<PaymentResponse>> {
  return apiPost<ApiResponse<PaymentResponse>, { payment_method: string }>(
    `/user/orders/${orderId}/payments`,
    { payment_method: paymentMethod }
  );
}

/**
 * Check payment status by gateway reference
 * Endpoint (user.php): GET /api/v1/user/payments/:reference/status
 */
export async function fetchPaymentStatus(
  reference: string
): Promise<ApiResponse<OrderDetailResponse>> {
  return apiGet<ApiResponse<OrderDetailResponse>>(
    `/user/payments/${reference}/status`
  );
}

/**
 * Subscribe to realtime payment status updates via Server-Sent Events (SSE)
 * Endpoint: GET /api/v1/user/payments/:reference/stream
 */
export function subscribePaymentSSE(
  reference: string,
  onMessage: (data: OrderDetailResponse) => void,
  onError?: (err: Event) => void
): () => void {
  if (typeof window === "undefined" || !("EventSource" in window)) {
    return () => {};
  }

  const url = `${API_BASE_URL}/user/payments/${reference}/stream`;

  try {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed?.data) {
          onMessage(parsed.data);
        } else if (parsed?.status) {
          onMessage(parsed);
        }
      } catch (err) {
        console.error("Failed to parse SSE payment data:", err);
      }
    };

    eventSource.onerror = (err) => {
      onError?.(err);
    };

    return () => {
      eventSource.close();
    };
  } catch (err) {
    console.error("SSE not supported or failed to initialize:", err);
    return () => {};
  }
}
