import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminCatalogTopBar,
  AdminCatalogActionButtons,
  AdminCatalogTable,
  AdminCatalogAddModal,
  AdminCatalogDeleteModal,
} from "@/features/admin/components/catalog";
import {
  MOCK_ADMIN_CATALOG_ITEMS,
} from "@/features/admin/data/admin-catalog-mock-data";
import {
  INITIAL_CATALOG_FILTER_STATE,
  type AdminCatalogFilterState,
  type AdminCatalogItem,
} from "@/features/admin/types/admin-catalog.types";

export default function AdminCatalogPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<AdminCatalogItem[]>(
    MOCK_ADMIN_CATALOG_ITEMS
  );
  const [filters, setFilters] = React.useState<AdminCatalogFilterState>(
    INITIAL_CATALOG_FILTER_STATE
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AdminCatalogItem | null>(
    null
  );
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    type: "single" | "multiple";
    targetId?: string;
    itemTitle?: string;
  }>({
    isOpen: false,
    type: "single",
  });

  // Filter & sort logic
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

        // 2. Status Checkboxes (Pre-order, Draft, Unlisted)
        if (filters.isPreOrder && !item.isPreOrder) return false;
        if (filters.isDraft && !item.isDraft) return false;
        if (filters.isUnlisted && !item.isUnlisted) return false;

        // 3. Category Filter
        if (
          filters.categories.length > 0 &&
          !item.categories.some((c) => filters.categories.includes(c))
        ) {
          return false;
        }

        // 4. Status Filter (Active from modal)
        if (filters.statusActive !== null && item.isActive !== filters.statusActive) {
          return false;
        }

        // 5. Price Range
        if (filters.priceRange[1] < 200000 && item.price > filters.priceRange[1]) {
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
        return 0; // Default: Order as defined
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

  const handleToggleStatus = (id: string, active: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: active } : item))
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteModalState({ isOpen: true, type: "multiple" });
  };

  const handleDeleteItem = (id: string) => {
    const target = items.find((i) => i.id === id);
    setDeleteModalState({
      isOpen: true,
      type: "single",
      targetId: id,
      itemTitle: target?.name,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.type === "single" && deleteModalState.targetId) {
      const id = deleteModalState.targetId;
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((sId) => sId !== id));
    } else if (deleteModalState.type === "multiple") {
      setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    }
    setDeleteModalState({ isOpen: false, type: "single" });
  };

  const handleArchiveItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isUnlisted: true, isActive: false } : item
      )
    );
  };

  const handleSaveItem = (
    itemData: Omit<AdminCatalogItem, "id">,
    id?: string
  ) => {
    if (id) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...itemData } : item))
      );
    } else {
      const created: AdminCatalogItem = {
        ...itemData,
        id: `prod-${Date.now()}`,
      };
      setItems((prev) => [created, ...prev]);
    }
  };

  // HeaderRight content for top bar (desktop only)
  const headerRight = (
    <div className="hidden sm:flex items-center">
      <AdminCatalogTopBar
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );

  return (
    <>
      <Head>
        <title>Katalog Management | Gamezygo Admin</title>
        <meta
          name="description"
          content="Catalog and product management dashboard for Gamezygo administration"
        />
      </Head>

      <AdminLayout
        title="Katalog"
        activeNavId="katalog"
        headerRight={headerRight}
      >
        <div className="space-y-6">
          {/* 1. Three Action Buttons (Figma Image 2) */}
          <AdminCatalogActionButtons
            onViewArchived={() => router.push("/admin/catalog/archived")}
            onEditProductSection={() => router.push("/admin/catalog/section")}
            onPoManagement={() =>
              setFilters((prev) => ({
                ...prev,
                isPreOrder: !prev.isPreOrder,
              }))
            }
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

          {/* 3. Catalog Table Card (Figma Image 3 & Image 4) */}
          <AdminCatalogTable
            items={filteredItems}
            totalGamesCount={90}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectItem={handleToggleSelectItem}
            onToggleStatus={handleToggleStatus}
            onAddNew={() => {
              router.push("/admin/catalog/add");
            }}
            onDeleteSelected={handleDeleteSelected}
            onEditItem={(item) => {
              router.push(`/admin/catalog/edit/${item.id}`);
            }}
            onDeleteItem={handleDeleteItem}
            onArchiveItem={handleArchiveItem}
          />
        </div>

        {/* 3. Add / Edit Product Modal */}
        <AdminCatalogAddModal
          isOpen={isAddModalOpen}
          initialData={editingItem}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
        />

        {/* 4. Delete Confirmation Modal (matching user image) */}
        <AdminCatalogDeleteModal
          isOpen={deleteModalState.isOpen}
          onClose={() =>
            setDeleteModalState((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={handleConfirmDelete}
          title={
            deleteModalState.type === "multiple"
              ? `Are you sure to delete ${selectedIds.length} selected products?`
              : "Are you sure to delete this product?"
          }
          description="If you delete this file you can’t recover it."
        />
      </AdminLayout>
    </>
  );
}
