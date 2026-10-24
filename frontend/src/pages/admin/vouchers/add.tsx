import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminAddVoucherIdentities,
  AdminAddVoucherTargetSection,
  AdminAddVoucherRules,
  AdminAddVoucherDateRange,
} from "@/features/admin/components/vouchers";
import {
  DEFAULT_ADD_VOUCHER_FORM,
  type AdminAddVoucherFormData,
} from "@/features/admin/types/admin-voucher.types";

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

export default function AdminAddVoucherPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<AdminAddVoucherFormData>(
    DEFAULT_ADD_VOUCHER_FORM
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const handleFormChange = (fields: Partial<AdminAddVoucherFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSaveAndList = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/vouchers");
    }, 400);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/vouchers");
    }, 400);
  };

  // Header Left Breadcrumb Title: "Voucher > Add Voucher" (Matching Image 1)
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/vouchers"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Voucher
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Add Voucher</span>
    </div>
  );

  // Header Right Action Buttons: [Save and List] [Save Draft] [✕] (Matching Image 1)
  const headerRight = (
    <div className="flex items-center gap-3 select-none">
      <button
        type="button"
        disabled={isSaving}
        onClick={handleSaveAndList}
        className="px-5 py-2 rounded-lg bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-label-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm select-none"
      >
        Save and List
      </button>

      <button
        type="button"
        disabled={isSaving}
        onClick={handleSaveDraft}
        className="px-5 py-2 rounded-lg bg-[#181A22] hover:bg-[#222533] border border-white/10 text-white text-label-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none"
      >
        Save Draft
      </button>

      <Link
        href="/admin/vouchers"
        aria-label="Tutup form dan kembali ke daftar voucher"
        className="w-9 h-9 rounded-lg bg-[#181A22] hover:bg-[#222533] border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer select-none"
      >
        <CloseIcon className="w-4 h-4" />
      </Link>
    </div>
  );

  return (
    <>
      <Head>
        <title>Add Voucher | Gamezygo Admin</title>
        <meta
          name="description"
          content="Buat dan tambahkan voucher diskon baru untuk promo pelanggan Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="voucher"
        headerRight={headerRight}
      >
        <div className="flex flex-col gap-8 w-full pb-12 select-none font-sans">
          {/* Section 1: Voucher Identities (Matching Image 2) */}
          <AdminAddVoucherIdentities
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 2: TARGET GAME & USER (Matching Image 3) */}
          <AdminAddVoucherTargetSection
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 3: Voucher Rules (Matching Image 4) */}
          <AdminAddVoucherRules
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 4: Valid Date Range & Subs Switch (Matching Image 5) */}
          <AdminAddVoucherDateRange
            formData={formData}
            onChange={handleFormChange}
          />
        </div>
      </AdminLayout>
    </>
  );
}
