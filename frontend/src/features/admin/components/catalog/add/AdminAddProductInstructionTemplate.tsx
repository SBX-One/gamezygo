import * as React from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { InstructionContentRenderer } from "@/components/shared/InstructionContentRenderer";
import {
  type InstructionTemplateItem,
  type AdminAddProductFormData,
} from "../../../types/admin-add-product.types";
import {
  useAdminInstructions,
  useCreateAdminInstruction,
} from "@/hooks/use-admin-instructions";
import { toast } from "@/stores/use-toast-store";

export interface AdminAddProductInstructionTemplateProps {
  formData: AdminAddProductFormData;
  onChange: (fields: Partial<AdminAddProductFormData>) => void;
  onCreateNewTemplate?: () => void;
  className?: string;
}

const BookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="5" y="3" width="14" height="18" rx="3" />
    <path d="M9 7h6" />
    <path d="M9 11h6" />
    <path d="M9 15h4" />
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

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export function AdminAddProductInstructionTemplate({
  formData,
  onChange,
  onCreateNewTemplate,
  className,
}: AdminAddProductInstructionTemplateProps) {
  const router = useRouter();
  const { data: instructionsResult } = useAdminInstructions({ per_page: 100 });
  const createInstructionMutation = useCreateAdminInstruction();

  const templates: InstructionTemplateItem[] = React.useMemo(() => {
    const apiList = instructionsResult?.instructions ?? [];
    return apiList.map((item) => ({
      id: String(item.id),
      title: item.title || "Untitled Instruction",
      badge: item.badge === "Draft" ? "Draft" : "Listed",
      createdAt: item.createdAt || "-",
      lastEdit: item.lastEdit || "Baru saja",
      content: item.content,
      steps:
        Array.isArray(item.steps) && item.steps.length > 0
          ? item.steps
          : [
              {
                stepNumber: 1,
                title: item.title || "Instruksi",
                description:
                  "Ikuti langkah download dan login sesuai panduan resmi akun game.",
              },
            ],
    }));
  }, [instructionsResult]);

  const [isChooseModalOpen, setIsChooseModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Hydrate selectedTemplate with full steps/metadata from live DB list once loaded
  React.useEffect(() => {
    if (!templates.length) return;
    const selectedId = formData.selectedTemplate?.id;
    if (!selectedId) return;
    const match = templates.find((t) => String(t.id) === String(selectedId));
    if (
      match &&
      (match.title !== formData.selectedTemplate?.title ||
        match.steps.length !== formData.selectedTemplate?.steps.length ||
        match.createdAt !== formData.selectedTemplate?.createdAt)
    ) {
      onChange({
        selectedTemplate: match,
        hasInstructionTemplate: true,
      });
    }
  }, [templates, formData.selectedTemplate, onChange]);

  // Auto-select template if newTemplateId is passed via router query
  React.useEffect(() => {
    const newId = router.query.newTemplateId;
    if (newId && typeof newId === "string") {
      const match = templates.find((t) => String(t.id) === newId);
      if (match) {
        onChange({
          selectedTemplate: match,
          hasInstructionTemplate: true,
        });
      }
    }
  }, [router.query.newTemplateId, templates, onChange]);

  // Directs to /admin/instructions/add preserving the current page as returnUrl or invokes callback to auto-save edits
  const handleNavigateToCreateTemplate = () => {
    if (onCreateNewTemplate) {
      onCreateNewTemplate();
      return;
    }
    const returnUrl = router.asPath;
    router.push(`/admin/instructions/add?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  // Create template form state
  const [newTitle, setNewTitle] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");

  // Filter templates based on search query
  const filteredTemplates = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => t.title.toLowerCase().includes(q));
  }, [templates, searchQuery]);

  const handleSelectTemplate = (template: InstructionTemplateItem) => {
    onChange({
      selectedTemplate: template,
      hasInstructionTemplate: true,
    });
    setIsChooseModalOpen(false);
  };

  const handleOpenCreateFromChoose = () => {
    setIsChooseModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    setIsCreateModalOpen(true);
  };

  const handleSaveNewTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const cleanTitle = newTitle.trim();
    const cleanDesc =
      newDescription.trim() ||
      "Ikuti langkah download dan login sesuai panduan resmi akun game.";

    try {
      const created = await createInstructionMutation.mutateAsync({
        title: cleanTitle,
        content: `<h3>${cleanTitle}</h3><p>${cleanDesc}</p>`,
      });

      const formatted: InstructionTemplateItem = {
        id: String(created.id),
        title: created.title,
        badge: created.badge === "Draft" ? "Draft" : "Listed",
        createdAt: created.createdAt || "Baru saja",
        lastEdit: created.lastEdit || "Baru saja",
        steps:
          created.steps.length > 0
            ? created.steps
            : [{ stepNumber: 1, title: cleanTitle, description: cleanDesc }],
      };

      onChange({
        selectedTemplate: formatted,
        hasInstructionTemplate: true,
      });
      toast.success("Template instruksi berhasil dibuat.", "Instruction Created");
      setIsCreateModalOpen(false);
    } catch {
      toast.error("Gagal membuat template instruksi baru.", "Error");
    }
  };

  const activeTemplate = formData.selectedTemplate;

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden flex flex-col shadow-sm",
        className
      )}
    >
      {/* 1. Header (Matching Image 1 & 2 Background) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 border-b border-deep-blue-700/80 bg-deep-blue-900/60 select-none">
        <div>
          <h4 className="text-base font-bold text-white tracking-tight">
            {activeTemplate ? activeTemplate.title : "Template Instruksi"}
          </h4>
          <span className="text-label-xs text-gray-400 font-normal">
            Created at : {activeTemplate?.createdAt || "22/07/2026"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {activeTemplate?.lastEdit && (
            <span className="text-label-xs text-gray-400 font-normal hidden sm:inline mr-1">
              {activeTemplate.lastEdit}
            </span>
          )}
          <Button
            type="button"
            variant="inactive"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setIsChooseModalOpen(true);
            }}
            className="cursor-pointer"
          >
            Change Template
          </Button>
          <Button
            type="button"
            variant="inactive"
            size="sm"
            onClick={handleNavigateToCreateTemplate}
            className="cursor-pointer"
          >
            Create New Template
          </Button>
        </div>
      </div>

      {/* 2. Body Area (Matching Image 5) */}
      {activeTemplate ? (
        /* Steps View with Continuous Red Left Border & Dividers (Matching Image 5) */
        <div className="p-6 sm:p-8 flex flex-col select-none">
          <div className="border-l-2 border-[#DF3848] pl-5 sm:pl-6 flex flex-col">
            <InstructionContentRenderer
              content={(activeTemplate as { content?: string }).content}
              steps={activeTemplate.steps}
            />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 sm:p-16 flex flex-col items-center justify-center text-center select-none">
          <div className="flex flex-col items-center justify-center text-center mx-auto">
            <div className="w-16 h-16 rounded-lg bg-[#161822] border border-white/5 flex items-center justify-center text-gray-300 mb-5 shadow-inner">
              <BookIcon className="w-8 h-8 text-gray-300" />
            </div>

            <h5 className="text-xl font-bold text-white mb-1.5 tracking-tight">
              Template belum terisi
            </h5>

            <p className="text-label-xs sm:text-sm text-gray-400 mb-6 font-normal">
              Anda belum mengisi template untuk instruksi.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNavigateToCreateTemplate}
              leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
            >
              <span>Create New Template</span>
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: CHOOSE A TEMPLATE (Matching Image 2 & Image 3)
         ======================================================== */}
      {isChooseModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="choose-template-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
        >
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsChooseModalOpen(false)}
          />

          <div className="relative z-10 w-[760px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 select-none animate-in zoom-in-95 duration-150 text-gray-200 flex flex-col gap-5 shadow-2xl">
            {/* Header: Title + Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-deep-blue-700/80">
              <h3
                id="choose-template-title"
                className="text-base sm:text-lg font-bold text-white tracking-tight"
              >
                Choose a Template
              </h3>
              <button
                type="button"
                onClick={() => setIsChooseModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Filter / Search Bar (Matching Image 2 & Image 3) */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-[380px]">
                {/* Search Input */}
                <div className="relative flex-1 flex items-center">
                  <SearchIcon className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari di toko"
                    className="w-full h-10 pl-9 pr-8 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 text-gray-400 hover:text-white"
                      aria-label="Hapus pencarian"
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Funnel Button */}
                <button
                  type="button"
                  className="h-10 px-3 rounded-lg bg-deep-blue-900 hover:bg-[#1E202B] border border-deep-blue-700 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Filter template"
                >
                  <FilterIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Create New Template Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNavigateToCreateTemplate}
                leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
              >
                <span>Create New Template</span>
              </Button>
            </div>

            {/* Body: List or Empty State */}
            {filteredTemplates.length > 0 ? (
              /* List of Template Cards (Matching Image 2) */
              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="w-full rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-4 flex items-center justify-between gap-4 hover:border-gray-500 transition-colors"
                  >
                    {/* Left: Red Accent Strip + Info */}
                    <div className="flex items-start gap-3.5 border-l-2 border-[#DF3848] pl-3.5 min-w-0">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate">
                            {tpl.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                            {tpl.badge}
                          </span>
                        </div>
                        <span className="text-label-xs text-gray-400">
                          Created at : {tpl.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Right: Last Edit + Choose Button */}
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-label-xs text-gray-400 hidden sm:inline">
                        {tpl.lastEdit}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => handleSelectTemplate(tpl)}
                      >
                        Choose
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State (Matching Image 3) */
              <div className="py-12 px-6 flex flex-col items-center justify-center text-center select-none">
                <div className="w-16 h-16 rounded-lg bg-[#161822] border border-white/5 flex items-center justify-center text-gray-300 mb-5 shadow-inner">
                  <BookIcon className="w-8 h-8 text-gray-300" />
                </div>
                <h4 className="text-xl font-bold text-white mb-1.5 tracking-tight">
                  Belum Ada Data Template
                </h4>
                <p className="text-label-xs sm:text-sm text-gray-400 mb-6 font-normal">
                  Tidak ditemukan template untuk kategori instruksi.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleOpenCreateFromChoose}
                  leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
                >
                  <span>Create New Template</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CREATE NEW TEMPLATE
         ======================================================== */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-template-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
        >
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div className="relative z-10 w-[540px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 shadow-2xl p-6 select-none animate-in zoom-in-95 duration-150 text-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-deep-blue-700">
              <h4
                id="create-template-title"
                className="text-base font-bold text-white tracking-tight"
              >
                Create New Template
              </h4>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewTemplate} className="py-4 space-y-4">
              <InputField
                label="NAMA TEMPLATE"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Panduan Download Steam Offline"
                className="bg-deep-blue-900 hover:border-gray-500 text-white"
              />

              <div className="flex flex-col gap-2">
                <label className="text-body-xs font-normal text-gray-400">
                  Instruksi / Langkah-Langkah
                </label>
                <textarea
                  rows={5}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="1. Login Steam menggunakan kredensial akun&#10;2. Masuk ke library dan mulai unduh game&#10;3. Aktifkan offline mode setelah selesai..."
                  className="w-full p-3 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs sm:text-body-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-deep-blue-700/80">
                <Button
                  type="button"
                  variant="inactive"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Batalkan
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Simpan Template
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
