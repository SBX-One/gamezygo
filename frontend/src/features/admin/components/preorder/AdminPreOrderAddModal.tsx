import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CloseXIcon } from "../catalog/section/AdminSectionIcons";
import type { PreOrderItem } from "../../types/admin-preorder.types";

export interface AdminPreOrderAddModalProps {
  isOpen: boolean;
  item?: PreOrderItem | null;
  onClose: () => void;
  onSave: (data: Omit<PreOrderItem, "id">, id?: string) => void;
  className?: string;
}

const CATEGORIES = [
  "Action",
  "Adventure",
  "Open World",
  "Crime",
  "Shooter",
  "RPG",
  "Sports",
  "Racing",
];

export function AdminPreOrderAddModal({
  isOpen,
  item,
  onClose,
  onSave,
  className,
}: AdminPreOrderAddModalProps) {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("480000");
  const [imageSrc, setImageSrc] = React.useState(
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg"
  );
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([
    "Action",
    "Adventure",
  ]);

  React.useEffect(() => {
    if (item) {
      setTitle(item.title);
      setPrice(String(item.price));
      setImageSrc(item.imageSrc);
      setSelectedCategories(item.categories);
    } else {
      setTitle("");
      setPrice("480000");
      setImageSrc(
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg"
      );
      setSelectedCategories(["Action", "Adventure"]);
    }
  }, [item, isOpen]);

  // Handle escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const numericPrice = Number(price.replace(/[^0-9]/g, "")) || 480000;
    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;

    onSave(
      {
        title: title.trim(),
        price: numericPrice,
        formattedPrice,
        imageSrc: imageSrc.trim(),
        categories:
          selectedCategories.length > 0
            ? selectedCategories
            : ["Action", "Adventure"],
        status: "pre-order",
      },
      item?.id
    );

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-[480px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 shadow-2xl select-none animate-in zoom-in-95 duration-150 overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-deep-blue-700 bg-deep-blue-950">
          <h3 className="text-base sm:text-lg font-bold text-gray-50 tracking-tight">
            {item ? "Edit Pre-order Game" : "Tambah Game Pre-order"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-50 hover:bg-deep-blue-900 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <CloseXIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Field: Product Name */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Grand Thief Auto VI"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-deep-blue-700 text-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:border-deep-blue-500 transition-colors"
            />
          </div>

          {/* Field: Price */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Price (IDR)
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="480000"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-deep-blue-700 text-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:border-deep-blue-500 transition-colors"
            />
          </div>

          {/* Field: Image URL */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
              placeholder="https://..."
              required
              className="w-full px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-deep-blue-700 text-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:border-deep-blue-500 transition-colors text-label-xs font-mono"
            />
          </div>

          {/* Field: Categories */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Kategori
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      "px-3 py-1 rounded-full text-label-xs font-medium transition-colors cursor-pointer",
                      isSelected
                        ? "bg-deep-blue-800 text-gray-50 font-semibold border border-deep-blue-500"
                        : "bg-deep-blue-900 hover:bg-deep-blue-850 text-gray-400 hover:text-gray-50 border border-deep-blue-700"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-deep-blue-700">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="cursor-pointer min-w-20 justify-center"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="cursor-pointer min-w-24 justify-center shadow-md"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
