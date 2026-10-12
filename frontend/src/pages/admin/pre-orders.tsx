import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminPreOrderTable,
  AdminPreOrderAddModal,
  AdminPreOrderPublishModal,
} from "@/features/admin/components/preorder";
import { AdminCatalogDeleteModal } from "@/features/admin/components/catalog/AdminCatalogDeleteModal";
import {
  SearchIcon,
  CloseXIcon,
  FilterTaperIcon,
} from "@/features/admin/components/catalog/section/AdminSectionIcons";
import { Pagination } from "@/components/ui/Pagination";
import { MOCK_PREORDER_ITEMS } from "@/features/admin/data/admin-preorder-mock-data";
import type { PreOrderItem } from "@/features/admin/types/admin-preorder.types";

export default function AdminPreOrdersPage() {
  const [items, setItems] = React.useState<PreOrderItem[]>(MOCK_PREORDER_ITEMS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Filter items by search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  // Pagination calculation (25 pages as shown in Image 4)
  const totalPages = Math.max(25, Math.ceil(filteredItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Selection handlers
  const handleToggleSelectAll = () => {
    const currentPageIds = currentItems.map((item) => item.id);
    const isAllCurrentSelected = currentPageIds.every((id) =>
      selectedIds.includes(id)
    );

    if (isAllCurrentSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PreOrderItem | null>(
    null
  );
  const [publishingItem, setPublishingItem] =
    React.useState<PreOrderItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState<
    string | "selected" | null
  >(null);

  // Add / Edit Save Handler
  const handleSaveItem = (
    data: Omit<PreOrderItem, "id">,
    existingId?: string
  ) => {
    if (existingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === existingId ? { ...item, ...data } : item
        )
      );
    } else {
      const newItem: PreOrderItem = {
        ...data,
        id: `preorder-${Date.now()}`,
      };
      setItems((prev) => [newItem, ...prev]);
    }
  };

  // Publish / Continue to List Handler
  const handleConfirmPublish = (item: PreOrderItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
    setPublishingItem(null);
  };

  // Delete Handler
  const handleConfirmDelete = () => {
    if (deleteTargetId === "selected") {
      setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    } else if (deleteTargetId) {
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId));
    }
    setDeleteTargetId(null);
  };

  // Header Right Actions (Image 1: Search "Cari produk" + Filter button)
  const headerRight = (
    <div className="flex items-center gap-2.5 sm:gap-3">
      {/* Search Input */}
      <div className="relative flex items-center bg-deep-blue-900 border border-deep-blue-700 focus-within:border-deep-blue-500 rounded-xl px-3.5 py-2 w-48 sm:w-64 transition-colors">
        <SearchIcon className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari produk"
          className="w-full bg-transparent text-gray-50 text-xs sm:text-sm placeholder:text-gray-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="p-0.5 text-gray-400 hover:text-gray-50 transition-colors cursor-pointer shrink-0"
            aria-label="Bersihkan pencarian"
          >
            <CloseXIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Button (Image 1) */}
      <button
        type="button"
        title="Filter"
        className="p-2.5 rounded-xl border border-deep-blue-700 bg-deep-blue-900 text-gray-400 hover:text-gray-50 hover:bg-deep-blue-850 transition-colors cursor-pointer shrink-0"
      >
        <FilterTaperIcon className="w-4 h-4" />
      </button>
    </div>
  );

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Pre-order | Gamezygo Admin</title>
        <meta
          name="description"
          content="Pre-order Catalog Management Dashboard for Gamezygo"
        />
      </Head>

      <AdminLayout
        title="Pre-order"
        activeNavId="pre-order"
        headerRight={headerRight}
      >
        <div className="space-y-6 pb-16">
          {/* Section 1: Pre-order Table Card (Image 2 & Image 3) */}
          <AdminPreOrderTable
            items={currentItems}
            totalCount={items.length}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectItem={handleToggleSelectItem}
            onAddNew={() => {
              router.push("/admin/catalog/add");
            }}
            onDeleteSelected={() => setDeleteTargetId("selected")}
            onEditItem={(item) => {
              router.push(`/admin/catalog/edit/${item.id}`);
            }}
            onDeleteItem={(id) => setDeleteTargetId(id)}
            onContinueToList={(item) => setPublishingItem(item)}
          />

          {/* Section 2: Separated Pagination Component (Image 4) */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="justify-center pt-4"
          />
        </div>

        {/* Modal: Add or Edit Pre-order Game */}
        <AdminPreOrderAddModal
          isOpen={isAddModalOpen}
          item={editingItem}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
        />

        {/* Modal: Continue to List */}
        <AdminPreOrderPublishModal
          isOpen={Boolean(publishingItem)}
          item={publishingItem}
          onClose={() => setPublishingItem(null)}
          onConfirm={handleConfirmPublish}
        />

        {/* Modal: Delete Confirmation (Matching Image 3) */}
        <AdminCatalogDeleteModal
          isOpen={Boolean(deleteTargetId)}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmDelete}
          title="Are you sure to delete this product?"
          description="If you delete this file you can't recover it."
        />
      </AdminLayout>
    </>
  );
}
