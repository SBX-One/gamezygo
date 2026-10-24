import * as React from "react";
import { cn } from "@/lib/utils";
import type { InstructionTemplate, InstructionStep } from "../../types/admin-instruction.types";

export interface AdminInstructionCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTemplate: InstructionTemplate) => void;
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
  </svg>
);

export function AdminInstructionCreateModal({
  isOpen,
  onClose,
  onSave,
  className,
}: AdminInstructionCreateModalProps) {
  const [title, setTitle] = React.useState("");
  const [steps, setSteps] = React.useState<InstructionStep[]>([
    {
      stepNumber: 1,
      title: "",
      description: "",
    },
    {
      stepNumber: 2,
      title: "",
      description: "",
    },
  ]);

  React.useEffect(() => {
    if (isOpen) {
      setTitle("");
      setSteps([
        {
          stepNumber: 1,
          title: "",
          description: "",
        },
        {
          stepNumber: 2,
          title: "",
          description: "",
        },
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        stepNumber: prev.length + 1,
        title: "",
        description: "",
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, stepNumber: i + 1 }))
    );
  };

  const handleStepChange = (
    index: number,
    field: "title" | "description",
    val: string
  ) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTemplate: InstructionTemplate = {
      id: `inst-${Date.now()}`,
      title: title.trim(),
      badge: "Listed",
      createdAt: "22/07/2026",
      lastEdit: "Just now",
      steps: steps.map((s, i) => ({
        stepNumber: i + 1,
        title: s.title.trim() || `Langkah ${i + 1}`,
        description: s.description.trim() || "Instruksi panduan akun game.",
      })),
    };

    onSave(newTemplate);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-template-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 w-145 max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-6 sm:p-7 shadow-2xl flex flex-col animate-in zoom-in-95 duration-150",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-deep-blue-700">
          <h3
            id="create-template-modal-title"
            className="text-lg font-bold text-white tracking-tight"
          >
            Create New Instruction Template
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-5">
          {/* Title */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Judul Template
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Panduan Download Game"
              className="w-full h-11 px-4 bg-deep-blue-950 border border-deep-blue-700 rounded-lg text-label-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-deep-blue-500"
            />
          </div>

          {/* Steps Builder */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <label className="text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
                Langkah-Langkah Instruksi
              </label>

              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-deep-blue-950 hover:bg-deep-blue-800 text-label-xs font-medium text-white border border-deep-blue-700 transition-colors cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5 text-gray-300" />
                <span>Tambah Langkah</span>
              </button>
            </div>

            <div className="flex flex-col gap-3.5 max-h-75 overflow-y-auto pr-1">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-4 flex flex-col gap-2.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      LANGKAH {step.stepNumber}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-gray-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        aria-label="Hapus langkah"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    value={step.title}
                    onChange={(e) =>
                      handleStepChange(idx, "title", e.target.value)
                    }
                    placeholder="Judul langkah (misal: Cari game di katalog)"
                    className="w-full h-9 px-3 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-deep-blue-500"
                  />

                  <textarea
                    rows={2}
                    required
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(idx, "description", e.target.value)
                    }
                    placeholder="Deskripsi langkah detail..."
                    className="w-full p-2.5 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs text-white placeholder-gray-500 focus:outline-none focus:border-deep-blue-500 resize-none leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-deep-blue-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-deep-blue-950 hover:bg-deep-blue-800 border border-deep-blue-700 text-white text-label-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-label-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              Simpan Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
