import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminArticleEditorToolbar,
  AdminArticleCoverUpload,
  AdminArticleBlockEditor,
} from "@/features/admin/components/articles";
import { AdminArticleCategorySelector } from "@/features/admin/components/articles/AdminArticleCategorySelector";
import type {
  ArticleBlockType,
  ArticleEditorBlock,
} from "@/features/admin/types/admin-article.types";
import {
  useAdminBlogCategories,
  useCreateAdminBlog,
} from "@/hooks/use-admin-blogs";
import { serializeArticleBlocksToHtml } from "@/features/admin/utils/article-content.utils";
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

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: {
      data?: { message?: string; errors?: Record<string, string[]> };
    };
    message?: string;
  };
  const firstValidationError = err?.response?.data?.errors
    ? Object.values(err.response.data.errors)[0]?.[0]
    : undefined;
  return (
    firstValidationError ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

export default function AdminAddBlogPage() {
  const router = useRouter();

  // Blog document states
  const [title, setTitle] = React.useState<string>("");
  const [coverUrl, setCoverUrl] = React.useState<string>("");
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | "" | null
  >(null);
  const [blocks, setBlocks] =
    React.useState<ArticleEditorBlock[]>(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(
    INITIAL_BLOCKS[0].id
  );
  const [zoom, setZoom] = React.useState<number>(100);

  // Undo / Redo history
  const [history, setHistory] = React.useState<ArticleEditorBlock[][]>([
    INITIAL_BLOCKS,
  ]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(0);

  // Backend hooks
  const { data: categories = [] } = useAdminBlogCategories();
  const createMutation = useCreateAdminBlog();

  const effectiveCategoryId: number | "" =
    selectedCategoryId === null ? (categories[0]?.id ?? "") : selectedCategoryId;

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

  const activeBlock = React.useMemo(() => {
    return blocks.find((b) => b.id === activeBlockId) || null;
  }, [blocks, activeBlockId]);

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

  // Persist article directly to Laravel backend
  const submitArticle = async (targetStatus: "draft" | "published") => {
    if (createMutation.isPending) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Judul artikel wajib diisi.");
      return;
    }

    const serializedContent = serializeArticleBlocksToHtml(blocks).trim();
    if (!serializedContent) {
      toast.error("Konten artikel tidak boleh kosong.");
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        title: trimmedTitle,
        content: serializedContent,
        status: targetStatus,
        category_id:
          effectiveCategoryId === "" ? null : Number(effectiveCategoryId),
        banner_file: coverFile
          ? coverFile
          : coverUrl.trim() && !coverUrl.startsWith("data:")
          ? coverUrl.trim()
          : undefined,
      });

      if (targetStatus === "draft") {
        toast.success("Draft blog berhasil disimpan ke database.");
        if (created?.id) {
          router.replace(`/admin/articles/edit/${created.id}`);
        } else {
          router.push("/admin/articles");
        }
      } else {
        toast.success("Blog berhasil dipublikasikan!");
        router.push("/admin/articles");
      }
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal menyimpan artikel ke database.")
      );
    }
  };

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

  const headerRight = (
    <div className="hidden md:flex items-center gap-3 select-none">
      <Button
        variant="inactive"
        size="sm"
        disabled={createMutation.isPending}
        onClick={() => submitArticle("draft")}
      >
        {createMutation.isPending ? "Menyimpan..." : "Save Draft"}
      </Button>

      <Button
        variant="primary"
        size="sm"
        disabled={createMutation.isPending}
        onClick={() => submitArticle("published")}
      >
        {createMutation.isPending ? "Memproses..." : "Publish"}
      </Button>
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
        {/* Mobile/Tablet Action Buttons: placed cleanly above edit area */}
        <div className="flex md:hidden items-center justify-end gap-2.5 w-full mb-4">
          <Button
            type="button"
            variant="inactive"
            size="sm"
            disabled={createMutation.isPending}
            onClick={() => submitArticle("draft")}
            className="flex-1 sm:flex-initial justify-center"
          >
            {createMutation.isPending ? "Menyimpan..." : "Save Draft"}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={createMutation.isPending}
            onClick={() => submitArticle("published")}
            className="flex-1 sm:flex-initial justify-center"
          >
            {createMutation.isPending ? "Memproses..." : "Publish"}
          </Button>
        </div>

        <div className="w-full rounded-lg bg-deep-blue-900 border border-white/10 overflow-hidden shadow-none pb-16">
          {/* 1. Top Formatting Toolbar */}
          <AdminArticleEditorToolbar
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
            zoom={zoom}
            onZoomChange={setZoom}
            activeHeading={
              activeBlock?.type &&
              ["h1", "h2", "h3", "h4"].includes(activeBlock.type)
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
            {/* Thumbnail / Cover Image Area */}
            <AdminArticleCoverUpload
              coverUrl={coverUrl}
              onCoverChange={setCoverUrl}
              onCoverFileChange={setCoverFile}
              onRemoveCover={() => {
                setCoverFile(null);
                setCoverUrl("");
              }}
            />

            {/* Category Chips Selector (matching Add Catalog style) */}
            <AdminArticleCategorySelector
              selectedCategoryId={effectiveCategoryId}
              onSelectCategoryId={(id) => setSelectedCategoryId(id)}
              fallbackCategories={categories}
            />

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
