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
  DEFAULT_ADD_PRODUCT_FORM,
  type AdminAddProductFormData,
} from "@/features/admin/types/admin-add-product.types";

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

export default function AdminAddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<AdminAddProductFormData>(
    DEFAULT_ADD_PRODUCT_FORM
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const handleFormChange = (fields: Partial<AdminAddProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSaveAndList = () => {
    setIsSaving(true);
    // Simulate save and redirect back to catalog
    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/catalog");
    }, 400);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/catalog");
    }, 400);
  };

  // Header Left Title: Breadcrumb "Katalog > Add Product" (Matching Image 1)
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-xs">
      <Link
        href="/admin/catalog"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Katalog
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Add Product</span>
    </div>
  );

  // Header Right Actions: Save and List, Save Draft, Close Button (Matching Image 1)
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
        onClick={handleSaveDraft}
        className="cursor-pointer"
      >
        Save Draft
      </Button>

      <Link
        href="/admin/catalog"
        aria-label="Tutup form dan kembali ke katalog"
        className="h-9 w-9 rounded-lg border border-deep-blue-700 bg-[#15161D] hover:bg-[#1E202B] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <CloseIcon className="w-4 h-4" />
      </Link>
    </div>
  );

  return (
    <>
      <Head>
        <title>Add Product | Gamezygo Admin</title>
        <meta
          name="description"
          content="Tambah produk baru ke katalog game Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="katalog"
        headerRight={headerRight}
      >
        <div className="flex flex-col gap-8 w-full  pb-8">
          {/* Section 1: Media Upload & Basic Details (Image 2) */}
          <AdminAddProductBasicInfo
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 2: Launcher, Promotion & Store URL (Image 3) */}
          <AdminAddProductLauncherSection
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 3: Informasi Akun Game (Image 4) */}
          <AdminAddProductAccountInfo
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 4: Detail Spesifikasi (Image 5) */}
          <AdminAddProductSpecs
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 5: Template Instruksi (Image 6) */}
          <AdminAddProductInstructionTemplate
            formData={formData}
            onChange={handleFormChange}
          />
        </div>
      </AdminLayout>
    </>
  );
}
