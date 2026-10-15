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
import { MOCK_ADMIN_INSTRUCTION_TEMPLATES } from "@/features/admin/data/admin-instruction-mock-data";
import type { InstructionTemplate } from "@/features/admin/types/admin-instruction.types";

export default function AdminInstructionsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [templates, setTemplates] = React.useState<InstructionTemplate[]>(
    MOCK_ADMIN_INSTRUCTION_TEMPLATES
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Load custom templates from localStorage on client mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gamezygo_admin_instruction_templates");
      if (stored) {
        const parsed: InstructionTemplate[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setTemplates([...parsed, ...MOCK_ADMIN_INSTRUCTION_TEMPLATES]);
        }
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Default active template is the first template so detail view is visible matching Gambar 3
  const [activeTemplate, setActiveTemplate] =
    React.useState<InstructionTemplate | null>(() => MOCK_ADMIN_INSTRUCTION_TEMPLATES[0] || null);

  // Sync template from URL query id if provided
  React.useEffect(() => {
    if (typeof id === "string" && id.trim()) {
      const found = templates.find((t) => t.id === id);
      if (found) {
        setActiveTemplate(found);
      }
    }
  }, [id, templates]);

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
    setActiveTemplate(template);
  };

  const handleDeleteClick = (template: InstructionTemplate) => {
    setDeleteModalState({
      isOpen: true,
      template,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.template) {
      const deletedId = deleteModalState.template.id;
      const updated = templates.filter((t) => t.id !== deletedId);
      setTemplates(updated);
      if (activeTemplate?.id === deletedId) {
        setActiveTemplate(updated[0] || null);
      }
    }
    setDeleteModalState({ isOpen: false });
  };

  const handleConfirmClear = () => {
    if (activeTemplate) {
      const updatedTemplate: InstructionTemplate = {
        ...activeTemplate,
        steps: [],
      };
      setActiveTemplate(updatedTemplate);
      setTemplates((prev) =>
        prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
      );
    }
    setIsClearModalOpen(false);
  };

  const handleSaveNewTemplate = (newTemplate: InstructionTemplate) => {
    setTemplates((prev) => [newTemplate, ...prev]);
    setActiveTemplate(newTemplate);
  };

  const handleSelectChangedTemplate = (template: InstructionTemplate) => {
    setActiveTemplate(template);
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
            {filteredTemplates.map((template) => (
              <AdminInstructionCard
                key={template.id}
                template={template}
                isSelected={activeTemplate?.id === template.id}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}

            {filteredTemplates.length === 0 && (
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
