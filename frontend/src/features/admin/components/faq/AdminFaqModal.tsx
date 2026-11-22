import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminFaqItem } from "../../types/admin-faq.types";

export interface AdminFaqModalProps {
  isOpen: boolean;
  item?: AdminFaqItem | null;
  activeCategory: string;
  categories: string[];
  onClose: () => void;
  onSave: (data: { question: string; answer: string; category: string }) => void;
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

export function AdminFaqModal({
  isOpen,
  item,
  activeCategory,
  onClose,
  onSave,
  className,
}: AdminFaqModalProps) {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  React.useEffect(() => {
    if (item) {
      setQuestion(item.question);
      setAnswer(item.answer);
    } else {
      setQuestion("");
      setAnswer("");
    }
  }, [item, isOpen]);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    onSave({
      question: question.trim(),
      answer: answer.trim(),
      category: item?.category || activeCategory,
    });
  };

  const isEditing = Boolean(item);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden select-none font-sans"
    >
      {/* Dimmed backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Slide-over Drawer Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-10 w-[500px] max-w-[95vw] h-full bg-deep-blue-950 border-l border-deep-blue-700 shadow-2xl flex flex-col justify-start animate-in slide-in-from-right duration-200 overflow-y-auto",
          className
        )}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-deep-blue-700">
          <h3
            id="faq-drawer-title"
            className="text-lg sm:text-xl font-bold text-white tracking-tight"
          >
            {isEditing ? "Edit Question" : "New Question"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-8">
          {/* QUESTION */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              QUESTION
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pertanyaan"
              className="w-full h-11 px-4 bg-deep-blue-900 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* ANSWER */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              ANSWER
            </label>
            <textarea
              rows={4}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Jawaban"
              className="w-full min-h-[96px] p-4 bg-deep-blue-900 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons: [ Batalkan ] & [ Simpan ] */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <Button
              type="button"
              variant="inactive"
              size="sm"
              onClick={onClose}
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

