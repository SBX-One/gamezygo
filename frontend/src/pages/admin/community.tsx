import * as React from "react";
import Head from "next/head";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminCommunityTopBar,
  AdminCommunityCard,
  AdminCommunityDrawer,
  AdminCommunityDeleteModal,
  AdminCommunityEmptyState,
  type AdminCommunityDrawerSaveData,
} from "@/features/admin/components/community";
import type {
  AdminCommunityItem,
  CommunityPlatformTag,
} from "@/features/admin/types/admin-community.types";
import {
  useAdminCommunities,
  useAdminCommunityTags,
  useCreateAdminCommunity,
  useUpdateAdminCommunity,
  useUpdateAdminCommunityStatus,
  useSortAdminCommunities,
  useDeleteAdminCommunity,
} from "@/hooks/use-admin-communities";
import { toast } from "@/stores/use-toast-store";

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: {
      data?: { message?: string; errors?: Record<string, string[]> };
    };
    message?: string;
  };
  const firstValidation = err?.response?.data?.errors
    ? Object.values(err.response.data.errors)[0]?.[0]
    : undefined;
  return (
    firstValidation ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

const DEFAULT_TAGS = [
  "WhatsApp",
  "Telegram",
  "Discord",
  "Steam Group",
  "Reddit",
  "Forum",
];

export default function AdminCommunityPage() {
  const { communities, isLoading, isError, error, refetch } =
    useAdminCommunities();
  const isEndpointMissing =
    (error as { response?: { status?: number } } | null)?.response?.status ===
    404;
  const { data: serverTags } = useAdminCommunityTags();
  const createMutation = useCreateAdminCommunity();
  const updateMutation = useUpdateAdminCommunity();
  const statusMutation = useUpdateAdminCommunityStatus();
  const sortMutation = useSortAdminCommunities();
  const deleteMutation = useDeleteAdminCommunity();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] =
    React.useState<CommunityPlatformTag>("All");
  const [optimisticOrderIds, setOptimisticOrderIds] = React.useState<
    string[] | null
  >(null);
  const [busyCardId, setBusyCardId] = React.useState<string | null>(null);

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

  const availableTagNames = React.useMemo(() => {
    if (serverTags && serverTags.length > 0) {
      return serverTags.map((t) => t.name);
    }
    return DEFAULT_TAGS;
  }, [serverTags]);

  const orderedCommunities = React.useMemo(() => {
    if (!optimisticOrderIds) return communities;
    const byId = new Map(communities.map((c) => [c.id, c]));
    const ordered: AdminCommunityItem[] = [];
    for (const id of optimisticOrderIds) {
      const found = byId.get(id);
      if (found) {
        ordered.push(found);
        byId.delete(id);
      }
    }
    for (const remaining of byId.values()) {
      ordered.push(remaining);
    }
    return ordered;
  }, [communities, optimisticOrderIds]);

  const filteredCommunities = React.useMemo(() => {
    return orderedCommunities.filter((item) => {
      if (selectedTag !== "All") {
        const selectedLower = selectedTag.toLowerCase();
        const matchesExactTag = item.tags.some(
          (t) => t.toLowerCase() === selectedLower
        );
        const matchesFallbackTag = item.tag
          .toLowerCase()
          .includes(selectedLower);
        if (!matchesExactTag && !matchesFallbackTag) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesTag = item.tag.toLowerCase().includes(query);
        const matchesLink = item.pageLink.toLowerCase().includes(query);
        return matchesName || matchesTag || matchesLink;
      }

      return true;
    });
  }, [orderedCommunities, searchQuery, selectedTag]);

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
      if (dragOverIdx !== null) setDragOverIdx(null);
      if (dropPosition !== null) setDropPosition(null);
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

  const handleDrop = async (targetIdx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      setDropPosition(null);
      return;
    }

    const sourceItem = filteredCommunities[draggedIdx];
    const targetItem = filteredCommunities[targetIdx];
    if (!sourceItem || !targetItem) return;

    const next = [...orderedCommunities];
    const sourceIndex = next.findIndex((c) => c.id === sourceItem.id);
    if (sourceIndex === -1) return;

    const [moved] = next.splice(sourceIndex, 1);

    const targetIndexInNext = next.findIndex((c) => c.id === targetItem.id);
    if (targetIndexInNext === -1) return;

    const insertIndex =
      dropPosition === "bottom" ? targetIndexInNext + 1 : targetIndexInNext;
    next.splice(insertIndex, 0, moved);

    const nextIds = next.map((item) => item.id);

    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropPosition(null);
    setOptimisticOrderIds(nextIds);

    try {
      await sortMutation.mutateAsync(nextIds);
      toast.success("Urutan komunitas berhasil disimpan!");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan urutan komunitas."));
    } finally {
      setOptimisticOrderIds(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropPosition(null);
  };

  const handleToggleActive = async (
    item: AdminCommunityItem,
    nextActive: boolean
  ) => {
    setBusyCardId(item.id);
    try {
      await statusMutation.mutateAsync({
        id: item.id,
        isActive: nextActive,
      });
      toast.success(
        nextActive
          ? `"${item.name}" diaktifkan kembali.`
          : `"${item.name}" dinonaktifkan.`
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal memperbarui status komunitas.")
      );
    } finally {
      setBusyCardId(null);
    }
  };

  // Create or Edit community via drawer
  const handleSaveDrawer = async (data: AdminCommunityDrawerSaveData) => {
    try {
      if (drawerState.item) {
        await updateMutation.mutateAsync({
          id: drawerState.item.id,
          payload: {
            name: data.name,
            link: data.pageLink,
            tags: data.tags,
            is_active: data.isActive,
            banner_file: data.imageFile,
            banner_file_url: data.imageFile ? undefined : data.imageUrl,
            remove_image: data.removeImage,
          },
        });
        toast.success("Komunitas berhasil diperbarui!");
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          link: data.pageLink,
          tags: data.tags,
          is_active: data.isActive,
          banner_file: data.imageFile,
          banner_file_url: data.imageFile ? undefined : data.imageUrl,
        });
        toast.success("Komunitas baru berhasil ditambahkan!");
      }
      setDrawerState({ isOpen: false, item: null });
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan data komunitas."));
    }
  };

  // Delete community via modal
  const handleConfirmDelete = async () => {
    const target = deleteModalState.item;
    if (!target || deleteMutation.isPending) return;

    try {
      await deleteMutation.mutateAsync(target.id);
      toast.success("Komunitas berhasil dihapus dari database!");
      setDeleteModalState({ isOpen: false, item: null });
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus komunitas."));
    }
  };

  const hasActiveFilter =
    Boolean(searchQuery.trim()) || selectedTag !== "All";

  const handleReload = () => {
    setSearchQuery("");
    setSelectedTag("All");
    void refetch();
  };

  const isDrawerSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Head>
        <title>Komunitas | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola grup komunitas Gamezygo (WhatsApp, Telegram, Discord)"
        />
      </Head>

      <AdminLayout title="Komunitas" activeNavId="komunitas">
        <div className="w-full pb-16 flex flex-col gap-6 select-none font-sans">
          <div className="w-full flex flex-col gap-5">
            <AdminCommunityTopBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
              tagOptions={availableTagNames}
              onAddNew={() => setDrawerState({ isOpen: true, item: null })}
            />

            {isLoading ? (
              <div className="flex flex-col gap-3 sm:gap-3.5 w-full">
                {[1, 2, 3, 4].map((skeletonIdx) => (
                  <div
                    key={skeletonIdx}
                    className="w-full h-24 rounded-lg bg-deep-blue-900 border border-deep-blue-700 animate-pulse p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-8 bg-deep-blue-800 rounded" />
                      <div className="w-14 h-16 bg-deep-blue-800 rounded-lg" />
                      <div className="space-y-2">
                        <div className="w-48 h-4 bg-deep-blue-800 rounded" />
                        <div className="w-24 h-3 bg-deep-blue-800 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-8 bg-deep-blue-800 rounded-lg" />
                      <div className="w-16 h-8 bg-deep-blue-800 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="w-full rounded-lg border border-rose-500/30 bg-rose-500/10 p-6 text-center flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-rose-200">
                  {isEndpointMissing
                    ? "Endpoint Admin Communities (/api/v1/admin/communities) belum tersedia di backend be/dev (404 Not Found)."
                    : "Gagal memuat daftar komunitas dari server."}
                </p>
                <Button variant="inactive" size="sm" onClick={() => refetch()}>
                  Coba Lagi
                </Button>
              </div>
            ) : filteredCommunities.length === 0 ? (
              <AdminCommunityEmptyState
                title={
                  hasActiveFilter
                    ? "Komunitas Tidak Ditemukan"
                    : "Belum Ada Data Komunitas"
                }
                description={
                  hasActiveFilter
                    ? "Tidak ada komunitas yang cocok dengan filter atau kata kunci pencarian saat ini."
                    : "Belum ada grup komunitas tersimpan di database. Tambahkan komunitas baru atau muat ulang."
                }
                buttonLabel={hasActiveFilter ? "Reset Filter" : "Reload"}
                onReload={handleReload}
              />
            ) : (
              <div className="flex flex-col gap-3 sm:gap-3.5 w-full">
                {filteredCommunities.map((item, index) => (
                  <AdminCommunityCard
                    key={item.id}
                    item={item}
                    index={index}
                    isDragging={draggedIdx === index}
                    isBusy={
                      busyCardId === item.id ||
                      sortMutation.isPending ||
                      deleteMutation.isPending
                    }
                    dropPosition={dragOverIdx === index ? dropPosition : null}
                    onEdit={(itemToEdit) =>
                      setDrawerState({ isOpen: true, item: itemToEdit })
                    }
                    onDelete={(itemToDelete) =>
                      setDeleteModalState({ isOpen: true, item: itemToDelete })
                    }
                    onToggleActive={handleToggleActive}
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

        <AdminCommunityDrawer
          isOpen={drawerState.isOpen}
          isSubmitting={isDrawerSubmitting}
          item={drawerState.item}
          availableTags={availableTagNames}
          onClose={() => {
            if (!isDrawerSubmitting) {
              setDrawerState({ isOpen: false, item: null });
            }
          }}
          onSave={handleSaveDrawer}
        />

        <AdminCommunityDeleteModal
          isOpen={deleteModalState.isOpen}
          isDeleting={deleteMutation.isPending}
          item={deleteModalState.item}
          onClose={() => {
            if (!deleteMutation.isPending) {
              setDeleteModalState({ isOpen: false, item: null });
            }
          }}
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
