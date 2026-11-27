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
  AdminUserDetailSkeleton,
} from "@/features/admin/components/users";
import {
  MOCK_ADMIN_USERS,
  MOCK_ADMIN_USER_DETAIL,
} from "@/features/admin/data/admin-user-mock-data";
import type { AdminUserItem } from "@/features/admin/types/admin-user.types";
import {
  useAdminUserDetail,
  useUpdateUserStatus,
  useUpdateUser,
  useWipeUserSession,
} from "@/hooks/use-admin-users";
import { toast } from "@/stores/use-toast-store";

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
  const userId = typeof id === "string" ? id : "";

  // Live database hooks
  const { data: serverDetail, isLoading } = useAdminUserDetail(userId);
  const updateStatusMutation = useUpdateUserStatus();
  const wipeSessionMutation = useWipeUserSession();
  const updateUserMutation = useUpdateUser();

  // Drawer state for editing user (Points & Subs Duration)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);

  const user: AdminUserItem = React.useMemo(() => {
    if (serverDetail?.data) {
      return serverDetail.data;
    }
    const cleanId = userId.trim().toLowerCase();
    const hyphenId = cleanId.replace(/\s+/g, "-");
    const spaceId = cleanId.replace(/-/g, " ");
    const found = MOCK_ADMIN_USERS.find((u) => {
      const uId = u.id.toLowerCase();
      const uCustId = (u.customerId || "").toLowerCase();
      const uEmail = u.email.toLowerCase();
      return (
        uId === cleanId ||
        uId === hyphenId ||
        uId === spaceId ||
        uCustId === cleanId ||
        uEmail === cleanId
      );
    });
    return found || MOCK_ADMIN_USER_DETAIL;
  }, [serverDetail, userId]);

  // Actions
  const handleSuspend = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        id: userId,
        status: "Suspended",
      });
      toast.success(`Akun ${user.email} berhasil di-suspend.`, "Status Akun");
    } catch {
      toast.error("Gagal meng-suspend akun.", "Gagal");
    }
  };

  const handleBan = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        id: userId,
        status: "Banned",
      });
      toast.success(`Akun ${user.email} berhasil di-ban.`, "Status Akun");
    } catch {
      toast.error("Gagal meng-ban akun.", "Gagal");
    }
  };

  const handleWipe = async () => {
    try {
      await wipeSessionMutation.mutateAsync(userId);
      toast.success(
        `Data sesi dan cache login untuk ${user.email} berhasil di-wipe.`,
        "Sesi Dihapus"
      );
    } catch {
      toast.error("Gagal menghapus sesi akun.", "Gagal");
    }
  };

  const handleSaveUserEdit = async ({
    points,
    subsDuration,
  }: {
    points: number;
    subsDuration: string;
  }) => {
    try {
      const targetMonths = parseInt(subsDuration.replace(/[^\d]/g, ""), 10) || 0;
      const currentRaw = (user.subsDuration || "").toLowerCase();
      const currentNum = parseInt(currentRaw.replace(/[^\d]/g, ""), 10) || 0;
      const currentMonths =
        currentRaw.includes("month") || currentRaw.includes("bulan")
          ? currentNum
          : currentRaw.includes("day") || currentRaw.includes("hari")
          ? Math.floor(currentNum / 30)
          : 0;
      const durationAdjustment = targetMonths - currentMonths;

      const payload: Record<string, unknown> = { points };
      if (durationAdjustment !== 0) {
        payload.subscription_duration_adjustment = durationAdjustment;
      }

      const res = (await updateUserMutation.mutateAsync({
        id: userId,
        data: payload,
      })) as { data?: { subscription?: unknown } } | undefined;

      if (durationAdjustment !== 0 && !res?.data?.subscription) {
        toast.warning(
          "Pengguna ini belum memiliki langganan aktif, sehingga server tidak memperbarui durasi langganan.",
          "Langganan Belum Aktif"
        );
      } else {
        toast.success("Data pengguna berhasil diperbarui.", "Tersimpan");
      }
      setIsEditDrawerOpen(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memperbarui data pengguna.";
      toast.error(msg, "Gagal");
    }
  };

  // Header Title: "Pengguna > user123@test.com"
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/users"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Pengguna
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      {isLoading ? (
        <span className="w-36 h-4 rounded bg-white/10 animate-pulse inline-block align-middle" />
      ) : (
        <>
          <span className="text-white font-semibold">{user.email}</span>
          {user.customerId && (
            <span className="text-gray-400 font-mono text-[11px] bg-deep-blue-900 px-2 py-0.5 rounded border border-deep-blue-700">
              {user.customerId}
            </span>
          )}
        </>
      )}
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
        <div className="w-full space-y-6 select-none pb-12">
          {isLoading ? (
            <AdminUserDetailSkeleton />
          ) : (
            <>
              {/* 1. Profile Top Card */}
              <AdminUserProfileCard
                user={user}
                onSuspend={handleSuspend}
                onBan={handleBan}
                onWipe={handleWipe}
              />

              {/* 2. Three Metric Cards: LIFETIME VALUE, CURRENT POINTS, SUBS DURATION */}
              <AdminUserMetricsGrid
                user={user}
                onEditPoints={() => setIsEditDrawerOpen(true)}
                onEditSubsDuration={() => setIsEditDrawerOpen(true)}
              />

              {/* 3. TOTAL DEVICE LOGIN Table */}
              <AdminUserDeviceLoginsCard
                deviceLogins={user.deviceLogins || []}
              />

              {/* 4. TOTAL PRODUCT Table */}
              <AdminUserProductsCard
                products={user.products || []}
              />

              {/* 5. RECENT TRANSACTIONS Table */}
              <AdminUserRecentTransactionsCard
                transactions={user.recentTransactions || []}
              />
            </>
          )}
        </div>

        {/* Edit User Sidebar / Drawer */}
        <AdminUserEditDrawer
          isOpen={isEditDrawerOpen}
          user={user}
          onClose={() => setIsEditDrawerOpen(false)}
          onSave={handleSaveUserEdit}
        />
      </AdminLayout>
    </>
  );
}
