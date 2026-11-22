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
import { serializeArticleBlocksToHtml } from "@/features/admin/utils/article-content.utils";
import { useCreateAdminInstruction } from "@/hooks/use-admin-instructions";

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

const INITIAL_BLOCKS: ArticleEditorBlock[] = [
  {
    id: "blk-initial",
    type: "paragraph",
    content: "",
  },
];

export default function AdminAddNewInstructionPage() {
  const router = useRouter();

  // Document states
  const [title, setTitle] = React.useState<string>("");
  const [blocks, setBlocks] = React.useState<ArticleEditorBlock[]>(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(
    INITIAL_BLOCKS[0].id
  );
  const [zoom, setZoom] = React.useState<number>(100);

  // Modals
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Undo / Redo history
  const [history, setHistory] = React.useState<ArticleEditorBlock[][]>([
    INITIAL_BLOCKS,
  ]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleBlocksChange = (newBlocks: ArticleEditorBlock[]) => {
    setBlocks(newBlocks);
    // Push to history
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
              align: "left",
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

  // Clear instruction content
  const handleConfirmClear = () => {
    const clearedBlocks: ArticleEditorBlock[] = [
      {
        id: `blk-${Date.now()}`,
        type: "paragraph",
        content: "",
      },
    ];
    handleBlocksChange(clearedBlocks);
    setActiveBlockId(clearedBlocks[0].id);
    setIsClearModalOpen(false);
    showToast("Isi instruksi berhasil dikosongkan!");
  };

  // Delete instruction (returns to instructions dashboard)
  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    router.push("/admin/instructions");
  };

  // Helper to persist instruction in localStorage
  const createMutation = useCreateAdminInstruction();

  const returnUrl = (router.query.returnUrl as string) || (router.query.from as string) || "/admin/instructions";

  // Helper to build return URL with newly created template ID
  const getReturnUrlWithTemplate = (createdId: string) => {
    if (!router.query.returnUrl) return returnUrl;
    const separator = returnUrl.includes("?") ? "&" : "?";
    return `${returnUrl}${separator}newTemplateId=${encodeURIComponent(createdId)}`;
  };

  const submitInstruction = async (successMessage: string, alwaysRedirect: boolean) => {
    const finalTitle = title.trim() || "Untitled Instruction";
    const serializedContent = serializeArticleBlocksToHtml(blocks).trim() || `<p>${finalTitle}</p>`;

    try {
      const created = await createMutation.mutateAsync({
        title: finalTitle,
        content: serializedContent,
      });
      showToast(successMessage);
      if (alwaysRedirect || router.query.returnUrl) {
        setTimeout(() => {
          router.push(getReturnUrlWithTemplate(created.id));
        }, 500);
      }
    } catch {
      showToast("Gagal menyimpan instruksi ke server.");
    }
  };

  // Save Draft Handler
  const handleSaveDraft = () => {
    void submitInstruction("Draft instruksi berhasil disimpan!", false);
  };

  // Publish Handler
  const handlePublish = () => {
    void submitInstruction("Instruksi berhasil dipublikasikan!", true);
  };

  // Header Title: Breadcrumb "Instruksi > Add New Instruction" (Matching Image 1)
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href={returnUrl}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {router.query.returnUrl ? "Kembali ke Edit Produk" : "Instruksi"}
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Add New Instruction</span>
    </div>
  );

  // Header Right Actions: Save Draft & Publish (Matching Add Blog)
  const headerRight = (
    <div className="flex items-center gap-3 select-none">
      <Button
        variant="inactive"
        size="sm"
        onClick={handleSaveDraft}
      >
        Save Draft
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={handlePublish}
      >
        Publish
      </Button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Add New Instruction | Gamezygo Admin</title>
        <meta
          name="description"
          content="Tulis dan publikasikan instruksi panduan Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="instruksi"
        headerRight={headerRight}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-emerald-500/40 text-emerald-300 text-label-xs sm:text-sm font-medium shadow-none animate-in fade-in slide-in-from-top-2 duration-150">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-col gap-5 w-full select-none font-sans pb-16">
          {/* Top Action Bar: Title input & Clear / Delete buttons (Matching requested image) */}
          <AdminInstructionEditorTopBar
            title={title}
            onTitleChange={setTitle}
            onClear={() => setIsClearModalOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
          />

          {/* Outer Editor Container Card (Identical to Add Article style, Gambar 2 thumbnail removed!) */}
          <div className="w-full rounded-lg bg-deep-blue-900 border border-white/10 overflow-hidden shadow-none pb-16">
            {/* 1. Top Formatting Toolbar (Identical to Add Article) */}
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

            {/* 2. Editor Body (Thumbnail upload removed, starts directly with Notion-style Editor) */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Notion-style Interactive Block Editor */}
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

        {/* Clear Instruction Modal */}
        <AdminInstructionClearModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleConfirmClear}
        />

        {/* Delete Instruction Modal */}
        <AdminInstructionDeleteModal
          isOpen={isDeleteModalOpen}
          templateTitle={title || "Instruction"}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
