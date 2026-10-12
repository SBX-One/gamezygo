import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  CloseXIcon,
  PlusIcon,
  MinusIcon,
  GripSixDotsIcon,
} from "../catalog/section/AdminSectionIcons";
import type { SubscriptionPlan } from "../../types/admin-subscription.types";

export interface AdminEditPlanModalProps {
  isOpen: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (updatedPlan: SubscriptionPlan) => void;
  className?: string;
}

export function AdminEditPlanModal({
  isOpen,
  plan,
  onClose,
  onSave,
  className,
}: AdminEditPlanModalProps) {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [periodMonths, setPeriodMonths] = React.useState<number>(1);
  const [benefits, setBenefits] = React.useState<string[]>([""]);

  React.useEffect(() => {
    if (plan) {
      setName(plan.title);
      setPrice(plan.price || "");
      // Parse duration like "1 BULAN" to number
      const parsedMonths = parseInt(plan.duration) || 1;
      setPeriodMonths(parsedMonths);
      setBenefits(
        plan.benefits && plan.benefits.length > 0
          ? [...plan.benefits]
          : ["Membuka 1000+ Game"]
      );
    }
  }, [plan]);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
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

  if (!isOpen || !plan) return null;

  const handleBenefitChange = (index: number, value: string) => {
    setBenefits((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddBenefit = () => {
    setBenefits((prev) => [...prev, ""]);
  };

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length <= 1) return;
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const filteredBenefits = benefits
      .map((b) => b.trim())
      .filter(Boolean);

    onSave({
      ...plan,
      title: name.trim(),
      duration: `${periodMonths} BULAN`,
      price: price.trim() || "IDR 150,000",
      benefits:
        filteredBenefits.length > 0 ? filteredBenefits : ["Membuka 1000+ Game"],
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-[420px] sm:w-[460px] max-w-full h-full bg-deep-blue-950 border-l border-deep-blue-700 shadow-2xl select-none animate-in slide-in-from-right duration-200 flex flex-col overflow-hidden",
          className
        )}
      >
        {/* Header (Matching Image 2) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-deep-blue-700 bg-deep-blue-950 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-50 tracking-tight">
            Subscription Package
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

        {/* Form Body (Matching Image 2 Sidebar Drawer) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Field: NAMA */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              NAMA
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Paket 1"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-deep-blue-900 border border-deep-blue-700 text-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:border-deep-blue-500 transition-colors"
            />
          </div>

          {/* Field: HARGA */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              HARGA
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="ex. IDR 450,000"
              className="w-full px-4 py-2.5 rounded-xl bg-deep-blue-900 border border-deep-blue-700 text-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:border-deep-blue-500 transition-colors"
            />
          </div>

          {/* Field: PERIOD (Stepper pill: [ - ] 1 month [ + ]) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              PERIOD
            </label>
            <div className="inline-flex items-center bg-deep-blue-900 border border-deep-blue-700 rounded-xl px-3 py-1.5 gap-3 text-sm text-gray-200">
              <button
                type="button"
                onClick={() => setPeriodMonths((prev) => Math.max(1, prev - 1))}
                className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
                disabled={periodMonths <= 1}
                aria-label="Kurangi durasi"
              >
                <MinusIcon className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold select-none min-w-16 text-center text-xs sm:text-sm">
                {periodMonths} {periodMonths === 1 ? "month" : "months"}
              </span>
              <button
                type="button"
                onClick={() => setPeriodMonths((prev) => prev + 1)}
                className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Tambah durasi"
              >
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Field: BENEFIT */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              BENEFIT
            </label>
            <div className="space-y-2.5">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 bg-deep-blue-900 border border-deep-blue-700 rounded-xl px-3.5 py-2.5 focus-within:border-deep-blue-500 transition-colors"
                >
                  <GripSixDotsIcon className="w-4 h-4 text-gray-500 shrink-0 cursor-grab" />
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleBenefitChange(idx, e.target.value)}
                    placeholder="ex. Membuka 1000+ Game"
                    className="w-full bg-transparent text-gray-50 text-xs sm:text-sm placeholder:text-gray-500 focus:outline-none"
                  />
                  {benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="p-1 text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Hapus benefit"
                    >
                      <CloseXIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* + TAMBAH BENEFIT dashed button */}
              <button
                type="button"
                onClick={handleAddBenefit}
                className="w-full py-2.5 rounded-xl border border-dashed border-deep-blue-700/80 hover:border-deep-blue-500 text-gray-400 hover:text-gray-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>TAMBAH BENEFIT</span>
              </button>
            </div>
          </div>

          {/* Footer Actions (Matching Image 2) */}
          <div className="flex items-center justify-end gap-3 pt-6">
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
