import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import type { AdminCategoryGroup, SubCategoryItem } from "../../types/admin-category.types";

export interface AdminCategoryGroupCardProps {
  category: AdminCategoryGroup;
  onEditCategory: (category: AdminCategoryGroup) => void;
  onDeleteCategory?: (category: AdminCategoryGroup) => void;
  onAddSubCategory: (category: AdminCategoryGroup) => void;
  onEditSubCategory: (category: AdminCategoryGroup, sub: SubCategoryItem) => void;
  onDeleteSubCategory: (category: AdminCategoryGroup, sub: SubCategoryItem) => void;
  className?: string;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
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

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export function AdminCategoryGroupCard({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddSubCategory,
  onEditSubCategory,
  onDeleteSubCategory,
  className,
}: AdminCategoryGroupCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-deep-blue-950 border border-deep-blue-700 overflow-hidden transition-all duration-200 select-none shadow-xs",
        className
      )}
    >
      {/* 1. Header with bg-deep-blue-900 (Matching Figma: Outline xs buttons) */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-700 bg-deep-blue-900">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {category.title}
        </h3>

        <div className="flex items-center gap-2">
          {/* + Add Button: Button variant="outline" size="xs" (matching Figma guide) */}
          <Button
            variant="outline"
            size="xs"
            leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
            onClick={() => onAddSubCategory(category)}
            className="gap-1.5 px-3 py-1.5 min-h-7 h-7 text-xs"
          >
            Add
          </Button>

          {/* Edit Category Button: Button variant="outline" size="xs" */}
          <Button
            variant="outline"
            size="xs"
            leftIcon={<EditIcon className="w-3.5 h-3.5" />}
            onClick={() => onEditCategory(category)}
            className="w-7 h-7 min-w-7 min-h-7 p-0 flex items-center justify-center shrink-0"
            aria-label="Edit judul kategori"
          />

          {/* Optional Delete Category Button */}
          {onDeleteCategory && (
            <Button
              variant="outline"
              size="xs"
              leftIcon={<TrashIcon className="w-3.5 h-3.5" />}
              onClick={() => onDeleteCategory(category)}
              className="w-7 h-7 min-w-7 min-h-7 p-0 flex items-center justify-center shrink-0 hover:[&_.button-left-icon]:text-rose-400"
              aria-label="Hapus kategori ini"
            />
          )}
        </div>
      </div>

      {/* 2. Sub-categories List: Background deep-blue-950 ("sisanya 950") */}
      {category.subCategories.length === 0 ? (
        <div className="px-5 py-6 text-center text-xs text-gray-500 bg-deep-blue-950">
          Belum ada sub-kategori. Klik "+ Add" untuk menambahkan.
        </div>
      ) : (
        <div className="divide-y divide-deep-blue-700 bg-deep-blue-950">
          {category.subCategories.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-deep-blue-900/40 transition-colors bg-deep-blue-950"
            >
              {/* Sub-category Pill: Pill variant="secondary" */}
              <Pill
                variant="secondary"
                size="sm"
                className="px-3.5 py-1 text-gray-300 font-medium select-none"
              >
                {sub.name}
              </Pill>

              {/* Action Buttons: Button variant="outline" size="xs" (matching Figma guide) */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  leftIcon={<EditIcon className="w-3.5 h-3.5" />}
                  onClick={() => onEditSubCategory(category, sub)}
                  className="w-7 h-7 min-w-7 min-h-7 p-0 flex items-center justify-center shrink-0"
                  aria-label="Edit sub-kategori"
                />

                <Button
                  variant="outline"
                  size="xs"
                  leftIcon={<TrashIcon className="w-3.5 h-3.5" />}
                  onClick={() => onDeleteSubCategory(category, sub)}
                  className="w-7 h-7 min-w-7 min-h-7 p-0 flex items-center justify-center shrink-0 hover:[&_.button-left-icon]:text-rose-400"
                  aria-label="Hapus sub-kategori"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
