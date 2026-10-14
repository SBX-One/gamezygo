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
import { MOCK_ADMIN_VOUCHERS } from "@/features/admin/data/admin-voucher-mock-data";
import {
  INITIAL_VOUCHER_FILTER_STATE,
  type AdminVoucherItem,
  type AdminVoucherFilterState,
} from "@/features/admin/types/admin-voucher.types";

export default function AdminVouchersPage() {
  const router = useRouter();
  const [vouchers, setVouchers] = React.useState<AdminVoucherItem[]>(
    MOCK_ADMIN_VOUCHERS
  );
  const [filters, setFilters] = React.useState<AdminVoucherFilterState>(
    INITIAL_VOUCHER_FILTER_STATE
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isDraftViewActive, setIsDraftViewActive] = React.useState<boolean>(false);

  // Pagination state (Matching Image 4: < 1 2 3 4 5 ... 25 >)
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const totalPages = 25; // 25 pages as shown in Image 4

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

  // Filter & Sort Logic
  const filteredVouchers = React.useMemo(() => {
    return vouchers
      .filter((item) => {
        // 1. Search Query
        if (
          filters.searchQuery.trim() &&
          !item.code
            .toLowerCase()
            .includes(filters.searchQuery.trim().toLowerCase())
        ) {
          return false;
        }

        // 2. Draft Button Toggle View (Image 5)
        if (isDraftViewActive && item.status !== "draft") {
          return false;
        }

        // 3. Status Filter from TopBar Popover
        if (filters.status !== "all" && item.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "code_asc") {
          return a.code.localeCompare(b.code);
        }
        if (filters.sortBy === "value_desc") {
          return b.discountAmount - a.discountAmount;
        }
        if (filters.sortBy === "value_asc") {
          return a.discountAmount - b.discountAmount;
        }
        return 0; // Default: terbaru / original order
      });
  }, [vouchers, filters, isDraftViewActive]);

  // Handlers
  const handleToggleStatus = (id: string, active: boolean) => {
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              isActive: active,
              status: active ? "active" : "inactive",
            }
          : v
      )
    );
  };

  const handleToggleSelectAll = () => {
    const visibleIds = filteredVouchers.map((v) => v.id);
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
  };

  const handleAddNew = () => {
    router.push("/admin/vouchers/add");
  };

  const handleEditItem = (item: AdminVoucherItem) => {
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  const handleSaveVoucher = (
    data: Omit<AdminVoucherItem, "id">,
    id?: string
  ) => {
    if (id) {
      setVouchers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...data } : v))
      );
    } else {
      const newVoucher: AdminVoucherItem = {
        ...data,
        id: `vouch-${Date.now()}`,
      };
      setVouchers((prev) => [newVoucher, ...prev]);
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

  const handleConfirmDelete = () => {
    const { targetId, selectedCount } = deleteModalState;

    if (targetId) {
      setVouchers((prev) => prev.filter((v) => v.id !== targetId));
      setSelectedIds((prev) => prev.filter((id) => id !== targetId));
    } else if (selectedCount) {
      setVouchers((prev) => prev.filter((v) => !selectedIds.includes(v.id)));
      setSelectedIds([]);
    }
  };

  // HeaderRight content for top bar (Matching Image 1: Cari voucher + Filter Button)
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

      {/* AdminLayout provides the Top Navigation Header with Toggle Icon + Divider + "Voucher" (Image 1) */}
      <AdminLayout
        title="Voucher"
        activeNavId="voucher"
        headerRight={headerRight}
      >
        <div className="w-full space-y-6 pb-12 select-none">
          {/* Main Voucher Table Card (Matching Image 2, Image 3 & Image 5) */}
          <AdminVoucherTable
            items={filteredVouchers}
            totalVouchersCount={105}
            selectedIds={selectedIds}
            isDraftViewActive={isDraftViewActive}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectItem={handleToggleSelectItem}
            onToggleStatus={handleToggleStatus}
            onAddNew={handleAddNew}
            onToggleDraftView={handleToggleDraftView}
            onBackFromDraft={() => setIsDraftViewActive(false)}
            onDeleteSelected={handleDeleteSelected}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteSingle}
          />

          {/* Pagination Component (Matching Image 4: < 1 2 3 4 5 ... 25 >) */}
          {filteredVouchers.length > 0 && (
            <div className="pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {/* Add / Edit Voucher Modal */}
        <AdminVoucherAddEditModal
          isOpen={isAddEditModalOpen}
          item={editingItem}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveVoucher}
        />

        {/* Delete Confirmation Modal */}
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
