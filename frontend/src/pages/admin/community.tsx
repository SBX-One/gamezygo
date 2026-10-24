import * as React from "react";
import Head from "next/head";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminCommunityTopBar,
  AdminCommunityCard,
  AdminCommunityDrawer,
  AdminCommunityDeleteModal,
  AdminCommunityEmptyState,
} from "@/features/admin/components/community";
import { MOCK_ADMIN_COMMUNITIES } from "@/features/admin/data/admin-community-mock-data";
import type {
  AdminCommunityItem,
  CommunityPlatformTag,
} from "@/features/admin/types/admin-community.types";

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function AdminCommunityPage() {
  // Empty state by default on first load as requested ("buat empaty state nya terlebih dahulu")
  const [communities, setCommunities] = React.useState<AdminCommunityItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] =
    React.useState<CommunityPlatformTag>("All");

  // Drag and Drop State
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = React.useState<number | null>(null);
  const [dropPosition, setDropPosition] = React.useState<"top" | "bottom" | null>(
    null
  );

  // Drawer & Modal states
  const [drawerState, setDrawerState] = React.useState<{
    isOpen: boolean;
    item?: AdminCommunityItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    item?: AdminCommunityItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load from localStorage on mount (hydration safe)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gamezygo_admin_communities");
      if (stored) {
        const parsed: AdminCommunityItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCommunities(parsed);
        }
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (updated: AdminCommunityItem[]) => {
    setCommunities(updated);
    try {
      localStorage.setItem("gamezygo_admin_communities", JSON.stringify(updated));
    } catch {
      // LocalStorage fallback
    }
  };

  // Filtered list based on search query & platform tag
  const filteredCommunities = React.useMemo(() => {
    return communities.filter((item) => {
      // Filter by tag
      if (
        selectedTag !== "All" &&
        !item.tag.toLowerCase().includes(selectedTag.toLowerCase())
      ) {
        return false;
      }
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesTag = item.tag.toLowerCase().includes(query);
        const matchesLink = item.pageLink.toLowerCase().includes(query);
        return matchesName || matchesTag || matchesLink;
      }
      return true;
    });
  }, [communities, searchQuery, selectedTag]);

  // Drag and drop handlers
  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedIdx === null || draggedIdx === index) {
      setDragOverIdx(null);
      setDropPosition(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const isTopHalf = offsetY < rect.height / 2;

    setDragOverIdx(index);
    setDropPosition(isTopHalf ? "top" : "bottom");
  };

  const handleDragLeave = (index: number) => {
    if (dragOverIdx === index) {
      setDragOverIdx(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (targetIdx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      setDropPosition(null);
      return;
    }

    // Map filtered items back to main list
    const sourceItem = filteredCommunities[draggedIdx];
    const targetItem = filteredCommunities[targetIdx];
    if (!sourceItem || !targetItem) return;

    const next = [...communities];
    const sourceIndex = next.findIndex((c) => c.id === sourceItem.id);
    if (sourceIndex === -1) return;

    // Remove source item
    const [moved] = next.splice(sourceIndex, 1);

    // Find target index in the new array
    const targetIndexInNext = next.findIndex((c) => c.id === targetItem.id);
    if (targetIndexInNext === -1) return;

    // Compute insertion position
    const insertIndex =
      dropPosition === "bottom" ? targetIndexInNext + 1 : targetIndexInNext;
    next.splice(insertIndex, 0, moved);

    // Re-index order numbers
    const reindexed = next.map((item, i) => ({
      ...item,
      orderNumber: i + 1,
    }));

    saveToStorage(reindexed);
    showToast("Urutan komunitas berhasil diubah!");

    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropPosition(null);
  };

  // Create or Edit community
  const handleSaveDrawer = (data: {
    name: string;
    pageLink: string;
    tag: string;
    imageUrl: string;
  }) => {
    if (drawerState.item) {
      // Edit existing
      const updated = communities.map((item) =>
        item.id === drawerState.item?.id
          ? {
              ...item,
              name: data.name,
              pageLink: data.pageLink,
              tag: data.tag,
              imageUrl: data.imageUrl,
            }
          : item
      );
      saveToStorage(updated);
      showToast("Komunitas berhasil diperbarui!");
    } else {
      // Create new
      const newItem: AdminCommunityItem = {
        id: `comm-${Date.now()}`,
        name: data.name,
        pageLink: data.pageLink,
        tag: data.tag,
        imageUrl: data.imageUrl,
        orderNumber: communities.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      saveToStorage([newItem, ...communities]);
      showToast("Komunitas baru berhasil ditambahkan!");
    }
    setDrawerState({ isOpen: false, item: null });
  };

  // Delete community
  const handleConfirmDelete = () => {
    if (deleteModalState.item) {
      const updated = communities.filter(
        (item) => item.id !== deleteModalState.item?.id
      );
      saveToStorage(updated);
      showToast("Komunitas berhasil dihapus!");
    }
    setDeleteModalState({ isOpen: false, item: null });
  };

  // Reload action: restores mock data or resets filters
  const handleReload = () => {
    setSearchQuery("");
    setSelectedTag("All");
    if (communities.length === 0) {
      saveToStorage(MOCK_ADMIN_COMMUNITIES);
      showToast("Data komunitas berhasil dimuat!");
    } else {
      showToast("Filter pencarian direset!");
    }
  };

  return (
    <>
      <Head>
        <title>Komunitas | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola grup komunitas Gamezygo (Whatsapp, Telegram, Discord)"
        />
      </Head>

      <AdminLayout title="Komunitas" activeNavId="komunitas">
        {/* Toast Feedback Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-emerald-500/40 text-emerald-300 text-label-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-150 shadow-xl">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="w-full pb-16 flex flex-col gap-6 select-none font-sans">
          {/* Main Container Card matching Images 1, 2, 3, 4 */}
          <div className="w-full flex flex-col gap-5">
            {/* Top Toolbar matching Image 2 */}
            <AdminCommunityTopBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
              onAddNew={() => setDrawerState({ isOpen: true, item: null })}
            />

            {/* List or Empty State matching Images 3 and 4 */}
            {filteredCommunities.length === 0 ? (
              <AdminCommunityEmptyState onReload={handleReload} />
            ) : (
              <div className="flex flex-col gap-3 sm:gap-3.5 w-full">
                {filteredCommunities.map((item, index) => (
                  <AdminCommunityCard
                    key={item.id}
                    item={item}
                    index={index}
                    isDragging={draggedIdx === index}
                    dropPosition={dragOverIdx === index ? dropPosition : null}
                    onEdit={(itemToEdit) =>
                      setDrawerState({ isOpen: true, item: itemToEdit })
                    }
                    onDelete={(itemToDelete) =>
                      setDeleteModalState({ isOpen: true, item: itemToDelete })
                    }
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Slide-over Drawer for New / Edit Community matching Images 3 & 4 */}
        <AdminCommunityDrawer
          isOpen={drawerState.isOpen}
          item={drawerState.item}
          onClose={() => setDrawerState({ isOpen: false, item: null })}
          onSave={handleSaveDrawer}
        />

        {/* Delete Confirmation Modal */}
        <AdminCommunityDeleteModal
          isOpen={deleteModalState.isOpen}
          item={deleteModalState.item}
          onClose={() => setDeleteModalState({ isOpen: false, item: null })}
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
