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
  AdminBlogCategoryItem,
  ArticleBlockType,
  ArticleEditorBlock,
  BackendBlogStatus,
} from "@/features/admin/types/admin-article.types";
import type { AdminBlogDetailServerData } from "@/services/admin-blog.service";
import {
  useAdminBlogCategories,
  useAdminBlogDetail,
  useUpdateAdminBlog,
} from "@/hooks/use-admin-blogs";
import {
  parseContentToArticleBlocks,
  serializeArticleBlocksToHtml,
} from "@/features/admin/utils/article-content.utils";
import { resolveImageUrl } from "@/utils/image-url";
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

interface AdminEditBlogFormProps {
  detail: AdminBlogDetailServerData;
  categories: AdminBlogCategoryItem[];
}

function AdminEditBlogForm({ detail, categories }: AdminEditBlogFormProps) {
  const router = useRouter();
  const updateMutation = useUpdateAdminBlog();

  const initialBlocks = React.useMemo(
    () => parseContentToArticleBlocks(detail.content),
    [detail.content]
  );

  const initialStatus: BackendBlogStatus =
    detail.status === "published"
      ? "published"
      : detail.status === "archived"
      ? "archived"
      : "draft";

  const [title, setTitle] = React.useState<string>(detail.title || "");
  const [coverUrl, setCoverUrl] = React.useState<string>(
    detail.banner_file_url ? resolveImageUrl(detail.banner_file_url, "") : ""
  );
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | ""
  >(detail.categories?.id ?? "");
  const [currentStatus, setCurrentStatus] =
    React.useState<BackendBlogStatus>(initialStatus);
  const [blocks, setBlocks] =
    React.useState<ArticleEditorBlock[]>(initialBlocks);
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(
    initialBlocks[0]?.id || null
  );
  const [zoom, setZoom] = React.useState<number>(100);

  const [history, setHistory] = React.useState<ArticleEditorBlock[][]>([
    initialBlocks,
  ]);
  const [historyIndex, setHistoryIndex] = React.useState<number>(0);

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

  const submitUpdate = async (
    targetStatus: BackendBlogStatus,
    redirectAfter = false
  ) => {
    if (updateMutation.isPending) return;

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
      await updateMutation.mutateAsync({
        id: detail.id,
        payload: {
          title: trimmedTitle,
          content: serializedContent,
          status: targetStatus,
          category_id:
            selectedCategoryId === "" ? null : Number(selectedCategoryId),
          banner_file: coverFile
            ? coverFile
            : coverUrl.trim() && !coverUrl.startsWith("data:")
            ? coverUrl.trim()
            : coverUrl === ""
            ? null
            : undefined,
        },
      });

      setCurrentStatus(targetStatus);
      setCoverFile(null);

      if (targetStatus === "published") {
        toast.success("Perubahan artikel berhasil dipublikasikan!");
      } else if (targetStatus === "archived") {
        toast.success("Artikel disimpan sebagai Unpublish (Archived).");
      } else {
        toast.success("Perubahan draft berhasil disimpan.");
      }

      if (redirectAfter) {
        router.push("/admin/articles");
      }
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Gagal memperbarui artikel ke database.")
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
      <span className="text-white font-semibold truncate w-60 sm:w-90">
        {title || "Edit Blog"}
      </span>
    </div>
  );

  const headerRight = (
    <div className="hidden md:flex items-center gap-2.5 sm:gap-3 select-none">
      <Button
        variant="inactive"
        size="sm"
        disabled={updateMutation.isPending}
        onClick={() => submitUpdate("draft", false)}
      >
        {updateMutation.isPending ? "Menyimpan..." : "Save Draft"}
      </Button>

      <Button
        variant="primary"
        size="sm"
        disabled={updateMutation.isPending}
        onClick={() => submitUpdate("published", true)}
      >
        {currentStatus === "published" ? "Simpan Perubahan" : "Publish"}
      </Button>
    </div>
  );

  return (
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
          disabled={updateMutation.isPending}
          onClick={() => submitUpdate("draft", false)}
          className="flex-1 sm:flex-initial justify-center"
        >
          {updateMutation.isPending ? "Menyimpan..." : "Save Draft"}
        </Button>

        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={updateMutation.isPending}
          onClick={() => submitUpdate("published", true)}
          className="flex-1 sm:flex-initial justify-center"
        >
          {currentStatus === "published" ? "Simpan Perubahan" : "Publish"}
        </Button>
      </div>

      <div className="w-full rounded-lg bg-deep-blue-900 border border-white/10 overflow-hidden shadow-none pb-16">
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

        <div className="p-6 sm:p-10 space-y-6">
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
            selectedCategoryId={selectedCategoryId}
            onSelectCategoryId={(id) => setSelectedCategoryId(id)}
            fallbackCategories={categories}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5 px-4 rounded-lg bg-white/3 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto">
                <label
                  htmlFor="edit-blog-status"
                  className="text-label-xs font-semibold text-gray-300 uppercase tracking-wider shrink-0"
                >
                  Status
                </label>
                <select
                  id="edit-blog-status"
                  value={currentStatus}
                  onChange={(e) =>
                    setCurrentStatus(e.target.value as BackendBlogStatus)
                  }
                  className="w-full sm:w-auto h-9 px-3 rounded-lg bg-deep-blue-900 border border-white/10 text-label-xs text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Unpublish (Archived)</option>
                </select>
              </div>
            </div>

            <div className="w-full sm:w-auto flex justify-end">
              {currentStatus !== "published" ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  disabled={updateMutation.isPending}
                  onClick={() => submitUpdate(currentStatus, false)}
                  className="w-full sm:w-auto justify-center"
                >
                  Simpan Status
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  disabled={updateMutation.isPending}
                  onClick={() => submitUpdate("archived", false)}
                  className="w-full sm:w-auto justify-center"
                >
                  Unpublish
                </Button>
              )}
            </div>
          </div>

          <div className="w-full h-px bg-white/10" />

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
  );
}

export default function AdminEditBlogPage() {
  const router = useRouter();
  const { id } = router.query;
  const blogId = typeof id === "string" ? id : "";

  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useAdminBlogDetail(blogId, { enabled: router.isReady && Boolean(blogId) });
  const { data: categories = [] } = useAdminBlogCategories();

  const fallbackTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/articles"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Artikel
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Edit Blog</span>
    </div>
  );

  return (
    <>
      <Head>
        <title>
          {detail?.title
            ? `Edit: ${detail.title} | Gamezygo Admin`
            : "Edit Blog | Gamezygo Admin"}
        </title>
        <meta
          name="description"
          content="Edit konten, cover, dan kategori artikel blog Gamezygo"
        />
      </Head>

      {isLoading || !router.isReady ? (
        <AdminLayout title={fallbackTitle} activeNavId="artikel">
          <div className="w-full rounded-lg bg-deep-blue-900 border border-white/10 p-6 sm:p-10 space-y-6 animate-pulse">
            <div className="w-full h-56 rounded-lg bg-white/5" />
            <div className="h-10 w-64 rounded-lg bg-white/5" />
            <div className="w-full h-px bg-white/10" />
            <div className="h-10 w-2/3 rounded bg-white/10" />
            <div className="space-y-3">
              <div className="h-5 w-full rounded bg-white/5" />
              <div className="h-5 w-5/6 rounded bg-white/5" />
            </div>
          </div>
        </AdminLayout>
      ) : isError || !detail ? (
        <AdminLayout
          title={fallbackTitle}
          activeNavId="artikel"
          isError={true}
          onReload={() => refetch()}
        >
          <div />
        </AdminLayout>
      ) : (
        <AdminEditBlogForm
          key={detail.id}
          detail={detail}
          categories={categories}
        />
      )}
    </>
  );
}
