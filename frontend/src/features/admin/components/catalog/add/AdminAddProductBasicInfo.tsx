import * as React from "react";
import { cn } from "@/lib/utils";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { AdminSwitch } from "@/components/admin/AdminSwitch";
import { AdminAddProductMediaUpload } from "./AdminAddProductMediaUpload";
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

export function AdminAddProductBasicInfo({
  formData,
  onChange,
  showPreOrder = true,
  className,
}: AdminAddProductBasicInfoProps) {
  const toggleGenre = (genre: string) => {
    const isSelected = formData.genres.includes(genre);
    const updated = isSelected
      ? formData.genres.filter((g) => g !== genre)
      : [...formData.genres, genre];
    onChange({ genres: updated });
  };

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full",
        className
      )}
    >
      {/* 1. Media Upload Box (Left: 2/5) */}
      <div className="w-full lg:w-2/5 shrink-0 flex justify-center lg:justify-start">
        <AdminAddProductMediaUpload
          value={formData.imageSrc}
          onChange={(url) => onChange({ imageSrc: url })}
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
            className="bg-[#15161D] border-deep-blue-700 hover:border-gray-500 text-white"
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
            className="bg-[#15161D] border-deep-blue-700 hover:border-gray-500 text-white"
          />
          <InputField
            label="HARGA AWAL"
            placeholder="Harga awal produk"
            type="number"
            size="md"
            value={formData.initialPrice}
            onChange={(e) => onChange({ initialPrice: e.target.value })}
            className="bg-[#15161D] border-deep-blue-700 hover:border-gray-500 text-white"
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
          <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase select-none">
            GENRE
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {GENRE_CHOICES.map((genre, idx) => {
              const isSelected = formData.genres.includes(genre);
              return (
                <Button
                  key={`${genre}-${idx}`}
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
      </div>
    </div>
  );
}
