import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminArticleCard } from "./AdminArticleCard";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import type { AdminArticle, AdminArticleStatus } from "../../types/admin-article.types";

export interface AdminArticlesGridProps {
  articles: AdminArticle[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onEdit: (article: AdminArticle) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: AdminArticleStatus) => void;
  onResetFilters?: () => void;
  className?: string;
}

export function AdminArticlesGrid({
  articles,
  selectedIds,
  onToggleSelect,
  onEdit,
  onDelete,
  onStatusChange,
  onResetFilters,
  className,
}: AdminArticlesGridProps) {
  if (articles.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center">
        <AdminEmptyState
          title="Tidak Ada Artikel Ditemukan"
          description="Coba ubah kata kunci pencarian atau sesuaikan status filter di atas."
          actionLabel={onResetFilters ? "Reset Filter" : undefined}
          onAction={onResetFilters}
          className="w-full border-dashed"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full",
        className
      )}
    >
      {articles.map((article) => (
        <AdminArticleCard
          key={article.id}
          article={article}
          isSelected={selectedIds.includes(article.id)}
          onToggleSelect={onToggleSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
