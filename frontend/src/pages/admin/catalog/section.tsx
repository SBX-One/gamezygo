import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminProductSectionBlock,
  AdminAddSectionDashedBox,
  AdminAddGameToSectionModal,
  AdminEditSectionModal,
  AdminClearSectionModal,
  AdminDeleteSectionModal,
  ChevronRightIcon,
} from "@/features/admin/components/catalog/section";
import type { ProductSection, SectionProduct } from "@/features/admin/types/admin-section.types";
import {
  useAdminSections,
  useUpdateSection,
  useReorderSections,
  useAddGamesToSection,
  useRemoveGameFromSection,
  useClearSection,
  useCreateSection,
  useDeleteSection,
} from "@/hooks/use-admin-sections";
import { toast } from "@/stores/use-toast-store";

export default function AdminProductSectionPage() {
  const { data: serverSections, isLoading } = useAdminSections();
  const updateSectionMutation = useUpdateSection();
  const reorderSectionsMutation = useReorderSections();
  const addGamesMutation = useAddGamesToSection();
  const removeGameMutation = useRemoveGameFromSection();
  const clearSectionMutation = useClearSection();
  const createSectionMutation = useCreateSection();
  const deleteSectionMutation = useDeleteSection();

  const [sections, setSections] = React.useState<ProductSection[]>(
    serverSections ?? []
  );

  // Sync server sections into local state when fetched
  React.useEffect(() => {
    if (serverSections !== undefined) {
      const timer = setTimeout(() => {
        setSections(serverSections);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [serverSections]);

  // Drag-and-drop state for Notion-style reordering
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = React.useState<number | null>(null);
  const [dropIndicator, setDropIndicator] = React.useState<"top" | "bottom" | null>(
    null
  );

  // Modals state
  const [addGameModalState, setAddGameModalState] = React.useState<{
    isOpen: boolean;
    section: ProductSection | null;
  }>({
    isOpen: false,
    section: null,
  });

  const [editSectionModalState, setEditSectionModalState] = React.useState<{
    isOpen: boolean;
    section: ProductSection | null;
  }>({
    isOpen: false,
    section: null,
  });

  const [clearModalState, setClearModalState] = React.useState<{
    isOpen: boolean;
    section: ProductSection | null;
  }>({
    isOpen: false,
    section: null,
  });

  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    section: ProductSection | null;
  }>({
    isOpen: false,
    section: null,
  });

  // Drag & Drop Handlers (Notion-style section reordering)
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
      if (dropIndicator !== null) setDropIndicator(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const isTopHalf = e.clientY - rect.top < rect.height / 2;
    setDragOverIdx(idx);
    setDropIndicator(isTopHalf ? "top" : "bottom");
  };

  const handleDragLeave = (idx: number) => {
    if (dragOverIdx === idx) {
      setDragOverIdx(null);
      setDropIndicator(null);
    }
  };

  const handleDrop = (targetIdx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      setDropIndicator(null);
      return;
    }

    let nextOrder: ProductSection[] = [];
    setSections((prev) => {
      const next = [...prev];
      const [draggedItem] = next.splice(draggedIdx, 1);
      let insertionIndex = targetIdx;
      if (draggedIdx < targetIdx) {
        insertionIndex = dropIndicator === "bottom" ? targetIdx : targetIdx - 1;
      } else {
        insertionIndex = dropIndicator === "bottom" ? targetIdx + 1 : targetIdx;
      }
      next.splice(insertionIndex, 0, draggedItem);
      nextOrder = next;
      return next;
    });

    if (nextOrder.length > 0) {
      reorderSectionsMutation.mutate(nextOrder.map((s) => s.id));
    }

    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropIndicator(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    setDropIndicator(null);
  };

  // Keyboard / Click accessible reorder
  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    let nextOrder: ProductSection[] = [];
    setSections((prev) => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(idx - 1, 0, item);
      nextOrder = next;
      return next;
    });
    if (nextOrder.length > 0) {
      reorderSectionsMutation.mutate(nextOrder.map((s) => s.id));
    }
  };

  const handleMoveDown = (idx: number) => {
    if (idx === sections.length - 1) return;
    let nextOrder: ProductSection[] = [];
    setSections((prev) => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(idx + 1, 0, item);
      nextOrder = next;
      return next;
    });
    if (nextOrder.length > 0) {
      reorderSectionsMutation.mutate(nextOrder.map((s) => s.id));
    }
  };

  // Title modification handlers
  const handleTitleChange = (sectionId: string, newTitle: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s))
    );
    updateSectionMutation.mutate({
      sectionId,
      data: { title: newTitle },
    });
  };

  const handleClearTitle = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title: "" } : s))
    );
    updateSectionMutation.mutate({
      sectionId,
      data: { title: "" },
    });
  };

  // Add new section (Image 4)
  const handleAddNewSection = () => {
    createSectionMutation.mutate("Section header", {
      onSuccess: (newSec) => {
        setSections((prev) => [...prev, newSec]);
      },
    });
  };

  // Game management within section
  const handleAddGamesToSection = (games: SectionProduct[]) => {
    if (!addGameModalState.section) return;
    const targetSectionId = addGameModalState.section.id;
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === targetSectionId) {
          const currentIds = s.products.map((p) => p.id);
          const toAdd = games.filter((g) => !currentIds.includes(g.id));
          return { ...s, products: [...s.products, ...toAdd] };
        }
        return s;
      })
    );

    addGamesMutation.mutate(
      {
        sectionId: targetSectionId,
        productIds: games.map((g) => g.id),
      },
      {
        onSuccess: () => {
          toast.success(`${games.length} game berhasil ditambahkan ke section!`);
        },
        onError: () => {
          toast.error("Gagal menambahkan game ke section.");
        },
      }
    );
  };

  const handleAddGameToSection = (game: SectionProduct) => {
    handleAddGamesToSection([game]);
  };

  const handleRemoveGameFromSection = (sectionId: string, gameId: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            products: s.products.filter((p) => p.id !== gameId),
          };
        }
        return s;
      })
    );

    removeGameMutation.mutate(
      {
        sectionId,
        productId: gameId,
      },
      {
        onSuccess: () => {
          toast.success("Game berhasil dihapus dari section.");
        },
        onError: () => {
          toast.error("Gagal menghapus game dari section.");
        },
      }
    );
  };

  // Clear Section (Image 3)
  const handleConfirmClearSection = () => {
    if (!clearModalState.section) return;
    const sectionId = clearModalState.section.id;
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, products: [] } : s))
    );
    clearSectionMutation.mutate(sectionId, {
      onSuccess: () => {
        toast.success("Section berhasil dikosongkan.");
      },
      onError: () => {
        toast.error("Gagal mengosongkan section.");
      },
    });
    setClearModalState({ isOpen: false, section: null });
  };

  // Delete Section
  const handleConfirmDeleteSection = () => {
    if (!deleteModalState.section) return;
    const sectionId = deleteModalState.section.id;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    deleteSectionMutation.mutate(sectionId, {
      onSuccess: () => {
        toast.success("Section berhasil dihapus.");
      },
      onError: () => {
        toast.error("Gagal menghapus section.");
      },
    });
    setDeleteModalState({ isOpen: false, section: null });
  };

  // Save Edit Section Modal
  const handleSaveEditSection = (updatedSection: ProductSection) => {
    setSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
    updateSectionMutation.mutate(
      {
        sectionId: updatedSection.id,
        data: { title: updatedSection.title },
      },
      {
        onSuccess: () => {
          toast.success("Judul section berhasil diperbarui.");
        },
        onError: () => {
          toast.error("Gagal memperbarui judul section.");
        },
      }
    );
  };

  // Breadcrumb Title matching Image 1: [ ◫ ] | Katalog > Product Section
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-[12px]">
      <Link
        href="/admin/catalog"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Katalog
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Product Section</span>
    </div>
  );

  return (
    <>
      <Head>
        <title>Product Section Management | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola dan atur susunan section produk game pada Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="katalog"
      >
        <div className="space-y-10 pb-16">
          {isLoading && sections.length === 0 ? (
            <div className="space-y-8 select-none">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`section-skel-${idx}`}
                  className="rounded-xl border border-deep-blue-700/60 bg-[#161822]/80 p-6 space-y-4 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-48 h-6 rounded bg-white/10 animate-pulse" />
                    <div className="w-24 h-8 rounded bg-white/10 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-2">
                    {Array.from({ length: 4 }).map((_, cIdx) => (
                      <div
                        key={`card-skel-${cIdx}`}
                        className="h-44 rounded-lg bg-white/10 animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Section Blocks List */}
              {sections.map((section, idx) => (
                <AdminProductSectionBlock
                  key={section.id}
                  section={section}
                  index={idx}
                  totalSections={sections.length}
                  isDragging={draggedIdx === idx}
                  dropIndicator={dragOverIdx === idx ? dropIndicator : null}
                  onTitleChange={(val) => handleTitleChange(section.id, val)}
                  onClearTitle={() => handleClearTitle(section.id)}
                  onEditSection={() =>
                    setEditSectionModalState({ isOpen: true, section })
                  }
                  onClearSection={() =>
                    setClearModalState({ isOpen: true, section })
                  }
                  onDeleteSection={() =>
                    setDeleteModalState({ isOpen: true, section })
                  }
                  onAddGame={() =>
                    setAddGameModalState({ isOpen: true, section })
                  }
                  onRemoveGame={(gameId) =>
                    handleRemoveGameFromSection(section.id, gameId)
                  }
                  onMoveUp={() => handleMoveUp(idx)}
                  onMoveDown={() => handleMoveDown(idx)}
                  onDragStart={(e) => handleDragStart(idx, e)}
                  onDragOver={(e) => handleDragOver(idx, e)}
                  onDragLeave={() => handleDragLeave(idx)}
                  onDrop={(e) => handleDrop(idx, e)}
                  onDragEnd={handleDragEnd}
                />
              ))}

              {/* Add New Section Dashed Box (Image 4) */}
              <AdminAddSectionDashedBox onClick={handleAddNewSection} />
            </>
          )}
        </div>

        {/* 1. Modal: Add Game to Section */}
        <AdminAddGameToSectionModal
          isOpen={addGameModalState.isOpen}
          sectionTitle={addGameModalState.section?.title || "Section"}
          existingProductIds={
            addGameModalState.section?.products.map((p) => p.id) || []
          }
          onClose={() => setAddGameModalState({ isOpen: false, section: null })}
          onAddGames={handleAddGamesToSection}
          onAddGame={handleAddGameToSection}
        />

        {/* 2. Modal: Edit Section */}
        <AdminEditSectionModal
          isOpen={editSectionModalState.isOpen}
          section={editSectionModalState.section}
          onClose={() =>
            setEditSectionModalState({ isOpen: false, section: null })
          }
          onSave={handleSaveEditSection}
        />

        {/* 3. Modal: Clear Section Confirmation */}
        <AdminClearSectionModal
          isOpen={clearModalState.isOpen}
          sectionTitle={clearModalState.section?.title || "Section"}
          onClose={() => setClearModalState({ isOpen: false, section: null })}
          onConfirm={handleConfirmClearSection}
        />

        {/* 4. Modal: Delete Section Confirmation */}
        <AdminDeleteSectionModal
          isOpen={deleteModalState.isOpen}
          sectionTitle={deleteModalState.section?.title || "Section"}
          onClose={() => setDeleteModalState({ isOpen: false, section: null })}
          onConfirm={handleConfirmDeleteSection}
        />
      </AdminLayout>
    </>
  );
}
