import * as React from "react";
import Head from "next/head";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminAnnouncementCard,
  AdminAnnouncementAddButton,
  AdminAnnouncementDrawer,
  AdminAnnouncementDeleteModal,
} from "@/features/admin/components/announcements";
import { MOCK_ADMIN_ANNOUNCEMENTS } from "@/features/admin/data/admin-announcement-mock-data";
import type { AdminAnnouncementItem } from "@/features/admin/types/admin-announcement.types";

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

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<AdminAnnouncementItem[]>(
    MOCK_ADMIN_ANNOUNCEMENTS
  );

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

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gamezygo_admin_announcements");
      if (stored) {
        const parsed: AdminAnnouncementItem[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setAnnouncements(parsed);
        }
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (updated: AdminAnnouncementItem[]) => {
    setAnnouncements(updated);
    try {
      localStorage.setItem("gamezygo_admin_announcements", JSON.stringify(updated));
    } catch {
      // LocalStorage fallback
    }
  };

  // Update single announcement item
  const handleUpdateItem = (updated: AdminAnnouncementItem) => {
    const list = announcements.map((item) =>
      item.id === updated.id ? updated : item
    );
    saveToStorage(list);
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

  const handleDrop = (targetIdx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      setDropPosition(null);
      return;
    }

    const next = [...announcements];
    const [draggedItem] = next.splice(draggedIdx, 1);
    let insertionIndex = targetIdx;
    if (draggedIdx < targetIdx) {
      insertionIndex = dropPosition === "bottom" ? targetIdx : targetIdx - 1;
    } else {
      insertionIndex = dropPosition === "bottom" ? targetIdx + 1 : targetIdx;
    }

    next.splice(insertionIndex, 0, draggedItem);

    // Re-index order numbers
    const reindexed = next.map((item, i) => ({
      ...item,
      orderNumber: i + 1,
    }));

    saveToStorage(reindexed);
    showToast("Urutan pengumuman berhasil diubah!");

    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropPosition(null);
  };

  // Create or edit from drawer
  const handleSaveDrawer = (data: {
    pageLink: string;
    imageUrl: string;
    isPublished: boolean;
  }) => {
    if (drawerState.item) {
      // Edit
      const updated = announcements.map((item) =>
        item.id === drawerState.item?.id
          ? {
              ...item,
              pageLink: data.pageLink,
              imageUrl: data.imageUrl,
              isPublished: data.isPublished,
              lastEdit: "Just now",
            }
          : item
      );
      saveToStorage(updated);
      showToast("Pengumuman berhasil diperbarui!");
    } else {
      // Create new
      const newItem: AdminAnnouncementItem = {
        id: `announcement-${Date.now()}`,
        pageLink: data.pageLink,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished,
        orderNumber: announcements.length + 1,
        lastEdit: "Just now",
      };
      saveToStorage([...announcements, newItem]);
      showToast("Pengumuman baru berhasil ditambahkan!");
    }
    setDrawerState({ isOpen: false, item: null });
  };

  // Delete announcement
  const handleConfirmDelete = () => {
    if (deleteModalState.item) {
      const updated = announcements.filter(
        (item) => item.id !== deleteModalState.item?.id
      );
      saveToStorage(updated);
      showToast("Pengumuman berhasil dihapus dari list!");
    }
    setDeleteModalState({ isOpen: false, item: null });
  };

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
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-150 shadow-xl">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="w-full pb-16 flex flex-col gap-6 select-none font-sans">
          {/* Announcement Cards List with Drag & Drop Reordering */}
          <div className="flex flex-col gap-8 w-full">
            {announcements.map((item, index) => (
              <AdminAnnouncementCard
                key={item.id}
                item={item}
                index={index}
                isDragging={draggedIdx === index}
                dropPosition={dragOverIdx === index ? dropPosition : null}
                onUpdate={handleUpdateItem}
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

            {announcements.length === 0 && (
              <div className="rounded-2xl bg-deep-blue-900/40 border border-deep-blue-700/60 p-8 text-center text-gray-400 text-xs sm:text-sm">
                Belum ada pengumuman banner yang dibuat. Klik tombol di bawah untuk menambahkan.
              </div>
            )}
          </div>

          {/* Add Announcement Dashed Button */}
          <AdminAnnouncementAddButton
            onClick={() => setDrawerState({ isOpen: true, item: null })}
          />
        </div>

        {/* Slide-over Drawer: New / Edit Announcement */}
        <AdminAnnouncementDrawer
          isOpen={drawerState.isOpen}
          item={drawerState.item}
          onClose={() => setDrawerState({ isOpen: false, item: null })}
          onSave={handleSaveDrawer}
        />

        {/* Modal: Confirm Delete */}
        <AdminAnnouncementDeleteModal
          isOpen={deleteModalState.isOpen}
          onClose={() => setDeleteModalState({ isOpen: false, item: null })}
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
