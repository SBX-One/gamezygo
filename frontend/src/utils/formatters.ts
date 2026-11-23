/**
 * Pure helper utility formatters for Gamezygo
 */

/**
 * Format numeric amount into Indonesian Rupiah currency format
 * Example: 439000 -> "Rp 439.000"
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Rp 0";
  }
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

/**
 * Format discount number into string discount badge
 * Example: 30 -> "-30%"
 */
export function formatDiscount(discount: number | null | undefined): string {
  if (!discount || discount <= 0) return "";
  return `-${Math.round(discount)}%`;
}

/**
 * Format ISO date string into Indonesian localized date
 * Example: "2026-09-07T10:00:00+08:00" -> "7 September 2026"
 */
export function formatDate(
  dateInput: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return "-";
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat(
      "id-ID",
      options || {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(date);
  } catch {
    return "-";
  }
}

/**
 * Format points number into "X pts"
 * Example: 999 -> "999 pts"
 */
export function formatPoints(points: number | null | undefined): string {
  if (points === null || points === undefined) return "0 pts";
  return `${points.toLocaleString("id-ID")} pts`;
}
