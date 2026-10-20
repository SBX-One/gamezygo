import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminUserProfileCard,
  AdminUserMetricsGrid,
  AdminUserDeviceLoginsCard,
  AdminUserProductsCard,
  AdminUserRecentTransactionsCard,
  AdminUserEditDrawer,
} from "@/features/admin/components/users";
import {
  MOCK_ADMIN_USERS,
  MOCK_ADMIN_USER_DETAIL,
} from "@/features/admin/data/admin-user-mock-data";
import type {
  AdminUserItem,
  UserStatus,
} from "@/features/admin/types/admin-user.types";

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function AdminUserDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Resolve user from mock data or fallback to MOCK_ADMIN_USER_DETAIL
  const [user, setUser] = React.useState<AdminUserItem>(MOCK_ADMIN_USER_DETAIL);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Drawer state for editing user (Points & Subs Duration)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);

  // Sync user when router.query.id changes
  React.useEffect(() => {
    if (id && typeof id === "string") {
      const cleanId = id.trim().toLowerCase();
      const hyphenId = cleanId.replace(/\s+/g, "-");
      const spaceId = cleanId.replace(/-/g, " ");
      const found = MOCK_ADMIN_USERS.find((u) => {
        const uId = u.id.toLowerCase();
        const uEmail = u.email.toLowerCase();
        return (
          uId === cleanId ||
          uId === hyphenId ||
          uId === spaceId ||
          uEmail === cleanId
        );
      });
      if (found) {
        setUser(found);
      }
    }
  }, [id]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Actions
  const handleSuspend = () => {
    setUser((prev) => ({ ...prev, status: "Suspended" }));
    showToast(`Akun ${user.email} berhasil di-suspend.`);
  };

  const handleBan = () => {
    setUser((prev) => ({ ...prev, status: "Banned" }));
    showToast(`Akun ${user.email} berhasil di-ban.`);
  };

  const handleWipe = () => {
    showToast(`Data sesi dan cache login untuk ${user.email} berhasil di-wipe.`);
  };

  const handleSaveUserEdit = ({
    points,
    subsDuration,
  }: {
    points: number;
    subsDuration: string;
  }) => {
    setUser((prev) => ({
      ...prev,
      points,
      subsDuration,
    }));
    showToast("Data pengguna berhasil diperbarui.");
  };

  // Header Title matching Image 1: "Pengguna > user123@test.com"
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-xs">
      <Link
        href="/admin/users"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Pengguna
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">{user.email}</span>
    </div>
  );

  return (
    <>
      <Head>
        <title>{`${user.username || user.email} | Detail Pengguna | Gamezygo Admin`}</title>
        <meta
          name="description"
          content={`Detail akun pengguna ${user.email} di Gamezygo Admin Dashboard`}
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="pengguna"
      >
        <div className="w-full space-y-6 select-none">
          {/* 1. Profile Top Card (Matching Image 2) */}
          <AdminUserProfileCard
            user={user}
            onSuspend={handleSuspend}
            onBan={handleBan}
            onWipe={handleWipe}
          />

          {/* 2. Three Metric Cards: LIFETIME VALUE, CURRENT POINTS, SUBS DURATION (Matching Image 2) */}
          <AdminUserMetricsGrid
            user={user}
            onEditPoints={() => setIsEditDrawerOpen(true)}
            onEditSubsDuration={() => setIsEditDrawerOpen(true)}
          />

          {/* 3. TOTAL DEVICE LOGIN Table (Matching Image 3) */}
          <AdminUserDeviceLoginsCard
            deviceLogins={user.deviceLogins || MOCK_ADMIN_USER_DETAIL.deviceLogins || []}
          />

          {/* 4. TOTAL PRODUCT Table (Matching Image 4) */}
          <AdminUserProductsCard
            products={user.products || MOCK_ADMIN_USER_DETAIL.products || []}
          />

          {/* 5. RECENT TRANSACTIONS Table (Matching Image 5) */}
          <AdminUserRecentTransactionsCard
            transactions={user.recentTransactions || MOCK_ADMIN_USER_DETAIL.recentTransactions || []}
          />
        </div>

        {/* Edit User Sidebar / Drawer (Matching User Screenshot) */}
        <AdminUserEditDrawer
          isOpen={isEditDrawerOpen}
          user={user}
          onClose={() => setIsEditDrawerOpen(false)}
          onSave={handleSaveUserEdit}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-deep-blue-950 border border-emerald-500/50 rounded-lg text-xs text-emerald-400">
            <svg
              className="w-4 h-4 shrink-0 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
