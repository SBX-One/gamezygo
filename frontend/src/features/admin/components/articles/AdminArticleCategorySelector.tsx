import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAdminCategories } from "@/hooks/use-admin-categories";

export interface FallbackBlogCategory {
  id: number;
  name: string;
}

export interface AdminArticleCategorySelectorProps {
  selectedCategoryId: number | "";
  onSelectCategoryId: (id: number | "") => void;
  fallbackCategories?: FallbackBlogCategory[];
  className?: string;
}

export function AdminArticleCategorySelector({
  selectedCategoryId,
  onSelectCategoryId,
  fallbackCategories = [],
  className,
}: AdminArticleCategorySelectorProps) {
  const { data: adminCategoriesData } = useAdminCategories();

  const { groupedSections, flatCategories } = React.useMemo(() => {
    const groups = adminCategoriesData?.articleCategories ?? [];
    const withSubs: Array<{
      id: string;
      title: string;
      items: Array<{ id: number; name: string }>;
    }> = [];
    const flat: Array<{ id: number; name: string }> = [];

    if (groups.length > 0) {
      groups.forEach((group) => {
        if (group.subCategories && group.subCategories.length > 0) {
          const validSubs = group.subCategories
            .map((sub) => ({
              id: Number(sub.id),
              name: sub.name.trim(),
            }))
            .filter((s) => !Number.isNaN(s.id) && s.id > 0 && Boolean(s.name));
          if (validSubs.length > 0) {
            withSubs.push({
              id: group.id,
              title: group.title.trim(),
              items: validSubs,
            });
          }
        } else {
          const numId = Number(group.id);
          if (!Number.isNaN(numId) && numId > 0 && group.title.trim()) {
            flat.push({ id: numId, name: group.title.trim() });
          }
        }
      });
    } else if (fallbackCategories.length > 0) {
      fallbackCategories.forEach((c) => {
        if (c.id && c.name) {
          flat.push({ id: Number(c.id), name: c.name });
        }
      });
    }

    return { groupedSections: withSubs, flatCategories: flat };
  }, [adminCategoriesData, fallbackCategories]);

  const handleToggle = (id: number) => {
    onSelectCategoryId(selectedCategoryId === id ? "" : id);
  };

  if (groupedSections.length === 0 && flatCategories.length === 0) {
    return (
      <div className={cn("flex flex-col gap-2.5", className)}>
        <label className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase select-none">
          KATEGORI
        </label>
        <span className="text-body-xs text-gray-500 italic">
          Belum ada kategori artikel. Tambahkan di menu Kategori.
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {flatCategories.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <label className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase select-none">
            KATEGORI
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {flatCategories.map((cat) => {
              const isSelected = Number(selectedCategoryId) === cat.id;
              return (
                <Button
                  key={cat.id}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() => handleToggle(cat.id)}
                  className="cursor-pointer"
                >
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {groupedSections.map((group) => (
        <div key={group.id} className="flex flex-col gap-2.5">
          <label className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase select-none">
            {group.title}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {group.items.map((sub) => {
              const isSelected = Number(selectedCategoryId) === sub.id;
              return (
                <Button
                  key={`${group.id}-${sub.id}`}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() => handleToggle(sub.id)}
                  className="cursor-pointer"
                >
                  {sub.name}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
