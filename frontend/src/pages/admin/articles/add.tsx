import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminArticleEditorToolbar,
  AdminArticleCoverUpload,
  AdminArticleBlockEditor,
} from "@/features/admin/components/articles";
import type {
  ArticleBlockType,
  ArticleEditorBlock,
  AdminArticle,
} from "@/features/admin/types/admin-article.types";

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

export default function AdminAddBlogPage() {
  const router = useRouter();

  // Blog document states
  const [title, setTitle] = React.useState<string>("");
  const [coverUrl, setCoverUrl] = React.useState<string>("");
  const [blocks, setBlocks] = React.useState<ArticleEditorBlock[]>(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(
    INITIAL_BLOCKS[0].id
  );
  const [zoom, setZoom] = React.useState<number>(100);

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

  // Helper to persist article in localStorage
  const saveArticleToStorage = (status: "published" | "draft") => {
    const finalTitle = title.trim() || "Untitled Blog Post";
    const newArticle: AdminArticle = {
      id: `art-${Date.now()}`,
      title: finalTitle,
      coverImage:
        coverUrl ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      status,
      publishedAt:
        status === "published"
          ? new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : undefined,
      lastEdited: "Baru saja",
      views: 0,
      category: "Panduan",
      blocks,
    };

    try {
      const existing = localStorage.getItem("gamezygo_admin_articles");
      const list: AdminArticle[] = existing ? JSON.parse(existing) : [];
      list.unshift(newArticle);
      localStorage.setItem("gamezygo_admin_articles", JSON.stringify(list));
    } catch {
      // LocalStorage fallback
    }

    return newArticle;
  };

  // Save Draft Handler
  const handleSaveDraft = () => {
    saveArticleToStorage("draft");
    showToast("Draft blog berhasil disimpan!");
  };

  // Publish Handler
  const handlePublish = () => {
    saveArticleToStorage("published");
    showToast("Blog berhasil dipublikasikan!");
    setTimeout(() => {
      router.push("/admin/articles");
    }, 600);
  };

  // Header Title: Breadcrumb "Artikel > Add New Blog" (Matching Image 1)
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/articles"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Artikel
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Add New Blog</span>
    </div>
  );

  // Header Right Actions: Save Draft & Publish (Matching Image 1)
  const headerRight = (
    <div className="flex items-center gap-3 select-none">
      <button
        type="button"
        onClick={handleSaveDraft}
        className="px-4 py-2 rounded-lg bg-deep-blue-900 hover:bg-[#1E202B] border border-white/10 text-label-xs sm:text-sm font-medium text-white transition-colors cursor-pointer select-none"
      >
        Save Draft
      </button>

      <button
        type="button"
        onClick={handlePublish}
        className="px-5 py-2 rounded-lg bg-linear-to-r from-[#DF3848] to-[#FF5364] hover:brightness-110 active:scale-95 text-white text-label-xs sm:text-sm font-semibold transition-all cursor-pointer select-none"
      >
        Publish
      </button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Add New Blog | Gamezygo Admin</title>
        <meta
          name="description"
          content="Tulis dan publikasikan blog panduan atau promo Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="artikel"
        headerRight={headerRight}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#181A26] border border-emerald-500/40 text-emerald-300 text-label-xs sm:text-sm font-medium shadow-none animate-in fade-in slide-in-from-top-2 duration-150">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Outer Editor Container Card (Matching Image 2, 3, 4, 5) */}
        <div className="w-full rounded-lg bg-[#13151F] border border-white/10 overflow-hidden shadow-none pb-16">
          {/* 1. Top Formatting Toolbar */}
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

          {/* 2. Editor Body */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Thumbnail / Cover Image Area (Matching Image 3, 4, 5) */}
            <AdminArticleCoverUpload
              coverUrl={coverUrl}
              onCoverChange={setCoverUrl}
              onRemoveCover={() => setCoverUrl("")}
            />

            {/* Subtle Divider Line below Thumbnail (Matching Image 3, 4, 5) */}
            <div className="w-full h-px bg-white/10" />

            {/* Notion-style Interactive Block Editor */}
            <AdminArticleBlockEditor
              title={title}
              onTitleChange={setTitle}
              blocks={blocks}
              onBlocksChange={handleBlocksChange}
              activeBlockId={activeBlockId}
              onActiveBlockChange={setActiveBlockId}
              zoom={zoom}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
