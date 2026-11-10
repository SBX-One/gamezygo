import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminUsersTable,
  AdminUsersHeaderSearch,
  AdminUserDetailModal,
} from "@/features/admin/components/users";
import { Pagination } from "@/components/ui/Pagination";
import { MOCK_ADMIN_USERS } from "@/features/admin/data/admin-user-mock-data";
import {
  INITIAL_USER_FILTER_STATE,
  type AdminUserItem,
  type AdminUserFilterState,
  type UserStatus,
} from "@/features/admin/types/admin-user.types";
import {
  useAdminUsers,
  useUpdateUserStatus,
} from "@/hooks/use-admin-users";
import type { AdminUserQueryParams } from "@/services/admin-user.service";
import { toast } from "@/stores/use-toast-store";

export default function AdminUsersPage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<AdminUserFilterState>(
    INITIAL_USER_FILTER_STATE
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedUser, setSelectedUser] = React.useState<AdminUserItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState<boolean>(false);

  // Query params
  const queryParams: AdminUserQueryParams = React.useMemo(() => {
    return {
      search: filters.searchQuery.trim() || undefined,
      bundle: filters.bundle || undefined,
      status: filters.status || undefined,
      login_type: filters.loginType || undefined,
      min_points: filters.minPoints,
      max_points: filters.maxPoints,
      sort_by: filters.sortBy,
      page: currentPage,
      per_page: 15,
    };
  }, [filters, currentPage]);

  // Live queries & mutations
  const { data: serverResponse, isLoading } = useAdminUsers(queryParams);
  const updateStatusMutation = useUpdateUserStatus();

  const users: AdminUserItem[] = React.useMemo(() => {
    if (serverResponse?.data?.users && serverResponse.data.users.length > 0) {
      return serverResponse.data.users;
    }
    // Fallback if no database users exist yet
    if (!serverResponse && !isLoading) {
      return MOCK_ADMIN_USERS;
    }
    return serverResponse?.data?.users ?? [];
  }, [serverResponse, isLoading]);

  const totalPages = serverResponse?.data?.meta?.last_page || 1;

  // Status update handler
  const handleUpdateStatus = async (userId: string, newStatus: UserStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: userId,
        status: newStatus,
      });
      toast.success(
        `Status pengguna ${userId} berhasil diubah ke ${newStatus}.`,
        "Status Diperbarui"
      );
      setIsDetailModalOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error(`Gagal mengubah status pengguna ${userId}.`, "Gagal");
    }
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
            onChange={(query) => {
              setFilters((prev) => ({ ...prev, searchQuery: query }));
              setCurrentPage(1);
            }}
            onClear={() => {
              setFilters((prev) => ({ ...prev, searchQuery: "" }));
              setCurrentPage(1);
            }}
            filters={filters}
            onApplyFilters={(updated) => {
              setFilters(updated);
              setCurrentPage(1);
            }}
            onResetFilters={() => {
              setFilters(INITIAL_USER_FILTER_STATE);
              setCurrentPage(1);
            }}
          />
        }
      >
        <div className="w-full space-y-6 pb-12 select-none">
          {/* Main User Table Component */}
          <AdminUsersTable
            users={users}
            isLoading={isLoading}
            onSelectUser={(user) => {
              router.push(`/admin/users/${user.id}`);
            }}
          />

          {/* Pagination Component */}
          {!isLoading && totalPages > 1 && (
            <div className="pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

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
        </div>
      </AdminLayout>
    </>
  );
}
