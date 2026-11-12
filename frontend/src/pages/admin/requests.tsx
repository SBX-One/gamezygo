import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button, Tabs, Pagination, type TabItem } from "@/components/ui";
import {
  AdminGameRequestTableCard,
  AdminGameRequestActionModal,
  AdminGameRequestDetailModal,
} from "@/features/admin/components/game-requests";
import type {
  AdminGameRequestItem,
  GameRequestTab,
} from "@/features/admin/types/admin-game-request.types";
import {
  useAdminGameRequests,
  useUpdateGameRequestStatus,
  useBatchUpdateGameRequestStatus,
  useToggleGameRequestPin,
} from "@/hooks/use-admin-game-requests";
import { toast } from "@/stores/use-toast-store";

export default function AdminRequestsPage() {
  const router = useRouter();

  // Tabs state: "requested" | "accepted" | "declined"
  const [activeTab, setActiveTab] = React.useState<GameRequestTab>("requested");

  // Preview Item for Detail Modal
  const [previewItem, setPreviewItem] = React.useState<AdminGameRequestItem | null>(null);

  // Checkbox Selection state
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // Modal confirmation state
  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    actionType: "accept" | "decline" | "accept-all" | "decline-all" | "cancel";
    targetItem?: AdminGameRequestItem;
    targetSection?: "pinned" | "requested" | "accepted" | "declined";
  }>({
    isOpen: false,
    actionType: "accept",
  });

  // Live database hook
  const {
    items,
    pinnedItems,
    unpinnedItems,
    counts,
    totalPages,
    isLoading,
    isError,
    refetch,
  } = useAdminGameRequests({
    status: activeTab,
    page: currentPage,
    per_page: 20,
  });

  // Mutations
  const updateStatusMutation = useUpdateGameRequestStatus();
  const batchUpdateStatusMutation = useBatchUpdateGameRequestStatus();
  const togglePinMutation = useToggleGameRequestPin();

  // Reset to page 1 and clear selected IDs when tab changes
  const handleTabChange = (newTab: GameRequestTab) => {
    setActiveTab(newTab);
    setSelectedIds([]);
    setCurrentPage(1);
  };

  // Toggle selection for a single game
  const handleToggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all for pinned games
  const handleToggleSelectAllPinned = () => {
    const pinnedIds = pinnedItems.map((g) => g.id);
    const allPinnedSelected =
      pinnedIds.length > 0 && pinnedIds.every((id) => selectedIds.includes(id));

    if (allPinnedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pinnedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pinnedIds])));
    }
  };

  // Toggle select all for requested games
  const handleToggleSelectAllRequested = () => {
    const requestedIds = unpinnedItems.map((g) => g.id);
    const allRequestedSelected =
      requestedIds.length > 0 &&
      requestedIds.every((id) => selectedIds.includes(id));

    if (allRequestedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !requestedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...requestedIds])));
    }
  };

  // Toggle select all for accepted games
  const handleToggleSelectAllAccepted = () => {
    const acceptedIds = items.map((g) => g.id);
    const allAcceptedSelected =
      acceptedIds.length > 0 &&
      acceptedIds.every((id) => selectedIds.includes(id));

    if (allAcceptedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !acceptedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...acceptedIds])));
    }
  };

  // Toggle select all for declined games
  const handleToggleSelectAllDeclined = () => {
    const declinedIds = items.map((g) => g.id);
    const allDeclinedSelected =
      declinedIds.length > 0 &&
      declinedIds.every((id) => selectedIds.includes(id));

    if (allDeclinedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !declinedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...declinedIds])));
    }
  };

  // Pin / Unpin Toggle
  const handlePinToggle = (id: string) => {
    const target = items.find((g) => g.id === id);
    const willPin = target ? !target.isPinned : true;

    togglePinMutation.mutate(
      { id, isPinned: willPin },
      {
        onSuccess: () => {
          toast.success(
            willPin
              ? `Game "${target?.name || id}" berhasil disematkan di atas!`
              : `Sematan game "${target?.name || id}" dilepas.`
          );
        },
        onError: () => {
          toast.error("Gagal mengubah status sematan game.");
        },
      }
    );
  };

  // Open modal handlers
  const triggerAcceptItem = (item: AdminGameRequestItem) => {
    setModalState({
      isOpen: true,
      actionType: "accept",
      targetItem: item,
    });
  };

  const triggerDeclineItem = (item: AdminGameRequestItem) => {
    setModalState({
      isOpen: true,
      actionType: "decline",
      targetItem: item,
    });
  };

  const triggerAcceptAll = (section: "pinned" | "requested") => {
    setModalState({
      isOpen: true,
      actionType: "accept-all",
      targetSection: section,
    });
  };

  const triggerDeclineAll = (section: "pinned" | "requested") => {
    setModalState({
      isOpen: true,
      actionType: "decline-all",
      targetSection: section,
    });
  };

  const handleAddProduct = (item: AdminGameRequestItem) => {
    router.push(
      `/admin/catalog/add?title=${encodeURIComponent(
        item.name
      )}&steamUrl=${encodeURIComponent(item.steamUrl || "")}`
    );
  };

  const triggerCancelItem = (
    item: AdminGameRequestItem,
    section: "accepted" | "declined"
  ) => {
    setModalState({
      isOpen: true,
      actionType: "cancel",
      targetItem: item,
      targetSection: section,
    });
  };

  // Confirm modal action execution
  const handleConfirmAction = () => {
    const { actionType, targetItem, targetSection } = modalState;
    setModalState((prev) => ({ ...prev, isOpen: false }));

    if (actionType === "accept" && targetItem) {
      updateStatusMutation.mutate(
        { id: targetItem.id, status: "accepted" },
        {
          onSuccess: () => {
            toast.success(`Game "${targetItem.name}" berhasil disetujui!`);
            setSelectedIds((prev) => prev.filter((id) => id !== targetItem.id));
          },
          onError: () => {
            toast.error("Gagal menyetujui permintaan game.");
          },
        }
      );
    } else if (actionType === "decline" && targetItem) {
      updateStatusMutation.mutate(
        { id: targetItem.id, status: "declined" },
        {
          onSuccess: () => {
            toast.info(`Game "${targetItem.name}" ditolak.`);
            setSelectedIds((prev) => prev.filter((id) => id !== targetItem.id));
          },
          onError: () => {
            toast.error("Gagal menolak permintaan game.");
          },
        }
      );
    } else if (actionType === "cancel" && targetItem) {
      updateStatusMutation.mutate(
        { id: targetItem.id, status: "requested" },
        {
          onSuccess: () => {
            toast.success(
              `Permintaan game "${targetItem.name}" dikembalikan ke daftar request.`
            );
            setSelectedIds((prev) => prev.filter((id) => id !== targetItem.id));
          },
          onError: () => {
            toast.error("Gagal membatalkan status game.");
          },
        }
      );
    } else if (actionType === "accept-all") {
      const targetList = targetSection === "pinned" ? pinnedItems : unpinnedItems;
      const ids = targetList.map((g) => g.id);

      if (ids.length === 0) return;

      batchUpdateStatusMutation.mutate(
        { ids, status: "accepted" },
        {
          onSuccess: () => {
            toast.success(`${ids.length} game berhasil disetujui!`);
            setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
          },
          onError: () => {
            toast.error("Gagal menyetujui game terpilih.");
          },
        }
      );
    } else if (actionType === "decline-all") {
      const targetList = targetSection === "pinned" ? pinnedItems : unpinnedItems;
      const ids = targetList.map((g) => g.id);

      if (ids.length === 0) return;

      batchUpdateStatusMutation.mutate(
        { ids, status: "declined" },
        {
          onSuccess: () => {
            toast.info(`${ids.length} game ditolak.`);
            setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
          },
          onError: () => {
            toast.error("Gagal menolak game terpilih.");
          },
        }
      );
    }
  };

  const dynamicTabs: TabItem[] = [
    {
      id: "requested",
      label: counts.requested > 0 ? `Requested Game (${counts.requested})` : "Requested Game",
    },
    {
      id: "accepted",
      label: counts.accepted > 0 ? `Accepted (${counts.accepted})` : "Accepted",
    },
    {
      id: "declined",
      label: counts.declined > 0 ? `Declined (${counts.declined})` : "Declined",
    },
  ];

  return (
    <>
      <Head>
        <title>Game Request | Gamezygo Admin</title>
        <meta
          name="description"
          content="Admin Game Request Management Dashboard - Pantau dan kelola permintaan game dari komunitas"
        />
      </Head>

      <AdminLayout title="Game Request" activeNavId="game-request">
        <div className="w-full space-y-6 pb-12">
          {/* Section 1: Tab Navigation with Live Counts */}
          <Tabs
            items={dynamicTabs}
            activeId={activeTab}
            onChange={(id) => handleTabChange(id as GameRequestTab)}
            className="border-deep-blue-700"
          />

          {/* Section 2: Tab Content */}
          {isError && (
            <div className="w-full py-12 rounded-lg bg-[#13151F] border border-rose-500/30 flex flex-col items-center justify-center text-center gap-3 px-4">
              <p className="text-sm text-rose-300 font-medium">
                Gagal memuat data permintaan game dari database. Pastikan Anda sudah login sebagai Admin.
              </p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Muat Ulang
              </Button>
            </div>
          )}

          {!isError && activeTab === "requested" && (
            <div className="space-y-6">
              {/* Pinned Game Section */}
              {(isLoading || pinnedItems.length > 0) && (
                <AdminGameRequestTableCard
                  sectionTitle="Pinned Game"
                  totalLabel="Games Pinned"
                  totalCount={pinnedItems.length}
                  items={pinnedItems}
                  selectedIds={selectedIds}
                  tabType="requested"
                  isLoading={isLoading}
                  onToggleSelectAll={handleToggleSelectAllPinned}
                  onToggleSelectItem={handleToggleSelectItem}
                  onPinToggle={handlePinToggle}
                  onAcceptItem={triggerAcceptItem}
                  onDeclineItem={triggerDeclineItem}
                  onAcceptAll={() => triggerAcceptAll("pinned")}
                  onDeclineAll={() => triggerDeclineAll("pinned")}
                  emptyDescription="Anda belum menyematkan permintaan game apapun."
                />
              )}

              {/* Requested Game Section */}
              <AdminGameRequestTableCard
                sectionTitle="Requested Game"
                totalLabel="Games Requested"
                totalCount={unpinnedItems.length}
                items={unpinnedItems}
                selectedIds={selectedIds}
                tabType="requested"
                isLoading={isLoading}
                onToggleSelectAll={handleToggleSelectAllRequested}
                onToggleSelectItem={handleToggleSelectItem}
                onPinToggle={handlePinToggle}
                onAcceptItem={triggerAcceptItem}
                onDeclineItem={triggerDeclineItem}
                onAcceptAll={() => triggerAcceptAll("requested")}
                onDeclineAll={() => triggerDeclineAll("requested")}
                emptyDescription="Belum ada riwayat permintaan game dari customer."
              />

              {/* Pagination Component */}
              {!isLoading && totalPages > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}

          {!isError && activeTab === "accepted" && (
            <div className="space-y-6">
              {/* Accepted Game Section */}
              <AdminGameRequestTableCard
                sectionTitle="Accepted Game"
                totalLabel="Games Accepted"
                totalCount={items.length}
                items={items}
                selectedIds={selectedIds}
                tabType="accepted"
                isLoading={isLoading}
                onToggleSelectAll={handleToggleSelectAllAccepted}
                onToggleSelectItem={handleToggleSelectItem}
                onAddProduct={handleAddProduct}
                onCancelItem={(item) => triggerCancelItem(item, "accepted")}
                showCardHeaderActions={false}
                emptyDescription="Anda belum menyetujui permintaan game apapun."
              />

              {!isLoading && totalPages > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}

          {!isError && activeTab === "declined" && (
            <div className="space-y-6">
              {/* Declined Game Section */}
              <AdminGameRequestTableCard
                sectionTitle="Declined Game"
                totalLabel="Games Declined"
                totalCount={items.length}
                items={items}
                selectedIds={selectedIds}
                tabType="declined"
                isLoading={isLoading}
                onToggleSelectAll={handleToggleSelectAllDeclined}
                onToggleSelectItem={handleToggleSelectItem}
                onCancelItem={(item) => triggerCancelItem(item, "declined")}
                showCardHeaderActions={false}
                emptyDescription="Anda belum menolak permintaan game apapun."
              />

              {!isLoading && totalPages > 1 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Confirmation Modal */}
        <AdminGameRequestActionModal
          isOpen={modalState.isOpen}
          actionType={modalState.actionType}
          targetName={modalState.targetItem?.name}
          count={
            modalState.targetSection === "pinned"
              ? pinnedItems.length
              : unpinnedItems.length
          }
          onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={handleConfirmAction}
        />

        {/* Game Detail Preview Modal */}
        <AdminGameRequestDetailModal
          isOpen={!!previewItem}
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onAccept={(item) => triggerAcceptItem(item)}
          onDecline={(item) => triggerDeclineItem(item)}
        />
      </AdminLayout>
    </>
  );
}
