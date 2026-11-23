import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminArticleEditorToolbar,
  AdminArticleBlockEditor,
} from "@/features/admin/components/articles";
import {
  AdminInstructionEditorTopBar,
  AdminInstructionClearModal,
  AdminInstructionDeleteModal,
} from "@/features/admin/components/instructions";
import type {
  ArticleBlockType,
  ArticleEditorBlock,
} from "@/features/admin/types/admin-article.types";
import {
  parseContentToArticleBlocks,
  serializeArticleBlocksToHtml,
} from "@/features/admin/utils/article-content.utils";
import {
  useAdminInstructionDetail,
  useUpdateAdminInstruction,
  useDeleteAdminInstruction,
} from "@/hooks/use-admin-instructions";
import { toast } from "@/stores/use-toast-store";

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const INITIAL_BLOCKS: ArticleEditorBlock[] = [
  {
    id: "blk-initial",
    type: "paragraph",
    content: "",
  },
];

export default function AdminEditInstructionPage() {
  const router = useRouter();
  const { id } = router.query;
  const instructionId = typeof id === "string" ? id : "";

  // Query detail
  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useAdminInstructionDetail(instructionId);

  const updateMutation = useUpdateAdminInstruction();
  const deleteMutation = useDeleteAdminInstruction();

  // Document states
  const [title, setTitle] = React.useState<string>("");
  const [blocks, setBlocks] = React.useState<ArticleEditorBlock[]>(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState<number>(100);

  // Modals
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // History state for Undo / Redo
  const [history, setHistory] = React.useState<ArticleEditorBlock[][]>([
    INITIAL_BLOCKS,
  ]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(0);

  // Sync state once detail loads
  const isInitialized = React.useRef(false);
  React.useEffect(() => {
    if (detail && !isInitialized.current) {
      isInitialized.current = true;
      setTitle(detail.title || "");
      if (detail.content && detail.content.trim()) {
        const parsed = parseContentToArticleBlocks(detail.content);
        if (parsed.length > 0) {
          setBlocks(parsed);
          setActiveBlockId(parsed[0].id);
          setHistory([parsed]);
          setHistoryIndex(0);
          return;
        }
      } else if (detail.steps && detail.steps.length > 0) {
        const stepBlocks: ArticleEditorBlock[] = detail.steps.map((s, idx) => ({
          id: `blk-step-${idx}`,
          type: "paragraph",
          content: `<h3>${s.title}</h3><p>${s.description}</p>`,
        }));
        setBlocks(stepBlocks);
        setActiveBlockId(stepBlocks[0].id);
        setHistory([stepBlocks]);
        setHistoryIndex(0);
        return;
      }
      setBlocks(INITIAL_BLOCKS);
      setActiveBlockId(INITIAL_BLOCKS[0].id);
    }
  }, [detail]);

  const handleBlocksChange = (newBlocks: ArticleEditorBlock[]) => {
    setBlocks(newBlocks);
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newBlocks);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setBlocks(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setBlocks(history[nextIndex]);
    }
  };

  // Find active block
  const activeBlock = React.useMemo(() => {
    return blocks.find((b) => b.id === activeBlockId) || null;
  }, [blocks, activeBlockId]);

  // Toolbar actions applied to active block
  const handleSelectHeading = (headingType: ArticleBlockType) => {
    if (!activeBlockId) return;
    handleBlocksChange(
      blocks.map((b) =>
        b.id === activeBlockId
          ? {
              ...b,
              type: b.type === headingType ? "paragraph" : headingType,
            }
          : b
      )
    );
  };

  const handleToggleList = () => {
    if (!activeBlockId) return;
    const isList =
      activeBlock?.type === "bullet-list" ||
      activeBlock?.type === "numbered-list";
    handleBlocksChange(
      blocks.map((b) =>
        b.id === activeBlockId
          ? { ...b, type: isList ? "paragraph" : "bullet-list" }
          : b
      )
    );
  };

  const handleToggleBold = () => {
    if (!activeBlockId) return;
    handleBlocksChange(
      blocks.map((b) =>
        b.id === activeBlockId ? { ...b, isBold: !b.isBold } : b
      )
    );
  };

  const handleToggleItalic = () => {
    if (!activeBlockId) return;
    handleBlocksChange(
      blocks.map((b) =>
        b.id === activeBlockId ? { ...b, isItalic: !b.isItalic } : b
      )
    );
  };

  const handleToggleUnderline = () => {
    if (!activeBlockId) return;
    handleBlocksChange(
      blocks.map((b) =>
        b.id === activeBlockId ? { ...b, isUnderline: !b.isUnderline } : b
      )
    );
  };

  const handleToggleStrike = () => {
    if (!activeBlockId) return;
    handleBlocksChange(
      blocks.map((b) =>
        b.id === activeBlockId ? { ...b, isStrike: !b.isStrike } : b
      )
    );
  };

  const handleClearFormat = () => {
    if (!activeBlockId) return;
    handleBlocksChange(
      blocks.map((b) =>
        b.id === activeBlockId
          ? {
              ...b,
              isBold: false,
              isItalic: false,
              isUnderline: false,
              isStrike: false,
            }
          : b
      )
    );
  };

  const handleAlignChange = (align: "left" | "center" | "right") => {
    if (!activeBlockId) return;
    handleBlocksChange(
      blocks.map((b) => (b.id === activeBlockId ? { ...b, align } : b))
    );
  };

  const handleInsertTable = () => {
    const tableBlock: ArticleEditorBlock = {
      id: `blk-table-${Date.now()}`,
      type: "table",
      content: "",
      tableData: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
    };
    handleBlocksChange([...blocks, tableBlock]);
  };

  // Modals confirm handlers
  const handleConfirmClear = () => {
    setTitle("");
    handleBlocksChange(INITIAL_BLOCKS);
    setActiveBlockId(INITIAL_BLOCKS[0].id);
    setIsClearModalOpen(false);
    toast.success("Editor instruksi berhasil dibersihkan.");
  };

  const handleConfirmDelete = async () => {
    if (!instructionId) return;
    try {
      await deleteMutation.mutateAsync(instructionId);
      setIsDeleteModalOpen(false);
      toast.success("Instruksi berhasil dihapus dari database.");
      router.push("/admin/instructions");
    } catch {
      toast.error("Gagal menghapus instruksi.");
    }
  };

  // Submit / Update
  const submitUpdate = async (isPublish: boolean) => {
    if (!title.trim()) {
      toast.error("Judul instruksi tidak boleh kosong.");
      return;
    }

    const htmlContent = serializeArticleBlocksToHtml(blocks);

    try {
      await updateMutation.mutateAsync({
        id: instructionId,
        data: {
          title: title.trim(),
          content: htmlContent,
        },
      });

      toast.success(
        isPublish
          ? "Instruksi berhasil dipublikasikan!"
          : "Perubahan instruksi berhasil disimpan!"
      );

      if (isPublish) {
        setTimeout(() => {
          router.push("/admin/instructions");
        }, 500);
      }
    } catch {
      toast.error("Gagal menyimpan perubahan instruksi.");
    }
  };

  const isSubmitting = updateMutation.isPending || deleteMutation.isPending;

  // Header Title
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/instructions"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Instruksi
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Edit Instruction</span>
    </div>
  );

  // Header Right Actions: Save Draft & Publish (Desktop only)
  const headerRight = (
    <div className="hidden md:flex items-center gap-2.5 sm:gap-3 select-none">
      <Button
        variant="inactive"
        size="sm"
        disabled={isSubmitting}
        onClick={() => submitUpdate(false)}
      >
        Save Draft
      </Button>

      <Button
        variant="primary"
        size="sm"
        disabled={isSubmitting}
        onClick={() => submitUpdate(true)}
      >
        Simpan Perubahan
      </Button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Edit Instruction | Gamezygo Admin</title>
        <meta
          name="description"
          content="Edit dan kelola panduan instruksi Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="instruksi"
        headerRight={headerRight}
        isError={!isLoading && isError}
        onReload={() => refetch()}
      >
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-10 w-full rounded-lg bg-deep-blue-900 border border-deep-blue-700" />
            <div className="h-96 w-full rounded-lg bg-deep-blue-900 border border-deep-blue-700" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-5 w-full select-none font-sans pb-16">
            {/* Mobile/Tablet Action Buttons: Publish placed above Save Draft */}
            <div className="flex md:hidden flex-col gap-2.5 w-full">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                onClick={() => submitUpdate(true)}
                className="w-full justify-center"
              >
                Simpan Perubahan
              </Button>
              <Button
                type="button"
                variant="inactive"
                size="sm"
                disabled={isSubmitting}
                onClick={() => submitUpdate(false)}
                className="w-full justify-center"
              >
                Save Draft
              </Button>
            </div>

            {/* Top Action Bar: Title input & Clear / Delete buttons */}
            <AdminInstructionEditorTopBar
              title={title}
              onTitleChange={setTitle}
              onClear={() => setIsClearModalOpen(true)}
              onDelete={() => setIsDeleteModalOpen(true)}
            />

            {/* Outer Editor Container Card */}
            <div className="w-full rounded-lg bg-deep-blue-900 border border-white/10 overflow-hidden shadow-none pb-16">
              {/* Top Formatting Toolbar */}
              <AdminArticleEditorToolbar
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={handleUndo}
                onRedo={handleRedo}
                zoom={zoom}
                onZoomChange={setZoom}
                activeHeading={
                  activeBlock?.type && ["h1", "h2", "h3", "h4"].includes(activeBlock.type)
                    ? activeBlock.type
                    : null
                }
                onSelectHeading={handleSelectHeading}
                activeList={
                  activeBlock?.type === "bullet-list"
                    ? "bullet-list"
                    : activeBlock?.type === "numbered-list"
                    ? "numbered-list"
                    : null
                }
                onToggleList={handleToggleList}
                isBold={Boolean(activeBlock?.isBold)}
                isItalic={Boolean(activeBlock?.isItalic)}
                isUnderline={Boolean(activeBlock?.isUnderline)}
                isStrike={Boolean(activeBlock?.isStrike)}
                onToggleBold={handleToggleBold}
                onToggleItalic={handleToggleItalic}
                onToggleUnderline={handleToggleUnderline}
                onToggleStrike={handleToggleStrike}
                onClearFormat={handleClearFormat}
                align={activeBlock?.align || "left"}
                onAlignChange={handleAlignChange}
                onInsertTable={handleInsertTable}
              />

              {/* Block Editor Content */}
              <div className="p-4 sm:p-6 md:p-10 space-y-6">
                <AdminArticleBlockEditor
                  title={title}
                  onTitleChange={setTitle}
                  blocks={blocks}
                  onBlocksChange={handleBlocksChange}
                  activeBlockId={activeBlockId}
                  onActiveBlockChange={setActiveBlockId}
                  zoom={zoom}
                  hideTitle={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Clear Modal */}
        <AdminInstructionClearModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleConfirmClear}
        />

        {/* Delete Modal */}
        <AdminInstructionDeleteModal
          isOpen={isDeleteModalOpen}
          templateTitle={title || detail?.title}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
