import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCatalogDeleteModal } from "../AdminCatalogDeleteModal";
import type {
  SpecItem,
  AdminAddProductFormData,
} from "../../../types/admin-add-product.types";
import { Button } from "@/components/ui";

export interface AdminAddProductSpecsProps {
  formData: AdminAddProductFormData;
  onChange: (fields: Partial<AdminAddProductFormData>) => void;
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
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
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
    <path d="M4 6h16" />
    <path d="M5 6v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

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

export function AdminAddProductSpecs({
  formData,
  onChange,
  className,
}: AdminAddProductSpecsProps) {
  // Drawer state for adding/editing a spec (matching Image 1)
  const [drawerState, setDrawerState] = React.useState<{
    isOpen: boolean;
    type: "minimum" | "recommendation";
    editingItem?: SpecItem | null;
  }>({
    isOpen: false,
    type: "minimum",
  });

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    type: "minimum" | "recommendation";
    item?: SpecItem | null;
  }>({
    isOpen: false,
    type: "minimum",
  });

  const [inputLabel, setInputLabel] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const handleOpenAdd = (type: "minimum" | "recommendation") => {
    setInputLabel("");
    setInputValue("");
    setDrawerState({ isOpen: true, type, editingItem: null });
  };

  const handleOpenEdit = (type: "minimum" | "recommendation", item: SpecItem) => {
    setInputLabel(item.label);
    setInputValue(item.value);
    setDrawerState({ isOpen: true, type, editingItem: item });
  };

  const handleSaveSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLabel.trim() || !inputValue.trim()) return;

    const targetList =
      drawerState.type === "minimum"
        ? formData.minimumSpecs
        : formData.recommendationSpecs;

    let updated: SpecItem[];
    if (drawerState.editingItem) {
      updated = targetList.map((item) =>
        item.id === drawerState.editingItem?.id
          ? { ...item, label: inputLabel.trim(), value: inputValue.trim() }
          : item
      );
    } else {
      updated = [
        ...targetList,
        {
          id: `spec-${Date.now()}`,
          label: inputLabel.trim(),
          value: inputValue.trim(),
        },
      ];
    }

    if (drawerState.type === "minimum") {
      onChange({ minimumSpecs: updated });
    } else {
      onChange({ recommendationSpecs: updated });
    }

    setDrawerState({ isOpen: false, type: "minimum" });
  };

  const handleConfirmDelete = () => {
    if (!deleteModalState.item) return;
    const id = deleteModalState.item.id;
    if (deleteModalState.type === "minimum") {
      onChange({
        minimumSpecs: formData.minimumSpecs.filter((item) => item.id !== id),
      });
    } else {
      onChange({
        recommendationSpecs: formData.recommendationSpecs.filter(
          (item) => item.id !== id
        ),
      });
    }
    setDeleteModalState({ isOpen: false, type: "minimum" });
  };

  return (
    <div className={cn("flex flex-col gap-3.5 w-full", className)}>
      {/* Section Title */}
      <h3 className="text-h3 sm:text-h5 font-semibold text-white select-none">
        Detail Spesifikasi
      </h3>

      {/* Grid 2 Columns (Matching Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* ========================================================
            CARD 1: MINIMUM SPECS
           ======================================================== */}
        <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden flex flex-col shadow-sm">
          {/* Header (Matching Image 1: MINIMUM + Add New) */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-700/80 bg-deep-blue-900/60 select-none">
            <h4 className="text-body-xs sm:text-h6 font-semibold text-white ">
              Minimum Specs
            </h4>
            <Button
            variant={"outline"}
            size={"xs"}
              type="button"
              onClick={() => handleOpenAdd("minimum")}
              className="px-3 py-2 flex gap-1 "
         >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add</span>
            </Button>
          </div>

          {/* Body Items List */}
          {formData.minimumSpecs.length > 0 ? (
            <div className="divide-y divide-deep-blue-700/80">
              {formData.minimumSpecs.map((item) => (
                <div
                  key={item.id}
                  className="p-6 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                    <span className="text-body-xs text-gray-400 font-normal">
                      {item.label}
                    </span>
                    <span className="text-label-xs sm:text-body-sm font-semibold text-white truncate sm:whitespace-normal">
                      {item.value}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant={"outline"}
                      size={"xs"}
                      type="button"
                      onClick={() => handleOpenEdit("minimum", item)}
                      aria-label={`Edit ${item.label}`}
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                    variant={"outline"}
                    size={"xs"}
                      type="button"
                      onClick={() =>
                        setDeleteModalState({
                          isOpen: true,
                          type: "minimum",
                          item,
                        })
                      }
                   aria-label={`Hapus ${item.label}`}
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center select-none">
              <h5 className="text-sm font-bold text-white mb-1">
                Tambahkan Spesifikasi
              </h5>
              <p className="text-label-xs text-gray-400 mb-4">
                Anda belum menambahkan list spesifikasi minimum.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAdd("minimum")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E202B] hover:bg-[#272A38] border border-deep-blue-700 text-label-xs font-medium text-white transition-colors cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Tambah Spesifikasi</span>
              </button>
            </div>
          )}
        </div>

        {/* ========================================================
            CARD 2: RECOMMENDATION SPECS
           ======================================================== */}
        <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden flex flex-col shadow-sm">
          {/* Header (Matching Image 1: RECOMMENDATION + Add New) */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-deep-blue-700/80 bg-deep-blue-900/60 select-none">
            <h4 className="text-body-xs sm:text-h6 font-semibold text-white">
              Recommendation Specs
            </h4>
            <Button
              variant={"outline"}
              size={"xs"}
              type="button"
              onClick={() => handleOpenAdd("recommendation")}
              className="px-3 py-2 flex gap-1"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add</span>
            </Button>
          </div>

          {/* Body */}
          {formData.recommendationSpecs.length > 0 ? (
            <div className="divide-y divide-deep-blue-700/80">
              {formData.recommendationSpecs.map((item) => (
                <div
                  key={item.id}
                  className="p-6 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                    <span className="text-body-xs text-gray-400 font-normal">
                      {item.label}
                    </span>
                    <span className="text-label-xs sm:text-body-sm font-semibold text-white truncate sm:whitespace-normal">
                      {item.value}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant={"outline"}
                      size={"xs"}
                      type="button"
                      onClick={() => handleOpenEdit("recommendation", item)}
                      aria-label={`Edit ${item.label}`}
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"xs"}
                      type="button"
                      onClick={() =>
                        setDeleteModalState({
                          isOpen: true,
                          type: "recommendation",
                          item,
                        })
                      }
                      aria-label={`Hapus ${item.label}`}
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center select-none my-auto">
              <h5 className="text-body-sm sm:text-h6 font-semibold text-white mb-1 tracking-tight">
                Tambahkan Spesifikasi
              </h5>
              <p className="text-body-xs text-gray-400 mb-6 font-normal">
                Anda belum menambahkan list spesifikasi.
              </p>
              <Button
                variant={"outline"}
                size={"sm"}
                type="button"
                onClick={() => handleOpenAdd("recommendation")}
                className="px-4 py-2 flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Tambah Spesifikasi</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          RIGHT-SIDE SLIDE-OVER DRAWER MODAL (Matching Image 1)
         ======================================================== */}
      {drawerState.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setDrawerState({ isOpen: false, type: "minimum" })}
          />

          <div className="relative z-10 w-[420px] max-w-full h-full bg-[#13151F] border-l border-deep-blue-700 shadow-2xl p-6 sm:p-7 flex flex-col justify-between select-none animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-deep-blue-700">
                <h3 className="text-h6 sm:text-h5 font-semibold text-white tracking-tight">
                  Detail Spesifikasi
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setDrawerState({ isOpen: false, type: "minimum" })
                  }
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Form Fields */}
              <form
                id="spec-drawer-form"
                onSubmit={handleSaveSpec}
                className="pt-6 space-y-6"
              >
                {/* Field 1: JENIS SPESIFIKASI */}
                <div className="flex flex-col gap-2">
                  <label className="text-body-xs font-semibold text-gray-400 uppercase">
                    JENIS SPESIFIKASI
                  </label>
                  <input
                    type="text"
                    required
                    value={inputLabel}
                    onChange={(e) => setInputLabel(e.target.value)}
                    placeholder="ex. OS version"
                    className="w-full h-10 px-4 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-body-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                </div>

                {/* Field 2: SPESIFIKASI */}
                <div className="flex flex-col gap-2">
                  <label className="text-body-xs font-semibold text-gray-400 uppercase">
                    SPESIFIKASI
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="ex. Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)"
                    className="w-full p-4 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-body-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors resize-none leading-relaxed"
                  />
                </div>
              </form>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-deep-blue-700/80">
              <Button
                variant={"inactive"}
                size={"sm"}
                type="button"
                onClick={() =>
                  setDrawerState({ isOpen: false, type: "minimum" })
                }
              >
                Batalkan
              </Button>
              <Button
                variant={"primary"}
                size={"sm"}
                type="submit"
                form="spec-drawer-form"
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
         ======================================================== */}
      <AdminCatalogDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, type: "minimum" })}
        onConfirm={handleConfirmDelete}
        title="Are you sure to delete this specification?"
        description="If you delete this specification you can’t recover it."
      />
    </div>
  );
}
