import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Pagination } from "@/components/ui/Pagination";
import {
  AdminVoucherTopBar,
  AdminVoucherTable,
  AdminVoucherAddEditModal,
  AdminVoucherDeleteModal,
} from "@/features/admin/components/vouchers";
import {
  INITIAL_VOUCHER_FILTER_STATE,
  type AdminVoucherItem,
  type AdminVoucherFilterState,
} from "@/features/admin/types/admin-voucher.types";
import {
  useAdminVouchers,
  useToggleVoucherStatus,
  useDeleteVoucher,
  useBatchDeleteVouchers,
  useUpdateVoucher,
  useCreateVoucher,
} from "@/hooks/use-admin-vouchers";
import type { AdminVoucherQueryParams } from "@/services/admin-voucher.service";
import { toast } from "@/stores/use-toast-store";

export default function AdminVouchersPage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<AdminVoucherFilterState>(
    INITIAL_VOUCHER_FILTER_STATE
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isDraftViewActive, setIsDraftViewActive] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AdminVoucherItem | null>(null);

  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    targetId?: string;
    voucherCode?: string;
    selectedCount?: number;
  }>({
    isOpen: false,
  });

  // Query parameters for backend
  const queryParams: AdminVoucherQueryParams = React.useMemo(() => {
    return {
      search: filters.searchQuery.trim() || undefined,
      status: isDraftViewActive ? "draft" : filters.status,
      sort_by: filters.sortBy,
      page: currentPage,
      per_page: 10,
    };
  }, [filters.searchQuery, filters.status, filters.sortBy, isDraftViewActive, currentPage]);

  // Live queries & mutations
  const { data: serverResponse, isLoading } = useAdminVouchers(queryParams);
  const toggleStatusMutation = useToggleVoucherStatus();
  const deleteMutation = useDeleteVoucher();
  const batchDeleteMutation = useBatchDeleteVouchers();
  const updateMutation = useUpdateVoucher();
  const createMutation = useCreateVoucher();

  const vouchers: AdminVoucherItem[] = React.useMemo(() => {
    return serverResponse?.data?.vouchers ?? [];
  }, [serverResponse?.data?.vouchers]);

  const totalPages = serverResponse?.data?.meta?.last_page || 1;
  const totalCount = serverResponse?.data?.meta?.total ?? vouchers.length;

  // Handlers
  const handleToggleStatus = async (id: string, active: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ id, isActive: active });
      toast.success(
        `Voucher berhasil ${active ? "diaktifkan" : "dinonaktifkan"}.`,
        "Status Voucher"
      );
    } catch {
      toast.error("Gagal mengubah status voucher.", "Gagal");
    }
  };

  const handleToggleSelectAll = () => {
    const visibleIds = vouchers.map((v) => v.id);
    const isAllVisibleSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    if (isAllVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleDraftView = () => {
    setIsDraftViewActive((prev) => !prev);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleAddNew = () => {
    router.push("/admin/vouchers/add");
  };

  const handleEditItem = (item: AdminVoucherItem) => {
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  const handleSaveVoucher = async (
    data: Omit<AdminVoucherItem, "id">,
    id?: string
  ) => {
    try {
      if (id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            code: data.code,
            discount_type: data.discountType === "percentage" ? "percentage" : "fixed",
            discount_amount: data.discountAmount,
            slot: data.usageLimit || 0,
            is_active: data.isActive,
          },
        });
        toast.success("Perubahan voucher berhasil disimpan.", "Voucher Updated");
      } else {
        await createMutation.mutateAsync({
          name: data.code,
          code: data.code,
          discount_type: data.discountType === "percentage" ? "percentage" : "fixed",
          discount_amount: data.discountAmount,
          slot: data.usageLimit || 0,
          is_active: data.isActive,
        });
        toast.success("Voucher baru berhasil dibuat.", "Voucher Created");
      }
      setIsAddEditModalOpen(false);
      setEditingItem(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan voucher.";
      toast.error(msg, "Gagal");
    }
  };

  const handleDeleteSingle = (id: string) => {
    const target = vouchers.find((v) => v.id === id);
    setDeleteModalState({
      isOpen: true,
      targetId: id,
      voucherCode: target?.code,
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteModalState({
      isOpen: true,
      selectedCount: selectedIds.length,
    });
  };

  const handleConfirmDelete = async () => {
    const { targetId, selectedCount } = deleteModalState;
    setDeleteModalState({ isOpen: false });

    try {
      if (targetId) {
        await deleteMutation.mutateAsync(targetId);
        setSelectedIds((prev) => prev.filter((id) => id !== targetId));
        toast.success("Voucher berhasil dihapus.", "Terhapus");
      } else if (selectedCount && selectedIds.length > 0) {
        await batchDeleteMutation.mutateAsync(selectedIds);
        setSelectedIds([]);
        toast.success(`${selectedCount} voucher berhasil dihapus.`, "Terhapus");
      }
    } catch {
      toast.error("Gagal menghapus voucher.", "Gagal");
    }
  };

  // HeaderRight content for top bar
  const headerRight = (
    <AdminVoucherTopBar
      filters={filters}
      onFilterChange={(newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
      }}
    />
  );

  return (
    <>
      <Head>
        <title>Voucher Management | Gamezygo Admin</title>
        <meta
          name="description"
          content="Admin Voucher Management Dashboard - Kelola diskon, promo dan kode voucher pelanggan"
        />
      </Head>

      <AdminLayout
        title="Voucher"
        activeNavId="voucher"
        headerRight={headerRight}
      >
        <div className="w-full space-y-6 pb-12 select-none">
          <AdminVoucherTable
            items={vouchers}
            totalVouchersCount={totalCount}
            selectedIds={selectedIds}
            isDraftViewActive={isDraftViewActive}
            isLoading={isLoading}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectItem={handleToggleSelectItem}
            onToggleStatus={handleToggleStatus}
            onAddNew={handleAddNew}
            onToggleDraftView={handleToggleDraftView}
            onBackFromDraft={() => {
              setIsDraftViewActive(false);
              setCurrentPage(1);
            }}
            onDeleteSelected={handleDeleteSelected}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteSingle}
          />

          {vouchers.length > 0 && totalPages > 1 && (
            <div className="pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        <AdminVoucherAddEditModal
          isOpen={isAddEditModalOpen}
          item={editingItem}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveVoucher}
        />

        <AdminVoucherDeleteModal
          isOpen={deleteModalState.isOpen}
          voucherCode={deleteModalState.voucherCode}
          selectedCount={deleteModalState.selectedCount}
          onClose={() => setDeleteModalState({ isOpen: false })}
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
