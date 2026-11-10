import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Pagination } from "@/components/ui/Pagination";
import {
  AdminCatalogTopBar,
  AdminCatalogActionButtons,
  AdminCatalogTable,
  AdminCatalogAddModal,
  AdminCatalogDeleteModal,
} from "@/features/admin/components/catalog";
import { MOCK_ADMIN_CATALOG_ITEMS } from "@/features/admin/data/admin-catalog-mock-data";
import {
  INITIAL_CATALOG_FILTER_STATE,
  type AdminCatalogFilterState,
  type AdminCatalogItem,
} from "@/features/admin/types/admin-catalog.types";
import {
  useAdminCatalog,
  useToggleProductStatus,
  useDeleteProducts,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/use-admin-catalog";
import { toast } from "@/stores/use-toast-store";

export default function AdminCatalogPage() {
  const router = useRouter();

  const [filters, setFilters] = React.useState<AdminCatalogFilterState>(
    INITIAL_CATALOG_FILTER_STATE
  );
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AdminCatalogItem | null>(null);
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    type: "single" | "multiple";
    targetId?: string;
    itemTitle?: string;
  }>({
    isOpen: false,
    type: "single",
  });

  const [currentPage, setCurrentPage] = React.useState(1);

  // Live database catalog hook
  const {
    items: serverItems,
    totalProducts,
    meta,
    isLoading,
    isError,
  } = useAdminCatalog({
    page: currentPage,
    per_page: 20,
    search: filters.searchQuery.trim() || undefined,
    sort_by: filters.sortBy === "name_asc" ? "a_z" : "latest",
  });

  const toggleStatusMutation = useToggleProductStatus();
  const deleteMutation = useDeleteProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  // Live database items
  const items = React.useMemo(() => serverItems || [], [serverItems]);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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

  /**
   * Switch toggle on the far left column:
   * Sets whether the game is actively listed in the user store catalog (status = 'listing')
   * or archived/hidden (status = 'archive').
   */
  const handleToggleStatus = (id: string, active: boolean) => {
    toggleStatusMutation.mutate(
      {
        productId: id,
        isActive: active,
      },
      {
        onSuccess: () => {
          toast.success(
            active
              ? "Game berhasil diaktifkan dan tampil di toko!"
              : "Game dinonaktifkan."
          );
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Gagal mengubah status game.";
          toast.error(msg);
        },
      }
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
      setSelectedIds((prev) => prev.filter((sId) => sId !== id));

      deleteMutation.mutate([id], {
        onSuccess: () => {
          toast.success("Game berhasil dihapus.");
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Gagal menghapus game.";
          toast.error(msg);
        },
      });
    } else if (deleteModalState.type === "multiple" && selectedIds.length > 0) {
      const idsToDelete = [...selectedIds];
      setSelectedIds([]);

      deleteMutation.mutate(idsToDelete, {
        onSuccess: () => {
          toast.success(`${idsToDelete.length} game berhasil dihapus.`);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Gagal menghapus game terpilih.";
          toast.error(msg);
        },
      });
    }
    setDeleteModalState({ isOpen: false, type: "single" });
  };

  const handleArchiveItem = (id: string) => {
    toggleStatusMutation.mutate(
      {
        productId: id,
        isActive: false,
      },
      {
        onSuccess: () => {
          toast.success("Game berhasil dipindahkan ke arsip.");
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Gagal mengarsipkan game.";
          toast.error(msg);
        },
      }
    );
  };

  const handleSaveItem = (
    itemData: Omit<AdminCatalogItem, "id">,
    id?: string
  ) => {
    if (id) {
      updateProductMutation.mutate(
        {
          id,
          data: {
            name: itemData.name,
            price: itemData.price,
            genres: itemData.categories,
          },
        },
        {
          onSuccess: () => {
            toast.success("Game berhasil diperbarui!");
          },
          onError: () => {
            toast.error("Gagal memperbarui game.");
          },
        }
      );
    } else {
      createProductMutation.mutate(
        {
          name: itemData.name,
          price: itemData.price,
          genres: itemData.categories,
        },
        {
          onSuccess: () => {
            toast.success("Game berhasil ditambahkan ke katalog!");
          },
          onError: () => {
            toast.error("Gagal menambahkan game ke katalog.");
          },
        }
      );
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
          {/* 1. Three Action Buttons (View Archived, Edit Section, PO Management) */}
          <AdminCatalogActionButtons
            onViewArchived={() => router.push("/admin/catalog/archived")}
            onEditProductSection={() => router.push("/admin/catalog/section")}
            onPoManagement={() => router.push("/admin/pre-orders")}
          />

          {/* 2. Mobile-Only Search & Filter Bar */}
          <div className="sm:hidden w-full">
            <AdminCatalogTopBar
              filters={filters}
              onFilterChange={setFilters}
              showStatusCheckboxes={false}
              isMobileInline
            />
          </div>

          {/* 3. Catalog Table Card */}
          <AdminCatalogTable
            items={filteredItems}
            totalGamesCount={totalProducts || filteredItems.length}
            isLoading={isLoading}
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

          {/* 4. Separated Centered Pagination Component */}
          {filteredItems.length > 0 && (
            <div className="flex justify-center pt-2 pb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={
                  meta?.last_page ||
                  Math.max(1, Math.ceil((totalProducts || filteredItems.length) / 20))
                }
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>

        {/* Add / Edit Product Modal */}
        <AdminCatalogAddModal
          isOpen={isAddModalOpen}
          initialData={editingItem}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
        />

        {/* Delete Confirmation Modal */}
        <AdminCatalogDeleteModal
          isOpen={deleteModalState.isOpen}
          onClose={() =>
            setDeleteModalState((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={handleConfirmDelete}
          title={
            deleteModalState.type === "multiple"
              ? `Yakin ingin menghapus ${selectedIds.length} produk terpilih?`
              : "Yakin ingin menghapus produk ini?"
          }
          description="Produk yang dihapus tidak dapat dipulihkan."
        />
      </AdminLayout>
    </>
  );
}
