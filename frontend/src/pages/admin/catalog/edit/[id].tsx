import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  AdminAddProductBasicInfo,
  AdminAddProductLauncherSection,
  AdminAddProductAccountInfo,
  AdminAddProductSpecs,
  AdminAddProductInstructionTemplate,
} from "@/features/admin/components/catalog/add";
import {
  MOCK_EDIT_PRODUCT_FORM,
  type AdminAddProductFormData,
} from "@/features/admin/types/admin-add-product.types";
import { AdminCatalogDeleteModal } from "@/features/admin/components/catalog/AdminCatalogDeleteModal";

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function AdminEditProductPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<AdminAddProductFormData>(
    MOCK_EDIT_PRODUCT_FORM
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false);

  const handleFormChange = (fields: Partial<AdminAddProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSaveAndList = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/catalog");
    }, 400);
  };

  const handleCancelEdit = () => {
    router.push("/admin/catalog");
  };

  const handleConfirmArchive = () => {
    setIsArchiveModalOpen(false);
    router.push("/admin/catalog");
  };

  // Header Left Title: Breadcrumb "Katalog > Edit Product" (Matching Image 1)
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-xs">
      <Link
        href="/admin/catalog"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Katalog
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Edit Product</span>
    </div>
  );

  // Header Right Actions: Save and List, Cancel Edit, Archive Product (Matching Image 1)
  const headerRight = (
    <div className="flex items-center gap-3 select-none">
      <Button
        type="button"
        variant="primary"
        size="sm"
        disabled={isSaving}
        onClick={handleSaveAndList}
        className="cursor-pointer"
      >
        Save and List
      </Button>

      <Button
        type="button"
        variant="inactive"
        size="sm"
        disabled={isSaving}
        onClick={handleCancelEdit}
        className="cursor-pointer"
      >
        Cancel Edit
      </Button>

      <Button
        type="button"
        variant="inactive"
        size="sm"
        disabled={isSaving}
        onClick={() => setIsArchiveModalOpen(true)}
        className="cursor-pointer"
      >
        Archive Product
      </Button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Edit Product | Gamezygo Admin</title>
        <meta
          name="description"
          content="Edit detail dan konfigurasi produk katalog Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="katalog"
        headerRight={headerRight}
      >
        <div className="flex flex-col gap-8 w-full pb-8">
          {/* Section 1: Media & Basic Info (Image 2 - 2/5 and 3/5 layout) */}
          <AdminAddProductBasicInfo
            formData={formData}
            onChange={handleFormChange}
            showPreOrder={false}
          />

          {/* Section 2: Launcher & Promotion Section (Image 2 & 3) */}
          <AdminAddProductLauncherSection
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 3: Informasi Akun Game (Image 3) */}
          <AdminAddProductAccountInfo
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 4: Detail Spesifikasi (Image 4 - 4 specs in Minimum & Recommendation) */}
          <AdminAddProductSpecs
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 5: Template Instruksi (Image 5 - Panduan Download Game 4 steps) */}
          <AdminAddProductInstructionTemplate
            formData={formData}
            onChange={handleFormChange}
          />
        </div>

        {/* Archive Confirmation Modal */}
        <AdminCatalogDeleteModal
          isOpen={isArchiveModalOpen}
          onClose={() => setIsArchiveModalOpen(false)}
          onConfirm={handleConfirmArchive}
          title="Are you sure to archive this product?"
          description="Archiving will hide this product from the storefront."
        />
      </AdminLayout>
    </>
  );
}
