/**
 * Formats raw payment method / gateway names into user-friendly payment labels
 * e.g. "midtrans", "credit_card", "qris", "bca_va" -> "Visa / Mastercard", "QRIS", "BCA Virtual Account"
 */
export function formatPaymentMethodLabel(rawMethod?: string | null): string {
  if (!rawMethod) return "Visa / Mastercard";
  const m = String(rawMethod).toLowerCase().trim();

  // Credit card / Visa / Mastercard / Midtrans default
  if (
    m === "midtrans" ||
    m === "credit_card" ||
    m === "credit card" ||
    m === "visa" ||
    m === "mastercard" ||
    m === "card"
  ) {
    return "Visa / Mastercard";
  }

  // QRIS
  if (m === "qris" || m.includes("qris")) {
    return "QRIS";
  }

  // E-Wallets
  if (m.includes("gopay")) return "GoPay";
  if (m.includes("shopeepay")) return "ShopeePay";
  if (m.includes("ovo")) return "OVO";
  if (m.includes("dana")) return "DANA";

  // Virtual Accounts / Bank transfers
  if (m.includes("bca")) return "BCA Virtual Account";
  if (m.includes("bni")) return "BNI Virtual Account";
  if (m.includes("bri")) return "BRI Virtual Account";
  if (m.includes("mandiri")) return "Mandiri Virtual Account";
  if (m.includes("permata")) return "Permata Virtual Account";
  if (m.includes("va") || m.includes("virtual") || m.includes("bank_transfer")) {
    return "Virtual Account";
  }

  // Capitalize neatly
  return rawMethod.charAt(0).toUpperCase() + rawMethod.slice(1);
}

