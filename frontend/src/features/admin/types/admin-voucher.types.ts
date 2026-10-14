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

export const DEFAULT_ADD_VOUCHER_FORM: AdminAddVoucherFormData = {
  name: "",
  code: "",
  discountType: "percentage",
  discountValue: "IDR 150,000",
  targetGames: [],
  targetUsers: [],
  minPurchaseAmount: "IDR 200,000",
  maxUsage: "Unlimited",
  limitPerUser: "Unlimited",
  onlyForBundle: false,
  applicableToBundle: true,
  applicableToSubs: true,
  startDate: "08/09/2026",
  endDate: "15/09/2026",
  durationPreset: "1 Minggu",
};
