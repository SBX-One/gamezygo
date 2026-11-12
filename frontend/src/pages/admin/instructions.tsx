import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminInstructionTopBar,
  AdminInstructionCard,
  AdminInstructionDetailView,
  AdminInstructionDeleteModal,
  AdminInstructionClearModal,
  AdminInstructionCreateModal,
  AdminInstructionChangeModal,
} from "@/features/admin/components/instructions";
import type { InstructionTemplate } from "@/features/admin/types/admin-instruction.types";
import {
  useAdminInstructions,
  useAdminInstructionDetail,
  useCreateAdminInstruction,
  useUpdateAdminInstruction,
  useDeleteAdminInstruction,
} from "@/hooks/use-admin-instructions";
import { toast } from "@/stores/use-toast-store";

export default function AdminInstructionsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const {
    data: instructionsResult,
    isLoading,
    isError,
    refetch,
  } = useAdminInstructions({ per_page: 100 });

  const templates: InstructionTemplate[] = React.useMemo(
    () => instructionsResult?.instructions ?? [],
    [instructionsResult]
  );

  const effectiveSelectedId = React.useMemo(() => {
    if (selectedId && templates.some((t) => t.id === selectedId)) return selectedId;
    if (typeof id === "string" && id.trim() && templates.some((t) => t.id === id)) {
      return id;
    }
    return templates[0]?.id ?? null;
  }, [selectedId, id, templates]);

  const { data: activeTemplateDetail } = useAdminInstructionDetail(effectiveSelectedId);
  const createMutation = useCreateAdminInstruction();
  const updateMutation = useUpdateAdminInstruction();
  const deleteMutation = useDeleteAdminInstruction();

  const activeTemplate: InstructionTemplate | null = React.useMemo(() => {
    if (activeTemplateDetail && activeTemplateDetail.id === effectiveSelectedId) {
      return activeTemplateDetail;
    }
    return templates.find((t) => t.id === effectiveSelectedId) ?? null;
  }, [activeTemplateDetail, effectiveSelectedId, templates]);

  // Modal States
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    template?: InstructionTemplate;
  }>({
    isOpen: false,
  });

  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = React.useState(false);

  // Filter templates based on search query
  const filteredTemplates = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => t.title.toLowerCase().includes(q));
  }, [templates, searchQuery]);

  // Handlers
  const handleEdit = (template: InstructionTemplate) => {
    setSelectedId(template.id);
  };

  const handleDeleteClick = (template: InstructionTemplate) => {
    setDeleteModalState({
      isOpen: true,
      template,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.template) return;
    const deletedId = deleteModalState.template.id;
    try {
      await deleteMutation.mutateAsync(deletedId);
      if (effectiveSelectedId === deletedId) {
        setSelectedId(null);
      }
      toast.success("Template instruksi berhasil dihapus.", "Instruction Deleted");
      setDeleteModalState({ isOpen: false });
    } catch {
      toast.error("Gagal menghapus template instruksi.", "Error");
    }
  };

  const handleConfirmClear = async () => {
    if (!activeTemplate) return;
    try {
      await updateMutation.mutateAsync({
        id: activeTemplate.id,
        data: { content: "<p>-</p>" },
      });
      toast.success("Konten instruksi berhasil dikosongkan.", "Instruction Cleared");
      setIsClearModalOpen(false);
    } catch {
      toast.error("Gagal mengosongkan konten instruksi.", "Error");
    }
  };

  const handleSaveNewTemplate = async (newTemplate: InstructionTemplate) => {
    const htmlContent =
      newTemplate.steps.length > 0
        ? newTemplate.steps
            .map((s) => `<h3>${s.title}</h3><p>${s.description}</p>`)
            .join("")
        : `<p>${newTemplate.title}</p>`;

    try {
      const created = await createMutation.mutateAsync({
        title: newTemplate.title,
        content: htmlContent,
      });
      setSelectedId(created.id);
      toast.success("Template instruksi berhasil dibuat.", "Instruction Created");
    } catch {
      toast.error("Gagal menyimpan template instruksi baru.", "Error");
    }
  };

  const handleSelectChangedTemplate = (template: InstructionTemplate) => {
    setSelectedId(template.id);
  };

  return (
    <>
      <Head>
        <title>Instruksi Management | Gamezygo Admin</title>
        <meta
          name="description"
          content="Admin instruction templates management, download guides, and account credential steps."
        />
      </Head>

      <AdminLayout
        title="Instruksi"
        activeNavId="instruksi"
      >
        <div className="flex flex-col gap-6 w-full pb-12 select-none font-sans">
          {/* Top Controls Bar: Search, Filter, + Add New (Matching Gambar 3) */}
          <AdminInstructionTopBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddNew={() => router.push("/admin/instructions/add")}
          />

          {/* Instructions Cards List (Matching Gambar 2 & Gambar 3) */}
          <div className="flex flex-col gap-3.5 w-full">
            {isLoading && (
              <div className="rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-8 text-center text-gray-400 text-sm">
                Memuat template instruksi...
              </div>
            )}

            {!isLoading && isError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-6 text-center text-red-300 text-sm space-y-3">
                <p>Gagal memuat template instruksi dari database.</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-4 py-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-white text-xs font-medium cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {!isLoading &&
              !isError &&
              filteredTemplates.map((template) => (
                <AdminInstructionCard
                  key={template.id}
                  template={template}
                  isSelected={activeTemplate?.id === template.id}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}

            {!isLoading && !isError && filteredTemplates.length === 0 && (
              <div className="rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-8 text-center text-gray-400 text-sm">
                Tidak ditemukan template instruksi yang cocok dengan pencarian Anda.
              </div>
            )}
          </div>

          {/* Instruction Detail View (Matching Gambar 3) */}
          {activeTemplate && (
            <AdminInstructionDetailView
              template={activeTemplate}
              onChangeTemplate={() => setIsChangeModalOpen(true)}
              onCreateNewTemplate={() => setIsCreateModalOpen(true)}
            />
          )}
        </div>

        {/* Modal 1: Delete Template Modal (Matching Image 4) */}
        <AdminInstructionDeleteModal
          isOpen={deleteModalState.isOpen}
          templateTitle={deleteModalState.template?.title}
          onClose={() => setDeleteModalState({ isOpen: false })}
          onConfirm={handleConfirmDelete}
        />

        {/* Modal 2: Clear Instruction Modal (Matching Image 5) */}
        <AdminInstructionClearModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleConfirmClear}
        />

        {/* Modal 3: Create New Template Modal */}
        <AdminInstructionCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveNewTemplate}
        />

        {/* Modal 4: Change Template Modal */}
        {activeTemplate && (
          <AdminInstructionChangeModal
            isOpen={isChangeModalOpen}
            templates={templates}
            activeTemplateId={activeTemplate.id}
            onClose={() => setIsChangeModalOpen(false)}
            onSelect={handleSelectChangedTemplate}
          />
        )}
      </AdminLayout>
    </>
  );
}
