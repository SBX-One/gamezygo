import * as React from "react";
import Head from "next/head";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminFaqHeader,
  AdminFaqCard,
  AdminFaqAddButton,
  AdminFaqModal,
  AdminFaqDeleteModal,
} from "@/features/admin/components/faq";
import {
  FAQ_CATEGORIES,
} from "@/features/admin/data/admin-faq-mock-data";
import type { AdminFaqItem } from "@/features/admin/types/admin-faq.types";
import {
  useAdminFaqs,
  useAdminFaqPages,
  useCreateAdminFaq,
  useUpdateAdminFaq,
  useDeleteAdminFaq,
} from "@/hooks/use-admin-faqs";
import { toast } from "@/stores/use-toast-store";

export default function AdminFaqPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("Landing Page");
  const [collapsedIds, setCollapsedIds] = React.useState<Record<string, boolean>>({});

  // Modal states
  const [editModalState, setEditModalState] = React.useState<{
    isOpen: boolean;
    item?: AdminFaqItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    item?: AdminFaqItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const { data: faqData, isLoading, isError, refetch } = useAdminFaqs({ per_page: 100 });
  const { data: serverCategories } = useAdminFaqPages();
  const createMutation = useCreateAdminFaq();
  const updateMutation = useUpdateAdminFaq();
  const deleteMutation = useDeleteAdminFaq();

  const categories = React.useMemo(() => {
    if (serverCategories && serverCategories.length > 0) return serverCategories;
    return ["Landing Page", "Bundle"];
  }, [serverCategories]);

  const faqs: AdminFaqItem[] = React.useMemo(() => {
    const list = faqData?.faqs ?? [];
    return list.map((item) => ({
      ...item,
      isExpanded: !collapsedIds[item.id],
    }));
  }, [faqData, collapsedIds]);

  // Filter items by category
  const filteredFaqs = React.useMemo(() => {
    return faqs.filter((item) => item.category === activeCategory);
  }, [faqs, activeCategory]);

  // Toggle card expand/collapse
  const handleToggleExpand = (id: string) => {
    setCollapsedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Save new or edited FAQ
  const handleSaveModal = async (data: { question: string; answer: string; category: string }) => {
    try {
      if (editModalState.item) {
        await updateMutation.mutateAsync({
          id: editModalState.item.id,
          data: {
            question: data.question,
            answer: data.answer,
            category: data.category,
          },
        });
        toast.success("Pertanyaan FAQ berhasil diperbarui!", "FAQ Updated");
      } else {
        await createMutation.mutateAsync({
          question: data.question,
          answer: data.answer,
          category: data.category,
        });
        toast.success("Pertanyaan baru berhasil ditambahkan!", "FAQ Created");
      }
      setEditModalState({ isOpen: false, item: null });
    } catch {
      toast.error("Gagal menyimpan pertanyaan FAQ ke server.", "Error");
    }
  };

  // Remove FAQ
  const handleConfirmDelete = async () => {
    if (!deleteModalState.item) return;
    try {
      await deleteMutation.mutateAsync(deleteModalState.item.id);
      toast.success("Pertanyaan FAQ berhasil dihapus dari list!", "FAQ Deleted");
      setDeleteModalState({ isOpen: false, item: null });
    } catch {
      toast.error("Gagal menghapus pertanyaan FAQ.", "Error");
    }
  };

  const latestLastEdit = filteredFaqs[0]?.lastEdit ?? faqs[0]?.lastEdit ?? "-";

  return (
    <>
      <Head>
        <title>FAQ Management | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola Frequently Asked Questions (FAQ) dan pertanyaan umum di Gamezygo"
        />
      </Head>

      <AdminLayout
        title="FAQ"
        activeNavId="faq"
        isError={!isLoading && isError}
        onReload={() => refetch()}
      >
        <div className="w-full pb-16 select-none font-sans">
          {/* Main Card Container (Matching Gambar 2, 3, 4) */}
          <div className="w-full rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 p-6 sm:p-8 flex flex-col gap-6 shadow-none">
            {/* 1. Header with title, last edit subtext, and category dropdown (Landing Page ▾) */}
            <AdminFaqHeader
              title="Frequently Asked Questions"
              lastEdit={`Last edit ${latestLastEdit}`}
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* 2. List of FAQ Cards (Matching Gambar 2 & 3) */}
            <div className="flex flex-col gap-4 w-full">
              {isLoading && (
                <div className="rounded-lg bg-deep-blue-900/40 border border-deep-blue-700/60 p-8 text-center text-gray-400 text-label-xs sm:text-sm">
                  Memuat daftar FAQ...
                </div>
              )}

              {!isLoading &&
                filteredFaqs.map((faq) => (
                  <AdminFaqCard
                    key={faq.id}
                    item={faq}
                    onEdit={(item) => setEditModalState({ isOpen: true, item })}
                    onRemove={(item) => setDeleteModalState({ isOpen: true, item })}
                    onToggleExpand={handleToggleExpand}
                  />
                ))}

              {!isLoading && !isError && filteredFaqs.length === 0 && (
                <div className="rounded-lg bg-deep-blue-900/40 border border-deep-blue-700/60 p-8 text-center text-gray-400 text-label-xs sm:text-sm">
                  Belum ada pertanyaan FAQ untuk kategori &quot;{activeCategory}&quot;. Klik tombol di bawah untuk menambahkan.
                </div>
              )}
            </div>

            {/* 3. Add Question Dashed Card (Matching Gambar 3) */}
            <AdminFaqAddButton
              onClick={() => setEditModalState({ isOpen: true, item: null })}
            />
          </div>
        </div>

        {/* Modal: Add / Edit FAQ */}
        <AdminFaqModal
          isOpen={editModalState.isOpen}
          item={editModalState.item}
          activeCategory={activeCategory}
          categories={categories}
          onClose={() => setEditModalState({ isOpen: false, item: null })}
          onSave={handleSaveModal}
        />

        {/* Modal: Confirm Delete */}
        <AdminFaqDeleteModal
          isOpen={deleteModalState.isOpen}
          questionTitle={deleteModalState.item?.question}
          onClose={() => setDeleteModalState({ isOpen: false, item: null })}
          onConfirm={handleConfirmDelete}
        />
      </AdminLayout>
    </>
  );
}
