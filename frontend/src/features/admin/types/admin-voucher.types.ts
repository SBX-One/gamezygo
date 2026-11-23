export type VoucherRewardStatus = "active" | "inactive" | "expired" | "draft";

export interface AdminVoucherItem {
  id: string;
  code: string;
  usageCount: number;
  usageLimit?: number;
  discountAmount: number;
  discountType: "flat" | "percentage";
  percentageValue?: number;
  status: VoucherRewardStatus;
  isActive: boolean;
  validityPeriod: string; // e.g. "22/07/2026"
  expiresAt?: string;
  minPurchase?: number;
  description?: string;
  createdAt?: string;
}

export interface AdminVoucherFilterState {
  searchQuery: string;
  status: "all" | "active" | "inactive" | "expired" | "draft";
  sortBy: "terbaru" | "code_asc" | "value_desc" | "value_asc";
  isDraftOnly: boolean;
}

export const INITIAL_VOUCHER_FILTER_STATE: AdminVoucherFilterState = {
  searchQuery: "",
  status: "all",
  sortBy: "terbaru",
  isDraftOnly: false,
};

export interface VoucherTargetGame {
  id: string;
  title: string;
  imageSrc: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
}

export interface VoucherTargetUser {
  id: string;
  email: string;
  points?: string;
}

export interface AdminAddVoucherFormData {
  name: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  targetGames: VoucherTargetGame[];
  targetUsers: VoucherTargetUser[];
  minPurchaseAmount: string;
  maxUsage: string;
  limitPerUser: string;
  onlyForBundle?: boolean;
  applicableToBundle?: boolean;
  applicableToSubs?: boolean;
  startDate: string;
  endDate: string;
  durationPreset: string;
}

export function getInitialVoucherDates() {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return {
    startDate: formatDate(today),
    endDate: formatDate(nextWeek),
  };
}

export const DEFAULT_ADD_VOUCHER_FORM: AdminAddVoucherFormData = {
  name: "",
  code: "",
  discountType: "percentage",
  discountValue: "",
  targetGames: [],
  targetUsers: [],
  minPurchaseAmount: "",
  maxUsage: "",
  limitPerUser: "",
  onlyForBundle: false,
  applicableToBundle: true,
  applicableToSubs: true,
  startDate: "",
  endDate: "",
  durationPreset: "1 Minggu",
};
