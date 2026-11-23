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
import type {
  AdminCategoryGroup,
  CategoryScope,
  SubCategoryItem,
} from "@/features/admin/types/admin-category.types";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
  useCreateAdminSubCategory,
  useUpdateAdminSubCategory,
  useDeleteAdminSubCategory,
} from "@/hooks/use-admin-categories";
import { toast } from "@/stores/use-toast-store";

export default function AdminCategoriesPage() {
  const { data: serverResult, isLoading, isError, refetch } = useAdminCategories();
  const createCatMutation = useCreateAdminCategory();
  const updateCatMutation = useUpdateAdminCategory();
  const deleteCatMutation = useDeleteAdminCategory();
  const createSubMutation = useCreateAdminSubCategory();
  const updateSubMutation = useUpdateAdminSubCategory();
  const deleteSubMutation = useDeleteAdminSubCategory();

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

  const categories = React.useMemo(
    () => serverResult?.categories ?? [],
    [serverResult]
  );

  // Split categories by scope
  const articleCategories = React.useMemo(
    () => serverResult?.articleCategories ?? categories.filter((c) => c.scope === "article"),
    [serverResult, categories]
  );

  const productCategories = React.useMemo(
    () => serverResult?.productCategories ?? categories.filter((c) => c.scope === "product"),
    [serverResult, categories]
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
  const handleSaveDrawer = async (data: {
    title: string;
    scope: CategoryScope;
    subCategories: string[];
  }) => {
    try {
      if (drawerState.category) {
        // Update existing category
        await updateCatMutation.mutateAsync({
          scope: drawerState.category.scope,
          id: drawerState.category.id,
          data: { title: data.title },
        });

        // Add any newly typed sub-categories
        const existingNames = new Set(
          drawerState.category.subCategories.map((s) => s.name.toLowerCase())
        );
        for (const subName of data.subCategories) {
          if (subName.trim() && !existingNames.has(subName.trim().toLowerCase())) {
            await createSubMutation.mutateAsync({
              scope: drawerState.category.scope,
              categoryId: drawerState.category.id,
              name: subName.trim(),
            });
          }
        }
        toast.success("Kategori berhasil diperbarui!");
      } else {
        // Create new category
        await createCatMutation.mutateAsync({
          scope: data.scope,
          data: {
            title: data.title,
            subCategories: data.subCategories,
          },
        });
        toast.success("Kategori baru berhasil ditambahkan!");
      }
      setDrawerState({ isOpen: false, category: null, defaultScope: "article" });
    } catch {
      toast.error("Gagal menyimpan kategori ke server.");
    }
  };

  // 4. Delete whole category group
  const handlePromptDeleteCategory = (category: AdminCategoryGroup) => {
    setDeleteModalState({
      isOpen: true,
      title: `Hapus Kategori "${category.title}"?`,
      description: `Kategori ini dan seluruh (${category.subCategories.length}) sub-kategori di dalamnya akan dihapus. Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        try {
          await deleteCatMutation.mutateAsync({
            scope: category.scope,
            id: category.id,
          });
          toast.success("Kategori berhasil dihapus!");
        } catch {
          toast.error("Gagal menghapus kategori dari server.");
        } finally {
          setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        }
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
  const handleSaveSubModal = async (name: string) => {
    if (!subModalState.category) return;
    const cat = subModalState.category;

    try {
      if (subModalState.isEditing && subModalState.subCategory) {
        // Edit existing sub
        await updateSubMutation.mutateAsync({
          scope: cat.scope,
          subId: subModalState.subCategory.id,
          name: name.trim(),
        });
        toast.success("Sub-kategori berhasil diperbarui!");
      } else {
        // Add new sub
        await createSubMutation.mutateAsync({
          scope: cat.scope,
          categoryId: cat.id,
          name: name.trim(),
        });
        toast.success("Sub-kategori berhasil ditambahkan!");
      }
    } catch {
      toast.error("Gagal menyimpan sub-kategori.");
    } finally {
      setSubModalState({
        isOpen: false,
        category: null,
        subCategory: null,
        isEditing: false,
      });
    }
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
      onConfirm: async () => {
        try {
          await deleteSubMutation.mutateAsync({
            scope: category.scope,
            subId: sub.id,
          });
          toast.success("Sub-kategori berhasil dihapus!");
        } catch {
          toast.error("Gagal menghapus sub-kategori.");
        } finally {
          setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        }
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
            <Button
              variant="outline"
              size="xs"
              onClick={() => refetch()}
              title="Perbarui daftar kategori"
              className="px-3 py-2"
            >
              Refresh Data
            </Button>
          </div>
        }
        className="!p-0 !pt-0 !pb-0 !space-y-0 w-full bg-deep-blue-950"
        isError={!isLoading && isError}
        onReload={() => refetch()}
      >
        {/* Loading Banner */}
        {isLoading && (
          <div className="w-full p-4 text-center text-xs text-gray-400 bg-deep-blue-900 border-b border-white/5">
            Memuat daftar kategori dari database...
          </div>
        )}

        {/* 2-Columns Layout */}
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

        {/* Slide-over Drawer for New / Edit Category */}
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

