import * as React from "react";
import { cn } from "@/lib/utils";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { AdminSwitch } from "@/components/admin/AdminSwitch";
import { AdminAddProductMediaUpload } from "./AdminAddProductMediaUpload";
import { useAdminCategories } from "@/hooks/use-admin-categories";
import {
  GENRE_CHOICES,
  type AdminAddProductFormData,
} from "../../../types/admin-add-product.types";

export interface AdminAddProductBasicInfoProps {
  formData: AdminAddProductFormData;
  onChange: (fields: Partial<AdminAddProductFormData>) => void;
  showPreOrder?: boolean;
  className?: string;
}

// Map legacy or synonym genres to standard design tokens
function normalizeGenreName(rawGenre: string): string {
  const trimmed = rawGenre.trim();
  const lower = trimmed.toLowerCase();

  // Normalize legacy sports/racing variations to the standard "Sport-Racing"
  if (
    lower === "sports" ||
    lower === "sport" ||
    lower === "racing" ||
    lower === "sport-racing"
  ) {
    return "Sport-Racing";
  }

  // Case-insensitive match against standard GENRE_CHOICES
  const matched = GENRE_CHOICES.find(
    (choice) => choice.toLowerCase() === lower
  );
  if (matched) return matched;

  // Capitalize custom genre
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function AdminAddProductBasicInfo({
  formData,
  onChange,
  showPreOrder = true,
  className,
}: AdminAddProductBasicInfoProps) {
  const { data: adminCategoriesData } = useAdminCategories();

  // Canonical active genres from formData
  const canonicalSelectedGenres = React.useMemo(() => {
    if (!formData.genres?.length) return [];
    return Array.from(
      new Set(formData.genres.map(normalizeGenreName).filter(Boolean))
    );
  }, [formData.genres]);

  // Separate core "Genre" choices from custom Product Main Categories (2-level hierarchy)
  const { allGenres, customCategoryGroups } = React.useMemo(() => {
    const genreList = [...GENRE_CHOICES] as string[];
    const customGroups: Array<{
      id: string;
      title: string;
      items: string[];
    }> = [];

    const dynamicGroups = adminCategoriesData?.productCategories ?? [];
    dynamicGroups.forEach((group) => {
      const groupTitleLower = group.title.trim().toLowerCase();
      // Launcher & Promotion are rendered in AdminAddProductLauncherSection
      if (
        groupTitleLower === "launcher" ||
        groupTitleLower === "platform" ||
        groupTitleLower === "promotion"
      ) {
        return;
      }

      if (groupTitleLower === "genre") {
        (group.subCategories ?? []).forEach((sub) => {
          const norm = normalizeGenreName(sub.name);
          if (norm && !genreList.some((c) => c.toLowerCase() === norm.toLowerCase())) {
            genreList.push(norm);
          }
        });
        return;
      }

      // Custom Main Category with sub-categories -> render its own dedicated row below GENRE
      if (group.subCategories && group.subCategories.length > 0) {
        const uniqueSubs = Array.from(
          new Set(group.subCategories.map((sub) => sub.name.trim()).filter(Boolean))
        );
        if (uniqueSubs.length > 0) {
          customGroups.push({
            id: group.id,
            title: group.title.trim(),
            items: uniqueSubs,
          });
        }
        return;
      }

      // Legacy flat root category without sub-categories -> include in GENRE
      if (group.title) {
        const norm = normalizeGenreName(group.title);
        if (norm && !genreList.some((c) => c.toLowerCase() === norm.toLowerCase())) {
          genreList.push(norm);
        }
      }
    });

    const customSubSet = new Set(
      customGroups.flatMap((g) => g.items.map((item) => item.toLowerCase()))
    );

    canonicalSelectedGenres.forEach((g) => {
      if (
        !customSubSet.has(g.toLowerCase()) &&
        !genreList.some((choice) => choice.toLowerCase() === g.toLowerCase())
      ) {
        genreList.push(g);
      }
    });

    return { allGenres: genreList, customCategoryGroups: customGroups };
  }, [adminCategoriesData, canonicalSelectedGenres]);

  const toggleGenre = (genre: string) => {
    const targetNorm = normalizeGenreName(genre);
    const isSelected = canonicalSelectedGenres.some(
      (g) => g.toLowerCase() === targetNorm.toLowerCase()
    );

    const updated = isSelected
      ? canonicalSelectedGenres.filter(
          (g) => g.toLowerCase() !== targetNorm.toLowerCase()
        )
      : [...canonicalSelectedGenres, targetNorm];

    onChange({ genres: updated });
  };

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row items-center gap-6 lg:gap-8 w-full",
        className
      )}
    >
      {/* 1. Media Upload Box (Left: 2/5) */}
      <div className="w-full lg:w-1/5 shrink-0 flex justify-center lg:justify-start">
        <AdminAddProductMediaUpload
          value={formData.imageSrc}
          onChange={(url) => onChange({ imageSrc: url })}
          onFileChange={(file) => onChange({ imageFile: file })}
        />
      </div>

      {/* 2. Form Details (Right: 3/5) */}
      <div className="w-full lg:w-3/5 flex-1 flex flex-col gap-5">
        {/* Row 1: Nama Produk */}
        <div className="w-full">
          <InputField
            label="NAMA PRODUK"
            placeholder="Nama produk"
            size="md"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="bg-deep-blue-900 hover:border-gray-500 text-white"
          />
        </div>

        {/* Row 2: Harga Akhir & Harga Awal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <InputField
            label="HARGA AKHIR"
            placeholder="Harga akhir produk"
            type="number"
            size="md"
            value={formData.finalPrice}
            onChange={(e) => onChange({ finalPrice: e.target.value })}
            className="bg-deep-blue-900 hover:border-gray-500 text-white"
          />
          <InputField
            label="HARGA AWAL"
            placeholder="Harga awal produk"
            type="number"
            size="md"
            value={formData.initialPrice}
            onChange={(e) => onChange({ initialPrice: e.target.value })}
            className="bg-deep-blue-900 hover:border-gray-500 text-white"
          />
        </div>

        {/* Row 3: Pre-order Switch Toggle */}
        {showPreOrder && (
          <div className="flex items-center gap-3 pt-1">
            <AdminSwitch
              checked={formData.isPreOrder}
              onChange={(checked) => onChange({ isPreOrder: checked })}
              ariaLabel="Toggle Pre-order"
            />
            <span className="text-sm font-medium text-gray-200 select-none">
              Pre-order
            </span>
          </div>
        )}

        {/* Row 4: Genre Chips List */}
        <div className="flex flex-col gap-2.5 pt-1">
          <label className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase select-none">
            GENRE
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {allGenres.map((genre) => {
              const isSelected = canonicalSelectedGenres.some(
                (g) => g.toLowerCase() === genre.toLowerCase()
              );
              return (
                <Button
                  key={genre}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() => toggleGenre(genre)}
                  className="cursor-pointer"
                >
                  {genre}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Custom Product Main Categories (e.g. Promo / Event -> Happy New Year, etc.) */}
        {customCategoryGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-2.5 pt-1">
            <label className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase select-none">
              {group.title}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {group.items.map((subName) => {
                const isSelected = canonicalSelectedGenres.some(
                  (g) => g.toLowerCase() === subName.toLowerCase()
                );
                return (
                  <Button
                    key={`${group.id}-${subName}`}
                    type="button"
                    variant={isSelected ? "active" : "inactive"}
                    size="sm"
                    onClick={() => toggleGenre(subName)}
                    className="cursor-pointer"
                  >
                    {subName}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
