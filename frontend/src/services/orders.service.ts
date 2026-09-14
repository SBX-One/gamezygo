import { apiGet, apiPost, apiDelete } from "@/lib/api-client";
import type {
  ApiResponse,
  OrderResponse,
  OrderDetailResponse,
  VoucherApplyResponse,
  PaymentResponse,
} from "@/types";

export interface CreateOrderPayload {
  item_type: "product" | string;
  product_id: number;
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
  return apiGet<ApiResponse<OrderDetailResponse>>(`/user/orders/${orderId}/`);
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
 * Endpoint: GET /api/v1/user/orders/payments/:reference
 */
export async function fetchPaymentStatus(
  reference: string
): Promise<ApiResponse<OrderDetailResponse>> {
  return apiGet<ApiResponse<OrderDetailResponse>>(
    `/user/orders/payments/${reference}`
  );
}
