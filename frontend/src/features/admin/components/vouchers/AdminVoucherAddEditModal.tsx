import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminVoucherItem } from "../../types/admin-voucher.types";

export interface AdminVoucherAddEditModalProps {
  isOpen: boolean;
  item?: AdminVoucherItem | null;
  onClose: () => void;
  onSave: (data: Omit<AdminVoucherItem, "id">, id?: string) => void;
  className?: string;
}

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

export function AdminVoucherAddEditModal({
  isOpen,
  item,
  onClose,
  onSave,
  className,
}: AdminVoucherAddEditModalProps) {
  const [code, setCode] = React.useState("");
  const [discountAmount, setDiscountAmount] = React.useState("480000");
  const [usageLimit, setUsageLimit] = React.useState("100");
  const [validityPeriod, setValidityPeriod] = React.useState("22/07/2026");
  const [minPurchase, setMinPurchase] = React.useState("500000");
  const [description, setDescription] = React.useState("");
  const [isDraft, setIsDraft] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (item) {
      setCode(item.code);
      setDiscountAmount(String(item.discountAmount));
      setUsageLimit(String(item.usageLimit || 100));
      setValidityPeriod(item.validityPeriod);
      setMinPurchase(String(item.minPurchase || 0));
      setDescription(item.description || "");
      setIsDraft(item.status === "draft");
      setIsActive(item.isActive);
    } else {
      setCode("");
      setDiscountAmount("480000");
      setUsageLimit("100");
      setValidityPeriod("22/07/2026");
      setMinPurchase("500000");
      setDescription("");
      setIsDraft(false);
      setIsActive(true);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const cleanAmount = parseFloat(discountAmount) || 0;
    const cleanUsageLimit = parseInt(usageLimit, 10) || 100;
    const cleanMinPurchase = parseFloat(minPurchase) || 0;

    onSave(
      {
        code: code.trim().toUpperCase(),
        discountAmount: cleanAmount,
        discountType: "flat",
        usageCount: item ? item.usageCount : 0,
        usageLimit: cleanUsageLimit,
        validityPeriod: validityPeriod.trim() || "22/07/2026",
        minPurchase: cleanMinPurchase,
        description: description.trim(),
        status: isDraft ? "draft" : isActive ? "active" : "inactive",
        isActive: isDraft ? false : isActive,
      },
      item?.id
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-125 max-w-[95vw] rounded-lg bg-[#0F111A] border border-white/10 p-6 sm:p-7 shadow-2xl select-none animate-in zoom-in-95 duration-150 text-left space-y-6",
          className
        )}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-deep-blue-700 pb-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              Voucher Management
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
              {item ? `Edit Voucher ${item.code}` : "Tambah Voucher Baru"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Voucher Code & Discount Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                Kode Voucher
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: SUMMER26"
                className="w-full h-10 px-3.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="block text-label-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                Nilai Diskon (Rp)
              </label>
              <input
                type="number"
                required
                min={1000}
                step={1000}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                placeholder="Contoh: 480000"
                className="w-full h-10 px-3.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Usage Limit & Validity Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                Batas Penggunaan (Limit)
              </label>
              <input
                type="number"
                min={1}
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Contoh: 100"
                className="w-full h-10 px-3.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-label-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
                Periode Berlaku (DD/MM/YYYY)
              </label>
              <input
                type="text"
                value={validityPeriod}
                onChange={(e) => setValidityPeriod(e.target.value)}
                placeholder="Contoh: 22/07/2026"
                className="w-full h-10 px-3.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Minimum Purchase */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
              Minimal Belanja (Rp)
            </label>
            <input
              type="number"
              min={0}
              step={5000}
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              placeholder="Contoh: 500000"
              className="w-full h-10 px-3.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wide">
              Deskripsi Voucher
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan singkat mengenai voucher ini..."
              className="w-full p-3 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Options: Draft & Active toggle */}
          <div className="flex items-center gap-6 pt-2 border-t border-deep-blue-700/60">
            <label className="flex items-center gap-2 cursor-pointer text-label-xs text-gray-300 select-none">
              <input
                type="checkbox"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="rounded border-deep-blue-700 bg-deep-blue-900 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Simpan sebagai Draft</span>
            </label>

            {!isDraft && (
              <label className="flex items-center gap-2 cursor-pointer text-label-xs text-gray-300 select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-deep-blue-700 bg-deep-blue-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Aktifkan langsung</span>
              </label>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-deep-blue-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#181A22] hover:bg-[#222533] border border-white/10 text-white text-label-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-label-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm select-none"
            >
              {item ? "Simpan Perubahan" : "Buat Voucher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
