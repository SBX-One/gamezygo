import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminUsersTable,
  AdminUsersHeaderSearch,
  AdminUserDetailModal,
} from "@/features/admin/components/users";
import { MOCK_ADMIN_USERS } from "@/features/admin/data/admin-user-mock-data";
import {
  INITIAL_USER_FILTER_STATE,
  type AdminUserItem,
  type AdminUserFilterState,
  type UserStatus,
} from "@/features/admin/types/admin-user.types";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = React.useState<AdminUserItem[]>(MOCK_ADMIN_USERS);
  const [filters, setFilters] = React.useState<AdminUserFilterState>(
    INITIAL_USER_FILTER_STATE
  );
  const [selectedUser, setSelectedUser] = React.useState<AdminUserItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Search & Filter & Sort Logic
  const filteredUsers = React.useMemo(() => {
    let result = [...users];

    // 1. Search Query
    const q = filters.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((user) => {
        return (
          user.id.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          (user.name && user.name.toLowerCase().includes(q)) ||
          user.loginType.toLowerCase().includes(q) ||
          user.subscription.toLowerCase().includes(q) ||
          user.status.toLowerCase().includes(q) ||
          user.joinDate.toLowerCase().includes(q) ||
          user.lastLogin.toLowerCase().includes(q)
        );
      });
    }

    // 2. Bundle Filter (Paket 1, Paket 2, Paket 3)
    if (filters.bundle) {
      result = result.filter((user) => user.subscription === filters.bundle);
    }

    // 3. Status Filter (Active / Inactive)
    if (filters.status) {
      if (filters.status === "Active") {
        result = result.filter((user) => user.status === "Active");
      } else {
        result = result.filter(
          (user) => user.status === "Pending" || user.status === "Suspended"
        );
      }
    }

    // 4. Login Type Filter (Google Account / Email)
    if (filters.loginType) {
      if (filters.loginType === "Google Account") {
        result = result.filter((user) => user.loginType === "Google Account");
      } else if (filters.loginType === "Email") {
        result = result.filter((user) => user.loginType.includes("Email"));
      }
    }

    // 5. Points Range Slider Filter
    result = result.filter(
      (user) =>
        user.points >= filters.minPoints && user.points <= filters.maxPoints
    );

    // 6. Sort By
    if (filters.sortBy === "name_asc") {
      result.sort((a, b) => {
        const nameA = a.name || a.email;
        const nameB = b.name || b.email;
        return nameA.localeCompare(nameB);
      });
    }

    return result;
  }, [users, filters]);

  // Status update handler
  const handleUpdateStatus = (userId: string, newStatus: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    setToastMessage(`Status pengguna ${userId} berhasil diubah ke ${newStatus}.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Pengguna | Gamezygo Admin</title>
        <meta
          name="description"
          content="Manajemen Data Pengguna dan Pelanggan Gamezygo Admin Dashboard"
        />
      </Head>

      <AdminLayout
        title="Pengguna"
        activeNavId="pengguna"
        headerRight={
          <AdminUsersHeaderSearch
            value={filters.searchQuery}
            onChange={(query) => setFilters((prev) => ({ ...prev, searchQuery: query }))}
            onClear={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
            filters={filters}
            onApplyFilters={(updated) => setFilters(updated)}
            onResetFilters={() => setFilters(INITIAL_USER_FILTER_STATE)}
          />
        }
      >
        <div className="w-full space-y-4">
          {/* Main User Table Component matching the screenshot */}
          <AdminUsersTable
            users={filteredUsers}
            onSelectUser={(user) => {
              router.push(`/admin/users/${user.id}`);
            }}
          />

          {/* User Detail & Status Change Modal */}
          <AdminUserDetailModal
            isOpen={isDetailModalOpen}
            user={selectedUser}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedUser(null);
            }}
            onUpdateStatus={handleUpdateStatus}
          />

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-deep-blue-950 border border-emerald-500/50 rounded-lg text-label-xs text-emerald-400">
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
        </div>
      </AdminLayout>
    </>
  );
}
