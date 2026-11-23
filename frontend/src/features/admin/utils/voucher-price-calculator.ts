/**
 * Utility helper to calculate discount percentage and discounted price
 * for a game based on the voucher's discount type & value.
 */

export function calculateDiscountedGamePrice(
  originalPrice: number,
  discountType: "percentage" | "fixed",
  discountValue: number | string
): { discountPercentage: number; discountedPrice: number } {
  const orig = Math.max(0, Number(originalPrice) || 0);

  let num = 0;
  if (typeof discountValue === "number") {
    num = Math.max(0, discountValue);
  } else if (typeof discountValue === "string") {
    const cleaned = discountValue.replace(/[^0-9]/g, "");
    num = cleaned ? Number(cleaned) : 0;
  }

  if (orig <= 0) {
    return { discountPercentage: 0, discountedPrice: 0 };
  }

  if (num <= 0) {
    return { discountPercentage: 0, discountedPrice: orig };
  }

  if (discountType === "percentage") {
    const pct = Math.min(100, Math.max(0, Math.round(num)));
    const discountAmount = Math.round((orig * pct) / 100);
    const discounted = Math.max(0, orig - discountAmount);
    return { discountPercentage: pct, discountedPrice: discounted };
  } else {
    // Fixed amount discount (IDR)
    const discountAmount = Math.min(orig, Math.round(num));
    const discounted = Math.max(0, orig - discountAmount);
    const pct =
      orig > 0
        ? Math.min(100, Math.max(0, Math.round((discountAmount / orig) * 100)))
        : 0;
    return { discountPercentage: pct, discountedPrice: discounted };
  }
}

