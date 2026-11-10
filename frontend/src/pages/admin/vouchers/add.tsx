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
import { Button } from "@/components/ui/Button";
import {
  DEFAULT_ADD_VOUCHER_FORM,
  type AdminAddVoucherFormData,
} from "@/features/admin/types/admin-voucher.types";
import { useCreateVoucher } from "@/hooks/use-admin-vouchers";
import { toast } from "@/stores/use-toast-store";

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
  const createMutation = useCreateVoucher();

  const handleFormChange = (fields: Partial<AdminAddVoucherFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const parseAmount = (val: string): number => {
    const cleaned = (val || "").replace(/[^\d]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  const parseNumberOrZero = (val: string): number => {
    if (!val || val.toLowerCase().includes("unlimited")) return 0;
    const cleaned = val.replace(/[^\d]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  const parseDateStr = (dateStr: string): string | null => {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T00:00:00Z`;
    }
    return dateStr;
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!formData.name.trim()) {
      toast.warning("Nama voucher wajib diisi.", "Validasi");
      return;
    }
    if (!formData.code.trim()) {
      toast.warning("Kode voucher wajib diisi.", "Validasi");
      return;
    }

    setIsSaving(true);
    try {
      const discountAmount = parseAmount(formData.discountValue);
      const minPurchase = parseAmount(formData.minPurchaseAmount);
      const slot = parseNumberOrZero(formData.maxUsage);
      const usageLimitPerUser = parseNumberOrZero(formData.limitPerUser);

      await createMutation.mutateAsync({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        discount_type: formData.discountType,
        discount_amount: discountAmount,
        min_purchase: minPurchase,
        slot: slot,
        usage_limit_per_user: usageLimitPerUser,
        started_at: parseDateStr(formData.startDate),
        expired_at: parseDateStr(formData.endDate),
        is_active: !isDraft,
        status: isDraft ? "draft" : "active",
        applies_to: formData.applicableToSubs ? "all" : "one_time",
        target_games: formData.targetGames,
        target_users: formData.targetUsers,
        product_ids: formData.targetGames.map((g) => g.id),
        user_ids: formData.targetUsers.map((u) => u.id),
      });

      toast.success(
        isDraft
          ? "Voucher berhasil disimpan sebagai draft."
          : "Voucher berhasil dipublikasikan.",
        isDraft ? "Draft Tersimpan" : "Voucher Aktif"
      );
      router.push("/admin/vouchers");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal membuat voucher.";
      toast.error(msg, "Gagal");
      setIsSaving(false);
    }
  };

  // Header Left Breadcrumb Title: "Voucher > Add Voucher"
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

  // Header Right Action Buttons: [Save and List] [Save Draft] [✕]
  const headerRight = (
    <div className="flex items-center gap-3 select-none">
      <Button
        variant="primary"
        size="sm"
        disabled={isSaving}
        onClick={() => handleSubmit(false)}
      >
        {isSaving ? "Menyimpan..." : "Save and List"}
      </Button>

      <Button
        variant="inactive"
        size="sm"
        disabled={isSaving}
        onClick={() => handleSubmit(true)}
      >
        {isSaving ? "Menyimpan..." : "Save Draft"}
      </Button>

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
          {/* Section 1: Voucher Identities */}
          <AdminAddVoucherIdentities
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 2: TARGET GAME & USER */}
          <AdminAddVoucherTargetSection
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 3: Voucher Rules */}
          <AdminAddVoucherRules
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 4: Valid Date Range & Subs Switch */}
          <AdminAddVoucherDateRange
            formData={formData}
            onChange={handleFormChange}
          />
        </div>
      </AdminLayout>
    </>
  );
}
