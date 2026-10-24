import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import type { AdminCatalogItem } from "../../types/admin-catalog.types";

export interface AdminCatalogAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<AdminCatalogItem, "id">, id?: string) => void;
  initialData?: AdminCatalogItem | null;
  className?: string;
}

const CATEGORY_CHOICES = [
  "Action",
  "Adventure",
  "Open World",
  "Shooter",
  "RPG",
  "Multiplayer",
  "Crime",
  "Fantasy",
  "Racing",
  "Strategy",
];

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function AdminCatalogAddModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  className,
}: AdminCatalogAddModalProps) {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("480000");
  const [imageSrc, setImageSrc] = React.useState(
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg"
  );
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([
    "Action",
    "Adventure",
  ]);
  const [isActive, setIsActive] = React.useState(true);
  const [isPreOrder, setIsPreOrder] = React.useState(false);
  const [isDraft, setIsDraft] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setPrice(String(initialData.price));
      setImageSrc(initialData.imageSrc);
      setSelectedCategories(initialData.categories);
      setIsActive(initialData.isActive);
      setIsPreOrder(Boolean(initialData.isPreOrder));
      setIsDraft(Boolean(initialData.isDraft));
    } else if (!isOpen) {
      setName("");
      setPrice("480000");
      setSelectedCategories(["Action", "Adventure"]);
      setIsActive(true);
      setIsPreOrder(false);
      setIsDraft(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        price: Number(price) || 0,
        imageSrc,
        categories:
          selectedCategories.length > 0 ? selectedCategories : ["Action"],
        isActive,
        isPreOrder,
        isDraft,
        isUnlisted: initialData?.isUnlisted ?? false,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={cn(
          "w-[560px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 shadow-2xl p-6 select-none animate-in zoom-in-95 duration-150 text-gray-200",
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-deep-blue-700">
          <h3 className="text-base font-semibold text-white">
            {initialData ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 mb-1.5 uppercase">
              Nama Produk / Game
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Grand Theft Auto VI"
              className="w-full h-10 px-3 bg-[#15161D] border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-label-xs font-semibold text-gray-400 mb-1.5 uppercase">
              Harga (IDR)
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="480000"
              className="w-full h-10 px-3 bg-[#15161D] border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-label-xs font-semibold text-gray-400 mb-1.5 uppercase">
              URL Cover Gambar
            </label>
            <input
              type="url"
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
              placeholder="https://..."
              className="w-full h-10 px-3 bg-[#15161D] border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-label-xs font-semibold text-gray-400 mb-1.5 uppercase">
              Kategori (Pilih Minimal 1)
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_CHOICES.map((cat) => {
                const isChecked = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-label-xs font-medium border transition-colors cursor-pointer",
                      isChecked
                        ? "bg-[#1E202B] text-white border-gray-400"
                        : "bg-[#15161D] text-gray-300 border-deep-blue-700 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <AdminCheckbox
              label="Langsung Aktifkan"
              checked={isActive}
              onChange={setIsActive}
            />
            <AdminCheckbox
              label="Pre-order"
              checked={isPreOrder}
              onChange={setIsPreOrder}
            />
            <AdminCheckbox
              label="Draft"
              checked={isDraft}
              onChange={setIsDraft}
            />
          </div>

          <div className="pt-4 border-t border-deep-blue-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1E202B] hover:bg-[#252837] border border-deep-blue-700 text-label-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[image:var(--gradient-primary-default)] text-white hover:brightness-110 active:scale-98 text-label-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
