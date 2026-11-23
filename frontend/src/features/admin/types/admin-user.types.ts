export type UserLoginType = "Google Account" | "Email & Password" | "Steam";
export type UserStatus = "Pending" | "Active" | "Suspended" | "Banned";

export interface AdminUserDeviceLogin {
  id: string;
  ipAddress: string; // e.g. "192.123.6767"
  device: string; // e.g. "Samsung J2 Prime"
  browser: string; // e.g. "Google Chrome"
  time: string; // e.g. "22/07/2026 16:39:40"
}

export interface AdminUserProduct {
  id: string;
  name: string; // e.g. "Grand Theft Auto VI"
  imageSrc?: string;
  transactionId: string; // e.g. "H27TG1G26G3N18U2-67"
  transactionDate: string; // e.g. "22/07/2026 16:39:40"
}

export interface AdminUserTransaction {
  id: string;
  transactionId: string; // e.g. "H27TG1G26G3N18U2-67"
  productName: string; // e.g. "Beholder : Conductor"
  paymentMethod: string; // e.g. "BCA"
  amount: number; // e.g. 480000
  formattedAmount: string; // e.g. "Rp 480.000"
  date: string; // e.g. "22/07/2026 16:39:40"
  status: "Pending" | "Completed" | "Failed";
}

export interface AdminUserItem {
  id: string; // Resource/database ID, e.g. "52"
  customerId?: string; // Display customer ID, e.g. "GZO-00000052"
  email: string; // e.g. "user123@test.com"
  username?: string; // e.g. "Cihuy67"
  name?: string;
  loginType: UserLoginType;
  points: number; // e.g. 128
  subscription: string; // e.g. "Paket 2", "Paket 1", "Paket 3", "Free"
  subsDuration?: string; // e.g. "2 months"
  lifetimeValue?: number; // e.g. 455000
  joinDate: string; // e.g. "22/07/2026"
  status: UserStatus; // "Pending" | "Active" | "Suspended" | "Banned"
  lastLogin: string; // e.g. "22/07/2026"
  avatarUrl?: string;
  phone?: string;
  totalOrders?: number;
  totalSpent?: number;
  deviceLogins?: AdminUserDeviceLogin[];
  products?: AdminUserProduct[];
  recentTransactions?: AdminUserTransaction[];
}

export interface AdminUserFilterState {
  searchQuery: string;
  bundle: string | null; // "Paket 1" | "Paket 2" | "Paket 3" | null
  status: "Active" | "Inactive" | null;
  loginType: "Google Account" | "Email" | null;
  minPoints: number;
  maxPoints: number;
  sortBy: "terbaru" | "name_asc";
}

export const INITIAL_USER_FILTER_STATE: AdminUserFilterState = {
  searchQuery: "",
  bundle: null,
  status: null,
  loginType: null,
  minPoints: 0,
  maxPoints: 999,
  sortBy: "terbaru",
};
