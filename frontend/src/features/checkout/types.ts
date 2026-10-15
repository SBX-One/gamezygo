import type { MidtransSnapResult, MidtransSnapOptions } from "@/types/midtrans";

export interface SnapOrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

export interface SnapCustomerDetails {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
}

export interface CreateSnapTokenPayload {
  order_id: string;
  gross_amount: number;
  items?: SnapOrderItem[];
  customer_details?: SnapCustomerDetails;
}

export interface CreateSnapTokenResponse {
  token: string;
  redirect_url: string;
}

export type { MidtransSnapResult, MidtransSnapOptions };
