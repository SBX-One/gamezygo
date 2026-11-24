import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminCatalogTopBar,
  AdminCatalogActionButtons,
  AdminArchivedCatalogTable,
  AdminCatalogDeleteModal,
} from "@/features/admin/components/catalog";
import {
  INITIAL_CATALOG_FILTER_STATE,
  type AdminCatalogFilterState,
} from "@/features/admin/types/admin-catalog.types";
import {
  useAdminArchivedCatalog,
  useToggleProductStatus,
  useBatchArchiveStatus,
  useDeleteProducts,
} from "@/hooks/use-admin-catalog";
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

export default function AdminArchivedProductPage() {
  const router = useRouter();

  // 1. Live archived catalog data from backend API
  const {
    items: serverItems,
    isLoading,
    totalArchived,
  } = useAdminArchivedCatalog();

  const toggleStatusMutation = useToggleProductStatus();
  const batchArchiveMutation = useBatchArchiveStatus();
  const deleteMutation = useDeleteProducts();

  const [filters, setFilters] = React.useState<AdminCatalogFilterState>(
    INITIAL_CATALOG_FILTER_STATE
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    type: "single" | "multiple";
    targetId?: string;
  }>({
    isOpen: false,
    type: "multiple",
  });

  // Filter & sort logic matching Image 4
  const filteredItems = React.useMemo(() => {
    return serverItems
      .filter((item) => {
        // 1. Search Query
        if (
          filters.searchQuery.trim() &&
          !item.name
            .toLowerCase()
            .includes(filters.searchQuery.trim().toLowerCase())
        ) {
          return false;
        }

        // 2. Categories Filter
        if (
          filters.categories.length > 0 &&
          !item.categories.some((c) => filters.categories.includes(c))
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [serverItems, filters]);

  // Handlers
  const handleToggleSelectAll = () => {
    if (filteredItems.every((item) => selectedIds.includes(item.id))) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const handleToggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sId) => sId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleUnarchiveItem = (id: string) => {
    setSelectedIds((prev) => prev.filter((sId) => sId !== id));
    toggleStatusMutation.mutate(
      { productId: id, isActive: true },
      {
        onSuccess: () => {
          toast.success("Game berhasil dikembalikan ke katalog aktif!");
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Gagal mengembalikan game ke katalog.";
          toast.error(msg);
        },
      }
    );
  };

  const handleUnarchiveAll = () => {
    if (serverItems.length === 0) return;
    const allIds = serverItems.map((item) => item.id);
    setSelectedIds([]);
    batchArchiveMutation.mutate(
      { ids: allIds, isActive: true },
      {
        onSuccess: () => {
          toast.success("Semua game berhasil dikembalikan ke katalog aktif!");
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Gagal mengembalikan game ke katalog.";
          toast.error(msg);
        },
      }
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteModalState({ isOpen: true, type: "multiple" });
  };

  const handleConfirmDelete = () => {
    const idsToDelete = [...selectedIds];
    setSelectedIds([]);
    deleteMutation.mutate(idsToDelete, {
      onSuccess: () => {
        toast.success(
          `${idsToDelete.length} game berhasil dihapus permanen dari arsip.`
        );
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Gagal menghapus game terpilih.";
        toast.error(msg);
      },
    });
    setDeleteModalState({ isOpen: false, type: "multiple" });
  };

  // Header Title: Breadcrumb "Katalog > Archived Product" (Image 1 & 5)
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/catalog"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Katalog
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Archived Product</span>
    </div>
  );

  // Top Bar Search & Filter (desktop only)
  const headerRight = (
    <div className="hidden sm:flex items-center">
      <AdminCatalogTopBar
        filters={filters}
        onFilterChange={setFilters}
        showStatusCheckboxes={false}
      />
    </div>
  );

  return (
    <>
      <Head>
        <title>Archived Product | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola produk game yang diarsipkan pada Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="katalog"
        headerRight={headerRight}
      >
        <div className="space-y-6">
          {/* 1. Three Action Buttons (Matching Image 5) */}
          <AdminCatalogActionButtons
            activeButton="archived"
            onViewArchived={() => router.push("/admin/catalog")}
            onEditProductSection={() => router.push("/admin/catalog/section")}
            onPoManagement={() => router.push("/admin/pre-orders")}
          />

          {/* 2. Mobile-Only Search & Filter Bar (Placed below the 3 Action Buttons per user request) */}
          <div className="sm:hidden w-full">
            <AdminCatalogTopBar
              filters={filters}
              onFilterChange={setFilters}
              showStatusCheckboxes={false}
              isMobileInline
            />
          </div>

          {/* 3. Archived Catalog Table (Matching Image 2, 3, 5) */}
          <AdminArchivedCatalogTable
            items={filteredItems}
            totalGamesCount={totalArchived}
            isLoading={isLoading}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectItem={handleToggleSelectItem}
            onUnarchiveItem={handleUnarchiveItem}
            onUnarchiveAll={handleUnarchiveAll}
            onDeleteSelected={handleDeleteSelected}
            onAddNew={() => router.push("/admin/catalog/add")}
          />
        </div>

        {/* 4. Delete Confirmation Modal */}
        <AdminCatalogDeleteModal
          isOpen={deleteModalState.isOpen}
          onClose={() =>
            setDeleteModalState((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={handleConfirmDelete}
          title={`Are you sure to delete ${selectedIds.length} selected products?`}
          description="If you delete this file you can’t recover it."
        />
      </AdminLayout>
    </>
  );
}
