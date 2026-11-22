import * as React from "react";
import Head from "next/head";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminAnnouncementCard,
  AdminAnnouncementAddButton,
  AdminAnnouncementDrawer,
  AdminAnnouncementDeleteModal,
  type AdminAnnouncementDrawerSaveData,
} from "@/features/admin/components/announcements";
import type { AdminAnnouncementItem } from "@/features/admin/types/admin-announcement.types";
import {
  useAdminAnnouncements,
  useCreateAdminAnnouncement,
  useUpdateAdminAnnouncement,
  useSortAdminAnnouncements,
  useDeleteAdminAnnouncement,
} from "@/hooks/use-admin-announcements";
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

export default function AdminAnnouncementsPage() {
  const { announcements, isLoading, isError, error, refetch } =
    useAdminAnnouncements();
  const isEndpointMissing =
    (error as { response?: { status?: number } } | null)?.response?.status ===
    404;
  const createMutation = useCreateAdminAnnouncement();
  const updateMutation = useUpdateAdminAnnouncement();
  const sortMutation = useSortAdminAnnouncements();
  const deleteMutation = useDeleteAdminAnnouncement();

  // Optional optimistic order override while sorting
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
    item?: AdminAnnouncementItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    item?: AdminAnnouncementItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const orderedAnnouncements = React.useMemo(() => {
    if (!optimisticOrderIds) return announcements;
    const byId = new Map(announcements.map((a) => [a.id, a]));
    const ordered: AdminAnnouncementItem[] = [];
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
  }, [announcements, optimisticOrderIds]);

  const handleUpdateLink = async (id: string, nextLink: string) => {
    setBusyCardId(id);
    try {
      await updateMutation.mutateAsync({
        id,
        payload: { link: nextLink },
      });
      toast.success("Link pengumuman berhasil diperbarui.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui link pengumuman."));
    } finally {
      setBusyCardId(null);
    }
  };

  const handleTogglePublish = async (id: string, nextPublished: boolean) => {
    setBusyCardId(id);
    try {
      await updateMutation.mutateAsync({
        id,
        payload: { is_published: nextPublished },
      });
      toast.success(
        nextPublished
          ? "Pengumuman berhasil dipublikasikan."
          : "Pengumuman disimpan sebagai draft."
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal memperbarui status publikasi.")
      );
    } finally {
      setBusyCardId(null);
    }
  };

  const handleUploadImage = async (id: string, file: File) => {
    setBusyCardId(id);
    try {
      await updateMutation.mutateAsync({
        id,
        payload: { banner_file: file },
      });
      toast.success("Gambar banner pengumuman berhasil diperbarui.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mengunggah gambar banner."));
    } finally {
      setBusyCardId(null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (idx: number, e: React.DragEvent) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${idx}`);
  };

  const handleDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIdx === null) return;
    if (draggedIdx === idx) {
      if (dragOverIdx !== null) setDragOverIdx(null);
      if (dropPosition !== null) setDropPosition(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const isTopHalf = e.clientY - rect.top < rect.height / 2;
    setDragOverIdx(idx);
    setDropPosition(isTopHalf ? "top" : "bottom");
  };

  const handleDragLeave = (idx: number) => {
    if (dragOverIdx === idx) {
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

    const next = [...orderedAnnouncements];
    const [draggedItem] = next.splice(draggedIdx, 1);
    let insertionIndex = targetIdx;
    if (draggedIdx < targetIdx) {
      insertionIndex = dropPosition === "bottom" ? targetIdx : targetIdx - 1;
    } else {
      insertionIndex = dropPosition === "bottom" ? targetIdx + 1 : targetIdx;
    }

    next.splice(insertionIndex, 0, draggedItem);
    const nextIds = next.map((item) => item.id);

    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropPosition(null);
    setOptimisticOrderIds(nextIds);

    try {
      await sortMutation.mutateAsync(nextIds);
      toast.success("Urutan pengumuman berhasil disimpan!");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal menyimpan urutan pengumuman.")
      );
    } finally {
      setOptimisticOrderIds(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropPosition(null);
  };

  // Create or edit from drawer
  const handleSaveDrawer = async (data: AdminAnnouncementDrawerSaveData) => {
    try {
      if (drawerState.item) {
        await updateMutation.mutateAsync({
          id: drawerState.item.id,
          payload: {
            link: data.pageLink,
            is_published: data.isPublished,
            banner_file: data.imageFile,
            banner_file_url: data.imageFile ? undefined : data.imageUrl,
          },
        });
        toast.success("Pengumuman berhasil diperbarui!");
      } else {
        await createMutation.mutateAsync({
          link: data.pageLink,
          is_published: data.isPublished,
          banner_file: data.imageFile,
          banner_file_url: data.imageFile ? undefined : data.imageUrl,
        });
        toast.success("Pengumuman baru berhasil ditambahkan!");
      }
      setDrawerState({ isOpen: false, item: null });
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan pengumuman."));
    }
  };

  // Delete announcement
  const handleConfirmDelete = async () => {
    const target = deleteModalState.item;
    if (!target || deleteMutation.isPending) return;

    try {
      await deleteMutation.mutateAsync(target.id);
      toast.success("Pengumuman berhasil dihapus dari database!");
      setDeleteModalState({ isOpen: false, item: null });
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menghapus pengumuman."));
    }
  };

  const isDrawerSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Head>
        <title>Pengumuman | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola banner pengumuman dan promo di Gamezygo"
        />
      </Head>

      <AdminLayout title="Pengumuman" activeNavId="pengumuman">
        <div className="w-full pb-16 flex flex-col gap-6 select-none font-sans">
          {isLoading ? (
            <div className="flex flex-col gap-8 w-full">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full flex flex-col gap-4 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-64 rounded-lg bg-white/5" />
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-16 rounded-lg bg-white/5" />
                      <div className="h-8 w-20 rounded-lg bg-white/5" />
                      <div className="h-5 w-20 rounded-full bg-white/5" />
                    </div>
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <div className="w-full h-56 rounded-lg bg-white/5 border border-white/10" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="w-full py-14 rounded-lg bg-deep-blue-900 border border-rose-500/30 flex flex-col items-center justify-center text-center gap-3 px-4">
              <p className="text-sm text-rose-300 font-medium">
                {isEndpointMissing
                  ? "Endpoint Admin Announcements (/api/v1/admin/announcements) belum tersedia di backend be/dev (404 Not Found)."
                  : "Gagal memuat daftar pengumuman dari database. Pastikan Anda sudah login sebagai Admin."}
              </p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Muat Ulang
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 w-full">
              {orderedAnnouncements.map((item, index) => (
                <AdminAnnouncementCard
                  key={item.id}
                  item={item}
                  index={index}
                  isDragging={draggedIdx === index}
                  isBusy={busyCardId === item.id}
                  dropPosition={dragOverIdx === index ? dropPosition : null}
                  onUpdateLink={handleUpdateLink}
                  onTogglePublish={handleTogglePublish}
                  onUploadImage={handleUploadImage}
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

              {orderedAnnouncements.length === 0 && (
                <div className="rounded-lg bg-deep-blue-900/40 border border-deep-blue-700/60 p-8 text-center text-gray-400 text-label-xs sm:text-sm">
                  Belum ada pengumuman banner yang dibuat. Klik tombol di bawah untuk menambahkan.
                </div>
              )}
            </div>
          )}

          {/* Add Announcement Dashed Button */}
          <AdminAnnouncementAddButton
            onClick={() => setDrawerState({ isOpen: true, item: null })}
          />
        </div>

        {/* Slide-over Drawer: New / Edit Announcement */}
        <AdminAnnouncementDrawer
          isOpen={drawerState.isOpen}
          isSubmitting={isDrawerSubmitting}
          item={drawerState.item}
          onClose={() => {
            if (!isDrawerSubmitting) {
              setDrawerState({ isOpen: false, item: null });
            }
          }}
          onSave={handleSaveDrawer}
        />

        {/* Modal: Confirm Delete */}
        <AdminAnnouncementDeleteModal
          isOpen={deleteModalState.isOpen}
          isDeleting={deleteMutation.isPending}
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
