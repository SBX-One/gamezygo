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
import { MOCK_ARCHIVED_CATALOG_ITEMS } from "@/features/admin/data/admin-catalog-mock-data";
import {
  INITIAL_CATALOG_FILTER_STATE,
  type AdminCatalogFilterState,
  type AdminCatalogItem,
} from "@/features/admin/types/admin-catalog.types";

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
  const [items, setItems] = React.useState<AdminCatalogItem[]>(
    MOCK_ARCHIVED_CATALOG_ITEMS
  );
  const [filters, setFilters] = React.useState<AdminCatalogFilterState>(
    INITIAL_CATALOG_FILTER_STATE
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    MOCK_ARCHIVED_CATALOG_ITEMS.map((item) => item.id) // Pre-checked per Image 3
  );
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
    return items
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

        // 3. Price Range Filter
        if (
          filters.priceRange[1] < 200000 &&
          item.price > filters.priceRange[1]
        ) {
          return false;
        }
        if (filters.priceRange[0] > 0 && item.price < filters.priceRange[0]) {
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
  }, [items, filters]);

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
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((sId) => sId !== id));
  };

  const handleUnarchiveAll = () => {
    // Unarchives all items -> turns to empty state per Image 5
    setItems([]);
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteModalState({ isOpen: true, type: "multiple" });
  };

  const handleConfirmDelete = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setDeleteModalState({ isOpen: false, type: "multiple" });
  };

  // Header Title: Breadcrumb "Katalog > Archived Product" (Image 1 & 5)
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-xs">
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

  // Top Bar Search & Filter (Image 1 & Image 4)
  const headerRight = (
    <AdminCatalogTopBar
      filters={filters}
      onFilterChange={setFilters}
      showStatusCheckboxes={false}
    />
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
            onViewArchived={() => router.push("/admin/catalog")}
            onEditProductSection={() => router.push("/admin/catalog/section")}
            onPoManagement={() => {
              // Action handler
            }}
          />

          {/* 2. Archived Catalog Table (Matching Image 2, 3, 5) */}
          <AdminArchivedCatalogTable
            items={filteredItems}
            totalGamesCount={90}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectItem={handleToggleSelectItem}
            onUnarchiveItem={handleUnarchiveItem}
            onUnarchiveAll={handleUnarchiveAll}
            onDeleteSelected={handleDeleteSelected}
            onAddNew={() => router.push("/admin/catalog/add")}
          />
        </div>

        {/* 3. Delete Confirmation Modal */}
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
