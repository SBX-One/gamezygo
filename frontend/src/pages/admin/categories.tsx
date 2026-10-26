import * as React from "react";
import Head from "next/head";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminCategoryColumn,
  AdminCategoryDrawer,
  AdminCategoryDeleteModal,
  AdminQuickAddSubModal,
} from "@/features/admin/components/categories";
import { MOCK_ADMIN_CATEGORIES } from "@/features/admin/data/admin-category-mock-data";
import type {
  AdminCategoryGroup,
  CategoryScope,
  SubCategoryItem,
} from "@/features/admin/types/admin-category.types";

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

export default function AdminCategoriesPage() {
  // Initialize with empty array so Empty State (Image 2) is displayed first
  const [categories, setCategories] = React.useState<AdminCategoryGroup[]>([]);

  // Drawer state for adding / editing category group
  const [drawerState, setDrawerState] = React.useState<{
    isOpen: boolean;
    category?: AdminCategoryGroup | null;
    defaultScope: CategoryScope;
  }>({
    isOpen: false,
    category: null,
    defaultScope: "article",
  });

  // Quick modal for adding or editing single sub-category
  const [subModalState, setSubModalState] = React.useState<{
    isOpen: boolean;
    category?: AdminCategoryGroup | null;
    subCategory?: SubCategoryItem | null;
    isEditing: boolean;
  }>({
    isOpen: false,
    category: null,
    subCategory: null,
    isEditing: false,
  });

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load from localStorage on mount (hydration safe)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gamezygo_admin_categories_v2");
      if (stored) {
        const parsed: AdminCategoryGroup[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCategories(parsed);
        }
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (updated: AdminCategoryGroup[]) => {
    setCategories(updated);
    try {
      localStorage.setItem("gamezygo_admin_categories_v2", JSON.stringify(updated));
    } catch {
      // LocalStorage fallback
    }
  };

  // Split categories by scope
  const articleCategories = React.useMemo(
    () => categories.filter((c) => c.scope === "article"),
    [categories]
  );

  const productCategories = React.useMemo(
    () => categories.filter((c) => c.scope === "product"),
    [categories]
  );

  // 1. Add new category button clicked on column
  const handleOpenAddNew = (scope: CategoryScope) => {
    setDrawerState({
      isOpen: true,
      category: null,
      defaultScope: scope,
    });
  };

  // 2. Edit existing category
  const handleOpenEditCategory = (category: AdminCategoryGroup) => {
    setDrawerState({
      isOpen: true,
      category,
      defaultScope: category.scope,
    });
  };

  // 3. Save category from drawer (create or update)
  const handleSaveDrawer = (data: {
    title: string;
    scope: CategoryScope;
    subCategories: string[];
  }) => {
    if (drawerState.category) {
      // Update existing
      const updated = categories.map((cat) => {
        if (cat.id !== drawerState.category?.id) return cat;
        return {
          ...cat,
          title: data.title,
          scope: data.scope,
          subCategories: data.subCategories.map((name, i) => {
            const existing = cat.subCategories[i];
            return {
              id: existing?.id || `sub-${Date.now()}-${i}`,
              name,
              orderNumber: i + 1,
            };
          }),
        };
      });
      saveToStorage(updated);
      showToast("Kategori berhasil diperbarui!");
    } else {
      // Create new
      const newGroup: AdminCategoryGroup = {
        id: `cat-${data.scope}-${Date.now()}`,
        title: data.title,
        scope: data.scope,
        orderNumber: categories.length + 1,
        subCategories: data.subCategories.map((name, i) => ({
          id: `sub-${Date.now()}-${i}`,
          name,
          orderNumber: i + 1,
        })),
        createdAt: new Date().toISOString().split("T")[0],
      };
      saveToStorage([...categories, newGroup]);
      showToast("Kategori baru berhasil ditambahkan!");
    }
    setDrawerState({ isOpen: false, category: null, defaultScope: "article" });
  };

  // 4. Delete whole category group
  const handlePromptDeleteCategory = (category: AdminCategoryGroup) => {
    setDeleteModalState({
      isOpen: true,
      title: `Hapus Kategori "${category.title}"?`,
      description: `Kategori ini dan seluruh (${category.subCategories.length}) sub-kategori di dalamnya akan dihapus. Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: () => {
        const updated = categories.filter((c) => c.id !== category.id);
        saveToStorage(updated);
        showToast("Kategori berhasil dihapus!");
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // 5. Quick Add Sub-Category to a group
  const handleOpenAddSub = (category: AdminCategoryGroup) => {
    setSubModalState({
      isOpen: true,
      category,
      subCategory: null,
      isEditing: false,
    });
  };

  // 6. Quick Edit Sub-Category
  const handleOpenEditSub = (
    category: AdminCategoryGroup,
    sub: SubCategoryItem
  ) => {
    setSubModalState({
      isOpen: true,
      category,
      subCategory: sub,
      isEditing: true,
    });
  };

  // 7. Save Sub-Category from quick modal
  const handleSaveSubModal = (name: string) => {
    if (!subModalState.category) return;
    const catId = subModalState.category.id;

    if (subModalState.isEditing && subModalState.subCategory) {
      // Edit existing sub
      const subId = subModalState.subCategory.id;
      const updated = categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          subCategories: cat.subCategories.map((s) =>
            s.id === subId ? { ...s, name } : s
          ),
        };
      });
      saveToStorage(updated);
      showToast("Sub-kategori berhasil diperbarui!");
    } else {
      // Add new sub
      const newSub: SubCategoryItem = {
        id: `sub-${Date.now()}`,
        name,
        orderNumber: subModalState.category.subCategories.length + 1,
      };
      const updated = categories.map((cat) => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          subCategories: [...cat.subCategories, newSub],
        };
      });
      saveToStorage(updated);
      showToast("Sub-kategori berhasil ditambahkan!");
    }

    setSubModalState({
      isOpen: false,
      category: null,
      subCategory: null,
      isEditing: false,
    });
  };

  // 8. Delete Sub-Category
  const handlePromptDeleteSub = (
    category: AdminCategoryGroup,
    sub: SubCategoryItem
  ) => {
    setDeleteModalState({
      isOpen: true,
      title: `Hapus Sub-Kategori "${sub.name}"?`,
      description: `Sub-kategori ini akan dihapus dari kategori "${category.title}".`,
      onConfirm: () => {
        const updated = categories.map((cat) => {
          if (cat.id !== category.id) return cat;
          return {
            ...cat,
            subCategories: cat.subCategories.filter((s) => s.id !== sub.id),
          };
        });
        saveToStorage(updated);
        showToast("Sub-kategori berhasil dihapus!");
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <>
      <Head>
        <title>Kategori | Gamezygo Admin</title>
        <meta
          name="description"
          content="Kelola kategori artikel dan produk di Gamezygo"
        />
      </Head>

      <AdminLayout
        title="Kategori"
        activeNavId="kategori"
        headerClassName="bg-deep-blue-950 border-b border-deep-blue-700"
        headerRight={
          <div className="flex items-center gap-2">
            {categories.length > 0 ? (
              <Button
                variant="outline"
                size="xs"
                onClick={() => saveToStorage([])}
                title="Kosongkan data untuk melihat Empty State"
                className="px-3 py-2"
              >
                Reset Kosong
              </Button>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onClick={() => saveToStorage(MOCK_ADMIN_CATEGORIES)}
                title="Muat data contoh"
                className="px-3 py-2"
              >
                Muat Contoh
              </Button>
            )}
          </div>
        }
        className="!p-0 !pt-0 !pb-0 !space-y-0 w-full bg-deep-blue-950"
      >
        {/* Floating Toast Feedback */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-emerald-500/40 text-emerald-300 text-label-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-150 shadow-xl">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 2-Columns Layout: Header row is bg-deep-blue-900, sisanya is bg-deep-blue-950 */}
        <div className="w-full flex flex-col lg:flex-row min-h-[600px] select-none font-sans bg-deep-blue-950">
          {/* Left Column: Artikel */}
          <AdminCategoryColumn
            title="Artikel"
            scope="article"
            categories={articleCategories}
            showRightBorder={true}
            onAddNewCategory={handleOpenAddNew}
            onEditCategory={handleOpenEditCategory}
            onDeleteCategory={handlePromptDeleteCategory}
            onAddSubCategory={handleOpenAddSub}
            onEditSubCategory={handleOpenEditSub}
            onDeleteSubCategory={handlePromptDeleteSub}
          />

          {/* Right Column: Product */}
          <AdminCategoryColumn
            title="Product"
            scope="product"
            categories={productCategories}
            showRightBorder={false}
            onAddNewCategory={handleOpenAddNew}
            onEditCategory={handleOpenEditCategory}
            onDeleteCategory={handlePromptDeleteCategory}
            onAddSubCategory={handleOpenAddSub}
            onEditSubCategory={handleOpenEditSub}
            onDeleteSubCategory={handlePromptDeleteSub}
          />
        </div>

        {/* Slide-over Drawer for New / Edit Category matching Image 5 */}
        <AdminCategoryDrawer
          isOpen={drawerState.isOpen}
          category={drawerState.category}
          defaultScope={drawerState.defaultScope}
          onClose={() =>
            setDrawerState({
              isOpen: false,
              category: null,
              defaultScope: "article",
            })
          }
          onSave={handleSaveDrawer}
        />

        {/* Quick Add / Edit Sub-Category Modal */}
        <AdminQuickAddSubModal
          isOpen={subModalState.isOpen}
          categoryTitle={subModalState.category?.title || ""}
          initialValue={subModalState.subCategory?.name || ""}
          isEditing={subModalState.isEditing}
          onClose={() =>
            setSubModalState({
              isOpen: false,
              category: null,
              subCategory: null,
              isEditing: false,
            })
          }
          onSave={handleSaveSubModal}
        />

        {/* Delete Confirmation Modal */}
        <AdminCategoryDeleteModal
          isOpen={deleteModalState.isOpen}
          title={deleteModalState.title}
          description={deleteModalState.description}
          onClose={() =>
            setDeleteModalState((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={deleteModalState.onConfirm}
        />
      </AdminLayout>
    </>
  );
}
