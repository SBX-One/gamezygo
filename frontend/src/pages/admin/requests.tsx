import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, Pagination, type TabItem } from "@/components/ui";
import {
  AdminGameRequestTableCard,
  AdminGameRequestActionModal,
  AdminGameRequestDetailModal,
} from "@/features/admin/components/game-requests";
import {
  MOCK_PINNED_GAME_REQUESTS,
  MOCK_REQUESTED_GAMES,
  MOCK_ACCEPTED_GAMES,
  MOCK_DECLINED_GAMES,
} from "@/features/admin/data/admin-game-request-mock-data";
import type {
  AdminGameRequestItem,
  GameRequestTab,
} from "@/features/admin/types/admin-game-request.types";

const GAME_REQUEST_TABS: TabItem[] = [
  { id: "requested", label: "Requested Game" },
  { id: "accepted", label: "Accepted" },
  { id: "declined", label: "Declined" },
];

export default function AdminRequestsPage() {
  const router = useRouter();

  // Tabs state: "requested" | "accepted" | "declined" (Matching Image 2)
  const [activeTab, setActiveTab] = React.useState<GameRequestTab>("requested");

  // Preview Item for Detail Modal
  const [previewItem, setPreviewItem] = React.useState<AdminGameRequestItem | null>(null);

  // Datasets state
  const [pinnedGames, setPinnedGames] = React.useState<AdminGameRequestItem[]>(
    MOCK_PINNED_GAME_REQUESTS
  );
  const [requestedGames, setRequestedGames] = React.useState<AdminGameRequestItem[]>(
    MOCK_REQUESTED_GAMES
  );
  const [acceptedGames, setAcceptedGames] = React.useState<AdminGameRequestItem[]>(
    MOCK_ACCEPTED_GAMES
  );
  const [declinedGames, setDeclinedGames] = React.useState<AdminGameRequestItem[]>(
    MOCK_DECLINED_GAMES
  );

  // Checkbox Selection state
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Pagination state (Matching Image 5)
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const totalPages = 25; // 25 pages as shown in Image 5

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

  // Toggle selection for a single game
  const handleToggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all for pinned games
  const handleToggleSelectAllPinned = () => {
    const pinnedIds = pinnedGames.map((g) => g.id);
    const allPinnedSelected = pinnedIds.every((id) => selectedIds.includes(id));

    if (allPinnedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pinnedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pinnedIds])));
    }
  };

  // Toggle select all for requested games
  const handleToggleSelectAllRequested = () => {
    const requestedIds = requestedGames.map((g) => g.id);
    const allRequestedSelected = requestedIds.every((id) =>
      selectedIds.includes(id)
    );

    if (allRequestedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !requestedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...requestedIds])));
    }
  };

  // Toggle select all for accepted games
  const handleToggleSelectAllAccepted = () => {
    const acceptedIds = acceptedGames.map((g) => g.id);
    const allAcceptedSelected = acceptedIds.every((id) => selectedIds.includes(id));

    if (allAcceptedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !acceptedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...acceptedIds])));
    }
  };

  // Toggle select all for declined games
  const handleToggleSelectAllDeclined = () => {
    const declinedIds = declinedGames.map((g) => g.id);
    const allDeclinedSelected = declinedIds.every((id) => selectedIds.includes(id));

    if (allDeclinedSelected) {
      setSelectedIds((prev) => prev.filter((id) => !declinedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...declinedIds])));
    }
  };

  // Pin / Unpin Toggle
  const handlePinToggle = (id: string) => {
    // Check if in pinned
    const pinnedIndex = pinnedGames.findIndex((g) => g.id === id);
    if (pinnedIndex !== -1) {
      const item = pinnedGames[pinnedIndex];
      setPinnedGames((prev) => prev.filter((g) => g.id !== id));
      setRequestedGames((prev) => [{ ...item, isPinned: false }, ...prev]);
      return;
    }

    // Check if in requested
    const requestedIndex = requestedGames.findIndex((g) => g.id === id);
    if (requestedIndex !== -1) {
      const item = requestedGames[requestedIndex];
      setRequestedGames((prev) => prev.filter((g) => g.id !== id));
      setPinnedGames((prev) => [{ ...item, isPinned: true }, ...prev]);
    }
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

    if (actionType === "accept" && targetItem) {
      // Remove from pinned or requested, add to accepted
      setPinnedGames((prev) => prev.filter((g) => g.id !== targetItem.id));
      setRequestedGames((prev) => prev.filter((g) => g.id !== targetItem.id));
      setAcceptedGames((prev) => [
        { ...targetItem, status: "accepted", isPinned: false },
        ...prev,
      ]);
      setSelectedIds((prev) => prev.filter((id) => id !== targetItem.id));
    } else if (actionType === "decline" && targetItem) {
      // Remove from pinned or requested, add to declined
      setPinnedGames((prev) => prev.filter((g) => g.id !== targetItem.id));
      setRequestedGames((prev) => prev.filter((g) => g.id !== targetItem.id));
      setDeclinedGames((prev) => [
        { ...targetItem, status: "declined", isPinned: false },
        ...prev,
      ]);
      setSelectedIds((prev) => prev.filter((id) => id !== targetItem.id));
    } else if (actionType === "cancel" && targetItem) {
      // Move from accepted or declined back to requested
      if (targetSection === "accepted") {
        setAcceptedGames((prev) => prev.filter((g) => g.id !== targetItem.id));
      } else {
        setDeclinedGames((prev) => prev.filter((g) => g.id !== targetItem.id));
      }
      setRequestedGames((prev) => [
        { ...targetItem, status: "requested" as const, isPinned: false },
        ...prev,
      ]);
      setSelectedIds((prev) => prev.filter((id) => id !== targetItem.id));
    } else if (actionType === "accept-all") {
      if (targetSection === "pinned") {
        setAcceptedGames((prev) => [
          ...pinnedGames.map((g) => ({ ...g, status: "accepted" as const, isPinned: false })),
          ...prev,
        ]);
        setPinnedGames([]);
      } else {
        setAcceptedGames((prev) => [
          ...requestedGames.map((g) => ({ ...g, status: "accepted" as const, isPinned: false })),
          ...prev,
        ]);
        setRequestedGames([]);
      }
    } else if (actionType === "decline-all") {
      if (targetSection === "pinned") {
        setDeclinedGames((prev) => [
          ...pinnedGames.map((g) => ({ ...g, status: "declined" as const, isPinned: false })),
          ...prev,
        ]);
        setPinnedGames([]);
      } else {
        setDeclinedGames((prev) => [
          ...requestedGames.map((g) => ({ ...g, status: "declined" as const, isPinned: false })),
          ...prev,
        ]);
        setRequestedGames([]);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Game Request | Gamezygo Admin</title>
        <meta
          name="description"
          content="Admin Game Request Management Dashboard - Pantau dan kelola permintaan game dari komunitas"
        />
      </Head>

      {/* AdminLayout provides the Top Navigation Header with Toggle Icon + Divider + "Game Request" (Image 1) */}
      <AdminLayout title="Game Request" activeNavId="game-request">
        <div className="w-full space-y-6 pb-12">
          {/* Section 1: Tab Navigation (Matching Image 2: Requested Game | Accepted | Declined) */}
          <Tabs
            items={GAME_REQUEST_TABS}
            activeId={activeTab}
            onChange={(id) => {
              setActiveTab(id as GameRequestTab);
              setSelectedIds([]);
              setCurrentPage(1);
            }}
            className="border-deep-blue-700"
          />

          {/* Section 2: Tab Content */}
          {activeTab === "requested" && (
            <div className="space-y-6">
              {/* Pinned Game Section (Matching Image 2 & Image 3) */}
              <AdminGameRequestTableCard
                sectionTitle="Pinned Game"
                totalLabel="Games Pinned"
                totalCount={pinnedGames.length}
                items={pinnedGames}
                selectedIds={selectedIds}
                tabType="requested"
                onToggleSelectAll={handleToggleSelectAllPinned}
                onToggleSelectItem={handleToggleSelectItem}
                onPinToggle={handlePinToggle}
                onAcceptItem={triggerAcceptItem}
                onDeclineItem={triggerDeclineItem}
                onAcceptAll={() => triggerAcceptAll("pinned")}
                onDeclineAll={() => triggerDeclineAll("pinned")}
                emptyDescription="Anda belum menyematkan permintaan game apapun."
              />

              {/* Requested Game Section (Matching Image 3 & Image 4) */}
              <AdminGameRequestTableCard
                sectionTitle="Requested Game"
                totalLabel="Games Reqeuested"
                totalCount={requestedGames.length}
                items={requestedGames}
                selectedIds={selectedIds}
                tabType="requested"
                onToggleSelectAll={handleToggleSelectAllRequested}
                onToggleSelectItem={handleToggleSelectItem}
                onPinToggle={handlePinToggle}
                onAcceptItem={triggerAcceptItem}
                onDeclineItem={triggerDeclineItem}
                onAcceptAll={() => triggerAcceptAll("requested")}
                onDeclineAll={() => triggerDeclineAll("requested")}
                emptyDescription="Belum ada riwayat permintaan game dari customer."
              />

              {/* Pagination Component (Matching Image 5: < 1 2 3 4 5 ... 25 >) */}
              {requestedGames.length > 0 && (
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

          {activeTab === "accepted" && (
            <div className="space-y-6">
              {/* Accepted Game Section: 3 buttons (View on Steam, Add Product, Cancel) - Image 1 */}
              <AdminGameRequestTableCard
                sectionTitle="Accepted Game"
                totalLabel="Games Accepted"
                totalCount={acceptedGames.length}
                items={acceptedGames}
                selectedIds={selectedIds}
                tabType="accepted"
                onToggleSelectAll={handleToggleSelectAllAccepted}
                onToggleSelectItem={handleToggleSelectItem}
                onAddProduct={handleAddProduct}
                onCancelItem={(item) => triggerCancelItem(item, "accepted")}
                showCardHeaderActions={false}
                emptyDescription="Anda belum menyetujui permintaan game apapun."
              />

              {acceptedGames.length > 0 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.max(1, Math.ceil(acceptedGames.length / 10))}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "declined" && (
            <div className="space-y-6">
              {/* Declined Game Section: 2 buttons (View on Steam, Cancel) - Image 2 */}
              <AdminGameRequestTableCard
                sectionTitle="Declined Game"
                totalLabel="Games Declined"
                totalCount={declinedGames.length}
                items={declinedGames}
                selectedIds={selectedIds}
                tabType="declined"
                onToggleSelectAll={handleToggleSelectAllDeclined}
                onToggleSelectItem={handleToggleSelectItem}
                onCancelItem={(item) => triggerCancelItem(item, "declined")}
                showCardHeaderActions={false}
                emptyDescription="Anda belum menolak permintaan game apapun."
              />

              {declinedGames.length > 0 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.max(1, Math.ceil(declinedGames.length / 10))}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Confirmation Modal (Matching Image 1) */}
        <AdminGameRequestActionModal
          isOpen={modalState.isOpen}
          actionType={modalState.actionType}
          targetName={modalState.targetItem?.name}
          count={
            modalState.targetSection === "pinned"
              ? pinnedGames.length
              : requestedGames.length
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
