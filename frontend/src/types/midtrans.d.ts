/**
 * Midtrans Snap JS SDK Type Definitions
 */

export interface MidtransSnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status:
    | "capture"
    | "settlement"
    | "pending"
    | "deny"
    | "expire"
    | "cancel";
  fraud_status?: string;
  va_numbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  bca_va_number?: string;
  permata_va_number?: string;
  bill_key?: string;
  biller_code?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface MidtransSnapOptions {
  onSuccess?: (result: MidtransSnapResult) => void;
  onPending?: (result: MidtransSnapResult) => void;
  onError?: (result: MidtransSnapResult) => void;
  onClose?: () => void;
}

export interface MidtransSnap {
  pay: (snapToken: string, options?: MidtransSnapOptions) => void;
  embed?: (
    snapToken: string,
    options: { embedId: string } & MidtransSnapOptions
  ) => void;
}

declare global {
  interface Window {
    snap?: MidtransSnap;
  }
}
