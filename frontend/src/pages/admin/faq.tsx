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
  MOCK_ADMIN_FAQS,
  FAQ_CATEGORIES,
} from "@/features/admin/data/admin-faq-mock-data";
import type { AdminFaqItem } from "@/features/admin/types/admin-faq.types";

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function AdminFaqPage() {
  const [faqs, setFaqs] = React.useState<AdminFaqItem[]>(MOCK_ADMIN_FAQS);
  const [activeCategory, setActiveCategory] = React.useState<string>("Landing Page");

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

  // Toast notification state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gamezygo_admin_faqs");
      if (stored) {
        const parsed: AdminFaqItem[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setFaqs(parsed);
        }
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Save to localStorage helper
  const saveFaqsToStorage = (updatedFaqs: AdminFaqItem[]) => {
    setFaqs(updatedFaqs);
    try {
      localStorage.setItem("gamezygo_admin_faqs", JSON.stringify(updatedFaqs));
    } catch {
      // LocalStorage fallback
    }
  };

  // Filter items by category
  const filteredFaqs = React.useMemo(() => {
    return faqs.filter((item) => item.category === activeCategory);
  }, [faqs, activeCategory]);

  // Toggle card expand/collapse
  const handleToggleExpand = (id: string) => {
    setFaqs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  // Save new or edited FAQ
  const handleSaveModal = (data: { question: string; answer: string; category: string }) => {
    if (editModalState.item) {
      // Edit existing
      const updated = faqs.map((f) =>
        f.id === editModalState.item?.id
          ? {
              ...f,
              question: data.question,
              answer: data.answer,
              category: data.category,
              lastEdit: "Just now",
            }
          : f
      );
      saveFaqsToStorage(updated);
      showToast("Pertanyaan FAQ berhasil diperbarui!");
    } else {
      // Create new
      const newItem: AdminFaqItem = {
        id: `faq-${Date.now()}`,
        question: data.question,
        answer: data.answer,
        category: data.category,
        isExpanded: true,
        lastEdit: "Just now",
      };
      saveFaqsToStorage([...faqs, newItem]);
      showToast("Pertanyaan baru berhasil ditambahkan!");
    }
    setEditModalState({ isOpen: false, item: null });
  };

  // Remove FAQ
  const handleConfirmDelete = () => {
    if (deleteModalState.item) {
      const updated = faqs.filter((f) => f.id !== deleteModalState.item?.id);
      saveFaqsToStorage(updated);
      showToast("Pertanyaan FAQ berhasil dihapus dari list!");
    }
    setDeleteModalState({ isOpen: false, item: null });
  };

  return (
    <>
      <Head>
        <title>FAQ Management | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola Frequently Asked Questions (FAQ) dan pertanyaan umum di Gamezygo"
        />
      </Head>

      <AdminLayout title="FAQ" activeNavId="faq">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-emerald-500/40 text-emerald-300 text-label-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-150 shadow-xl">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="w-full pb-16 select-none font-sans">
          {/* Main Card Container (Matching Gambar 2, 3, 4) */}
          <div className="w-full rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 p-6 sm:p-8 flex flex-col gap-6 shadow-none">
            {/* 1. Header with title, last edit subtext, and category dropdown (Landing Page ▾) */}
            <AdminFaqHeader
              title="Frequently Asked Questions"
              lastEdit="Last edit 7 days ago"
              categories={FAQ_CATEGORIES}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            {/* 2. List of FAQ Cards (Matching Gambar 2 & 3) */}
            <div className="flex flex-col gap-4 w-full">
              {filteredFaqs.map((faq) => (
                <AdminFaqCard
                  key={faq.id}
                  item={faq}
                  onEdit={(item) => setEditModalState({ isOpen: true, item })}
                  onRemove={(item) => setDeleteModalState({ isOpen: true, item })}
                  onToggleExpand={handleToggleExpand}
                />
              ))}

              {filteredFaqs.length === 0 && (
                <div className="rounded-lg bg-deep-blue-900/40 border border-deep-blue-700/60 p-8 text-center text-gray-400 text-label-xs sm:text-sm">
                  Belum ada pertanyaan FAQ untuk kategori "{activeCategory}". Klik tombol di bawah untuk menambahkan.
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
          categories={FAQ_CATEGORIES}
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
