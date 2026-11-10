import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminPreOrderTable,
  AdminPreOrderAddModal,
  AdminPreOrderPublishModal,
} from "@/features/admin/components/preorder";
import { AdminCatalogDeleteModal } from "@/features/admin/components/catalog";
import {
  SearchIcon,
  CloseXIcon,
} from "@/features/admin/components/catalog/section/AdminSectionIcons";
import { cn } from "@/lib/utils";
import { FilterModal } from "@/components/ui/FilterModal";
import { Pagination } from "@/components/ui/Pagination";
import type { PreOrderItem } from "@/features/admin/types/admin-preorder.types";
import {
  useAdminCatalog,
  useUpdateProduct,
  useDeleteProducts,
  useCreateProduct,
} from "@/hooks/use-admin-catalog";
import { toast } from "@/stores/use-toast-store";

const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M13.5 16C13.6989 16 13.8897 16.079 14.0303 16.2197C14.171 16.3603 14.25 16.5511 14.25 16.75C14.25 16.9489 14.171 17.1397 14.0303 17.2803C13.8897 17.421 13.6989 17.5 13.5 17.5H10.5C10.3011 17.5 10.1103 17.421 9.96967 17.2803C9.82902 17.1397 9.75 16.9489 9.75 16.75C9.75 16.5511 9.82902 16.3603 9.96967 16.2197C10.1103 16.079 10.3011 16 10.5 16H13.5ZM16.5 11C16.6989 11 16.8897 11.079 17.0303 11.2197C17.171 11.3603 17.25 11.5511 17.25 11.75C17.25 11.9489 17.171 12.1397 17.0303 12.2803C16.8897 12.421 16.6989 12.5 16.5 12.5H7.5C7.30109 12.5 7.11032 12.421 6.96967 12.2803C6.82902 12.1397 6.75 11.9489 6.75 11.75C6.75 11.5511 6.82902 11.3603 6.96967 11.2197C7.11032 11.079 7.30109 11 7.5 11H16.5ZM19.5 6C19.6989 6 19.8897 6.07902 20.0303 6.21967C20.171 6.36032 20.25 6.55109 20.25 6.75C20.25 6.94891 20.171 7.13968 20.0303 7.28033C19.8897 7.42098 19.6989 7.5 19.5 7.5H4.5C4.30109 7.5 4.11032 7.42098 3.96967 7.28033C3.82902 7.13968 3.75 6.94891 3.75 6.75C3.75 6.55109 3.82902 6.36032 3.96967 6.21967C4.11032 6.07902 4.30109 6 4.5 6H19.5Z"
      fill="currentColor"
    />
  </svg>
);

const ClearIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function AdminPreOrdersPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<"terbaru" | "name_asc">("terbaru");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Live database hook for Pre-order products (PO Management)
  const {
    items: serverItems,
    totalProducts,
    meta,
    isLoading,
  } = useAdminCatalog({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchQuery.trim() || undefined,
    status: ["pre-order"],
    sort_by: sortBy === "name_asc" ? "a_z" : "latest",
  });

  const updateProductMutation = useUpdateProduct();
  const deleteMutation = useDeleteProducts();
  const createProductMutation = useCreateProduct();

  // Map server items to PreOrderItem
  const items: PreOrderItem[] = React.useMemo(() => {
    return (serverItems || []).map((p) => ({
      id: p.id,
      title: p.name,
      categories: p.categories,
      price: p.price,
      imageSrc: p.imageSrc,
      formattedPrice: `Rp ${p.price.toLocaleString("id-ID")}`,
      status: "pre-order" as const,
    }));
  }, [serverItems]);

  // Client-side category filtering if categories selected
  const filteredItems = React.useMemo(() => {
    if (selectedCategories.length === 0) return items;
    return items.filter((item) =>
      item.categories.some((c) => selectedCategories.includes(c))
    );
  }, [items, selectedCategories]);

  const totalPages = meta?.last_page || Math.max(1, Math.ceil(totalProducts / itemsPerPage));

  // Selection handlers
  const handleToggleSelectAll = () => {
    const currentPageIds = filteredItems.map((item) => item.id);
    const isAllCurrentSelected =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) => selectedIds.includes(id));

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
  const [editingItem, setEditingItem] = React.useState<PreOrderItem | null>(null);
  const [publishingItem, setPublishingItem] = React.useState<PreOrderItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | "selected" | null>(null);

  // Add / Edit Save Handler
  const handleSaveItem = (
    data: Omit<PreOrderItem, "id">,
    existingId?: string
  ) => {
    if (existingId) {
      updateProductMutation.mutate(
        {
          id: existingId,
          data: {
            name: data.title,
            price: data.price,
            genres: data.categories,
            status: "pre-order",
          },
        },
        {
          onSuccess: () => {
            toast.success("Game pre-order berhasil diperbarui!");
            setIsAddModalOpen(false);
            setEditingItem(null);
          },
          onError: () => {
            toast.error("Gagal memperbarui game pre-order.");
          },
        }
      );
    } else {
      createProductMutation.mutate(
        {
          name: data.title,
          price: data.price,
          genres: data.categories,
          status: "pre-order",
          is_preorder: true,
        },
        {
          onSuccess: () => {
            toast.success("Game pre-order berhasil ditambahkan!");
            setIsAddModalOpen(false);
          },
          onError: () => {
            toast.error("Gagal menambahkan game pre-order.");
          },
        }
      );
    }
  };

  // Publish / Continue to List Handler: Converts Pre-order to active listing in store!
  const handleConfirmPublish = async (item: PreOrderItem) => {
    try {
      await updateProductMutation.mutateAsync({
        id: item.id,
        data: {
          name: item.title,
          status: "listing", // publishes it into the regular active storefront catalog!
        },
      });
      toast.success(`Game "${item.title}" berhasil dipublikasikan ke toko!`);
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
      setPublishingItem(null);
    } catch {
      toast.error("Gagal mempublikasikan game ke toko.");
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    try {
      if (deleteTargetId === "selected" && selectedIds.length > 0) {
        await deleteMutation.mutateAsync(selectedIds);
        toast.success(`${selectedIds.length} game pre-order berhasil dihapus.`);
        setSelectedIds([]);
      } else if (deleteTargetId && deleteTargetId !== "selected") {
        await deleteMutation.mutateAsync([deleteTargetId]);
        toast.success("Game pre-order berhasil dihapus.");
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId));
      }
    } catch {
      toast.error("Gagal menghapus game pre-order.");
    }
    setDeleteTargetId(null);
  };

  const hasActiveFilters = selectedCategories.length > 0 || sortBy !== "terbaru";

  // Header Right Actions (Search & Filter)
  const headerRight = (
    <div className="relative flex items-center gap-3 sm:gap-4 select-none">
      {/* 1. Search Field */}
      <div className="relative flex items-center w-48 sm:w-64">
        <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari produk"
          className="w-full h-10 pl-9 pr-8 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Hapus pencarian"
            className="absolute right-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ClearIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Filter Icon Button */}
      <div className={cn("relative shrink-0", isFilterOpen && "z-30")}>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-label="Filter & Sort"
          className={cn(
            "h-10 w-10 rounded-lg border flex items-center justify-center transition-all cursor-pointer relative shrink-0",
            isFilterOpen || hasActiveFilters
              ? "bg-[#1E202B] border-gray-400 text-white"
              : "bg-deep-blue-900 border-deep-blue-700 text-gray-300 hover:text-white hover:border-gray-500"
          )}
        >
          <FilterIcon className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5364]" />
          )}
        </button>

        {/* 3. FilterModal Dropdown */}
        <FilterModal
          isOpen={isFilterOpen}
          variant="dropdown"
          placement="content"
          onClose={() => setIsFilterOpen(false)}
          title="Filter & Sort"
          categories={[]}
          genres={[
            "Action",
            "Adventure",
            "Sport-Racing",
            "Fighting",
            "RPG",
            "Multiplayer",
          ]}
          genresLabel="CATEGORY"
          launchers={[]}
          selectedGenres={selectedCategories}
          onToggleGenre={(cat) => {
            setSelectedCategories((prev) =>
              prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
            );
          }}
          sortOptions={["Terbaru", "Nama (A - Z)"]}
          selectedSort={sortBy === "name_asc" ? "Nama (A - Z)" : "Terbaru"}
          onSelectSort={(sort) => {
            setSortBy(sort === "Nama (A - Z)" ? "name_asc" : "terbaru");
          }}
          showPriceRange={false}
          showCancelButton={false}
          onReset={() => {
            setSelectedCategories([]);
            setSortBy("terbaru");
            setIsFilterOpen(false);
          }}
          onApply={() => setIsFilterOpen(false)}
          popoverClassName="w-80 sm:w-96 !h-auto max-h-[90vh] top-11 right-0 shadow-2xl"
        />
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Pre-order | Gamezygo Admin</title>
        <meta
          name="description"
          content="Pre-order Catalog Management Dashboard for Gamezygo Administration"
        />
      </Head>

      <AdminLayout
        title="Pre-order"
        activeNavId="pre-order"
        headerRight={headerRight}
      >
        <div className="space-y-6 pb-16">
          {/* Pre-order Table Card */}
          <AdminPreOrderTable
            items={filteredItems}
            totalCount={totalProducts || filteredItems.length}
            isLoading={isLoading}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectItem={handleToggleSelectItem}
            onAddNew={() => {
              router.push("/admin/catalog/add");
            }}
            onDeleteSelected={() => setDeleteTargetId("selected")}
            onEditItem={(item) => {
              router.push(`/admin/pre-orders/edit/${item.id}`);
            }}
            onDeleteItem={(id) => setDeleteTargetId(id)}
            onContinueToList={(item) => {
              router.push(`/admin/pre-orders/edit/${item.id}?action=list`);
            }}
          />

          {/* Section 3: Pagination Component */}
          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="justify-center pt-4"
            />
          )}
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

        {/* Modal: Delete Confirmation */}
        <AdminCatalogDeleteModal
          isOpen={Boolean(deleteTargetId)}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmDelete}
          title="Yakin ingin menghapus produk pre-order ini?"
          description="Produk yang dihapus tidak dapat dipulihkan kembali."
          confirmText="Hapus Produk"
        />
      </AdminLayout>
    </>
  );
}
