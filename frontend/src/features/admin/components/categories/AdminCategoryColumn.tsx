import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FluentBookIcon } from "@/components/admin/AdminEmptyState";
import { AdminCategoryGroupCard } from "./AdminCategoryGroupCard";
import type {
  AdminCategoryGroup,
  CategoryScope,
  SubCategoryItem,
} from "../../types/admin-category.types";

export interface AdminCategoryColumnProps {
  title: string;
  scope: CategoryScope;
  categories: AdminCategoryGroup[];
  onAddNewCategory: (scope: CategoryScope) => void;
  onEditCategory: (category: AdminCategoryGroup) => void;
  onDeleteCategory: (category: AdminCategoryGroup) => void;
  onAddSubCategory: (category: AdminCategoryGroup) => void;
  onEditSubCategory: (category: AdminCategoryGroup, sub: SubCategoryItem) => void;
  onDeleteSubCategory: (category: AdminCategoryGroup, sub: SubCategoryItem) => void;
  className?: string;
  showRightBorder?: boolean;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function AdminCategoryColumn({
  title,
  scope,
  categories,
  onAddNewCategory,
  onEditCategory,
  onDeleteCategory,
  onAddSubCategory,
  onEditSubCategory,
  onDeleteSubCategory,
  className,
  showRightBorder = false,
}: AdminCategoryColumnProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-w-0 select-none bg-deep-blue-950",
        showRightBorder && "lg:border-r lg:border-deep-blue-700",
        className
      )}
    >
      {/* 1. Header with bg-deep-blue-900 (Matching Image 2) */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-deep-blue-700 bg-deep-blue-900">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {title}
        </h2>

        {/* + Add New Category button (red gradient) */}
        <button
          type="button"
          onClick={() => onAddNewCategory(scope)}
          className="inline-flex items-center gap-1.5 px-4 sm:px-5 h-10 rounded-lg bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-label-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer shrink-0"
        >
          <PlusIcon />
          <span>Add New Category</span>
        </button>
      </div>

      {/* 2. Body List of Category Group Cards with bg-deep-blue-950 ("sisanya 950") */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col gap-5 overflow-y-auto bg-deep-blue-950">
        {categories.length === 0 ? (
          /* Empty State matching Image 2 */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-12 select-none mx-auto w-full min-h-[460px]">
            {/* Rounded book icon container matching Image 2 */}
            <div className="w-14 h-14 rounded-lg bg-[#141622] border border-white/5 flex items-center justify-center text-gray-200 mb-4 shadow-xs">
              <FluentBookIcon className="w-7 h-7 text-gray-300" />
            </div>

            {/* Title matching Image 2 */}
            <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
              Belum Ada Ditambahkan
            </h4>

            {/* Subtitle matching Image 2 */}
            <p className="text-label-xs sm:text-sm text-gray-400 font-normal text-center mb-6 leading-relaxed w-full">
              Katalog Subscription Anda saat ini masih kosong.
            </p>

            {/* Action Button: + Tambah Kategori */}
            <Button
              variant="inactive"
              size="sm"
              onClick={() => onAddNewCategory(scope)}
              leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
              className="!gap-2 px-4 py-2"
            >
              Tambah Kategori
            </Button>
          </div>
        ) : (
          categories.map((category) => (
            <AdminCategoryGroupCard
              key={category.id}
              category={category}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              onAddSubCategory={onAddSubCategory}
              onEditSubCategory={onEditSubCategory}
              onDeleteSubCategory={onDeleteSubCategory}
            />
          ))
        )}
      </div>
    </div>
  );
}
