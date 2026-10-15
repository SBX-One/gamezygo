/**
 * Midtrans Payment Gateway Constants
 */

export const MIDTRANS_SNAP_SANDBOX_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
export const MIDTRANS_SNAP_PRODUCTION_URL = "https://app.midtrans.com/snap/snap.js";
export const MIDTRANS_API_SANDBOX_URL = "https://app.sandbox.midtrans.com/snap/v1/transactions";

export const IS_MIDTRANS_SANDBOX =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_SANDBOX !== "false";

export const MIDTRANS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
