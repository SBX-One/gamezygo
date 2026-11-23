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
  AdminAddVoucherSkeleton,
} from "@/features/admin/components/vouchers";
import { calculateDiscountedGamePrice } from "@/features/admin/utils/voucher-price-calculator";
import { Button } from "@/components/ui/Button";
import {
  DEFAULT_ADD_VOUCHER_FORM,
  getInitialVoucherDates,
  type AdminAddVoucherFormData,
  type VoucherTargetGame,
  type VoucherTargetUser,
} from "@/features/admin/types/admin-voucher.types";
import {
  useCreateVoucher,
  useUpdateVoucher,
  useAdminVoucherDetail,
} from "@/hooks/use-admin-vouchers";
import { adminVoucherService } from "@/services/admin-voucher.service";
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
  const { id } = router.query;
  const voucherId = typeof id === "string" ? id : undefined;
  const isEditMode = Boolean(voucherId);

  const [formData, setFormData] = React.useState<AdminAddVoucherFormData>(() => {
    const dates = getInitialVoucherDates();
    return {
      ...DEFAULT_ADD_VOUCHER_FORM,
      startDate: dates.startDate,
      endDate: dates.endDate,
    };
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const createMutation = useCreateVoucher();
  const updateMutation = useUpdateVoucher();
  const { data: voucherDetail, isLoading: isLoadingDetail } = useAdminVoucherDetail(voucherId);
  const isPageLoading = isEditMode && (isLoadingDetail || !router.isReady);

  // Populate existing voucher fields when editing
  React.useEffect(() => {
    if (voucherDetail?.data) {
      const timer = setTimeout(() => {
        const v = voucherDetail.data as unknown as Record<string, unknown>;

        const formatCurrencyVal = (num?: number): string =>
          `IDR ${Number(num || 0).toLocaleString("id-ID")}`;

        const formatIsoToDdMmYyyy = (iso?: unknown): string => {
          if (!iso || typeof iso !== "string") return "";
          const d = new Date(iso);
          if (Number.isNaN(d.getTime())) return "";
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yyyy = d.getFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };

        const rawDiscountType =
          v.discount_type === "percent" || v.discount_type === "percentage"
            ? "percentage"
            : "fixed";

        const discountNum = Number(v.discount_value ?? v.discount_amount ?? v.discountAmount ?? 0);
        const rawDiscountVal =
          rawDiscountType === "percentage"
            ? `${discountNum}%`
            : formatCurrencyVal(discountNum);

        const rawProducts = (
          Array.isArray(v.products)
            ? v.products
            : Array.isArray(v.target_games)
            ? v.target_games
            : Array.isArray(v.targetGames)
            ? v.targetGames
            : []
        ) as Record<string, unknown>[];

        const mappedGames: VoucherTargetGame[] = rawProducts.map((p) => {
          const originalPrice = Number(p.original_price ?? p.price ?? p.originalPrice ?? 0);
          const hasExistingDiscount =
            Number(p.discount_percentage ?? p.discountPercentage ?? 0) > 0 &&
            Number(p.discounted_price ?? p.discountedPrice ?? 0) > 0;

          const calculated = hasExistingDiscount
            ? {
                discountPercentage: Number(p.discount_percentage ?? p.discountPercentage),
                discountedPrice: Number(p.discounted_price ?? p.discountedPrice),
              }
            : calculateDiscountedGamePrice(originalPrice, rawDiscountType, discountNum);

          return {
            id: String(p.id ?? ""),
            title: String(p.name ?? p.title ?? "Game"),
            imageSrc: String(p.image_url ?? p.thumbnail ?? p.cover_image ?? p.imageSrc ?? ""),
            originalPrice,
            discountPercentage: calculated.discountPercentage,
            discountedPrice: calculated.discountedPrice,
            categories: Array.isArray(p.categories) ? (p.categories as string[]) : [],
          };
        });

        const rawUsers = (
          Array.isArray(v.users)
            ? v.users
            : Array.isArray(v.target_users)
            ? v.target_users
            : Array.isArray(v.targetUsers)
            ? v.targetUsers
            : []
        ) as Record<string, unknown>[];

        const mappedUsers: VoucherTargetUser[] = rawUsers.map((u) => ({
          id: String(u.id ?? ""),
          email: String(u.email ?? "-"),
          points: u.total_points ? `${u.total_points} Pts` : undefined,
        }));

        const slot = Number(v.slot ?? v.usageLimit ?? 0);
        const usageLimitUser = Number(v.usage_limit_per_user ?? 0);
        const minPurchase = Number(v.min_purchase ?? 0);

        setFormData((prev) => ({
          ...prev,
          name: String(v.name ?? v.code ?? ""),
          code: String(v.code ?? ""),
          discountType: rawDiscountType,
          discountValue: rawDiscountVal,
          minPurchaseAmount: minPurchase > 0 ? formatCurrencyVal(minPurchase) : "IDR 0",
          maxUsage: slot > 0 ? String(slot) : "Unlimited",
          limitPerUser: usageLimitUser > 0 ? String(usageLimitUser) : "Unlimited",
          applicableToSubs: v.applies_to === "all",
          startDate: formatIsoToDdMmYyyy(v.started_at) || prev.startDate,
          endDate: formatIsoToDdMmYyyy(v.expired_at) || prev.endDate,
          targetGames: mappedGames,
          targetUsers: mappedUsers,
        }));
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [voucherDetail]);

  const handleFormChange = (fields: Partial<AdminAddVoucherFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...fields };
      // If discountType or discountValue changed, recalculate prices for all targetGames
      if (
        (fields.discountType !== undefined || fields.discountValue !== undefined) &&
        next.targetGames.length > 0
      ) {
        next.targetGames = next.targetGames.map((g) => {
          const calc = calculateDiscountedGamePrice(
            g.originalPrice,
            next.discountType,
            next.discountValue
          );
          return {
            ...g,
            discountPercentage: calc.discountPercentage,
            discountedPrice: calc.discountedPrice,
          };
        });
      }
      return next;
    });
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

    const discountAmount = parseAmount(formData.discountValue);
    if (discountAmount <= 0) {
      toast.warning("Nilai diskon harus lebih besar dari 0.", "Validasi");
      return;
    }

    if (formData.discountType === "percentage" && discountAmount > 100) {
      toast.warning("Diskon persentase tidak boleh lebih dari 100%.", "Validasi");
      return;
    }

    const startIso = parseDateStr(formData.startDate);
    const endIso = parseDateStr(formData.endDate);
    if (startIso && endIso && new Date(endIso) < new Date(startIso)) {
      toast.warning(
        "Tanggal berakhir tidak boleh lebih awal dari tanggal mulai voucher.",
        "Validasi"
      );
      return;
    }

    setIsSaving(true);
    try {
      const minPurchase = parseAmount(formData.minPurchaseAmount);
      const slot = parseNumberOrZero(formData.maxUsage);
      const usageLimitPerUser = parseNumberOrZero(formData.limitPerUser);

      const hasTargetGames = formData.targetGames.length > 0;
      const hasTargetUsers = formData.targetUsers.length > 0;
      const productScope = hasTargetGames ? "specific_products" : "all_products";
      const targetType = hasTargetUsers ? "specific_users" : "all_users";

      const productIds = hasTargetGames
        ? formData.targetGames
            .map((g) => Number(g.id))
            .filter((pid) => Number.isFinite(pid) && pid > 0)
        : [];

      const userIds = hasTargetUsers
        ? formData.targetUsers
            .map((u) => Number(u.id))
            .filter((uid) => Number.isFinite(uid) && uid > 0)
        : [];

      if (isEditMode && voucherId) {
        await updateMutation.mutateAsync({
          id: voucherId,
          data: {
            name: formData.name.trim(),
            code: formData.code.trim().toUpperCase(),
            discount_type: formData.discountType,
            discount_value: discountAmount,
            min_purchase: minPurchase,
            slot: slot,
            usage_limit_per_user: usageLimitPerUser > 0 ? usageLimitPerUser : 1,
            started_at: startIso,
            expired_at: endIso,
            is_active: !isDraft,
            applies_to: formData.applicableToSubs ? "all" : "one_time",
            product_scope: productScope,
            target_type: targetType,
            product_ids: productIds,
            user_ids: userIds,
          },
        });

        // Sync target products & users if any
        if (productIds.length > 0) {
          await adminVoucherService.addProducts(voucherId, productIds).catch(() => null);
        }
        if (userIds.length > 0) {
          await adminVoucherService.addUsers(voucherId, userIds).catch(() => null);
        }

        toast.success(
          isDraft
            ? "Perubahan voucher berhasil disimpan sebagai draft."
            : "Perubahan voucher berhasil disimpan.",
          "Voucher Diperbarui"
        );
        router.push("/admin/vouchers");
        return;
      }

      // Create new voucher
      await createMutation.mutateAsync({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        discount_type: formData.discountType,
        discount_value: discountAmount,
        min_purchase: minPurchase,
        slot: slot,
        usage_limit_per_user: usageLimitPerUser > 0 ? usageLimitPerUser : 1,
        started_at: startIso,
        expired_at: endIso,
        is_active: !isDraft,
        status: isDraft ? "draft" : "active",
        applies_to: formData.applicableToSubs ? "all" : "one_time",
        product_scope: productScope,
        target_type: targetType,
        target_games: formData.targetGames,
        target_users: formData.targetUsers,
        product_ids: productIds,
        user_ids: userIds,
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
          ?.message || (isEditMode ? "Gagal memperbarui voucher." : "Gagal membuat voucher.");
      toast.error(msg, "Gagal");
      setIsSaving(false);
    }
  };

  // Header Left Breadcrumb Title: "Voucher > Add Voucher" or "Voucher > Edit Voucher"
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/vouchers"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Voucher
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">
        {isEditMode ? "Edit Voucher" : "Add Voucher"}
      </span>
    </div>
  );

  // Header Right Action Buttons: [Save and List] [Save Draft] [✕]
  const headerRight = (
    <div className="flex items-center gap-3 select-none">
      <Button
        variant="primary"
        size="sm"
        disabled={isSaving || isPageLoading}
        onClick={() => handleSubmit(false)}
      >
        {isSaving
          ? "Menyimpan..."
          : isEditMode
          ? "Simpan Perubahan"
          : "Save and List"}
      </Button>

      <Button
        variant="inactive"
        size="sm"
        disabled={isSaving || isPageLoading}
        onClick={() => handleSubmit(true)}
      >
        {isSaving ? "Menyimpan..." : "Save Draft"}
      </Button>

      <Link
        href="/admin/vouchers"
        aria-label="Tutup form dan kembali ke daftar voucher"
        className="w-8 h-8 rounded-lg bg-deep-blue-900 border border-deep-blue-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-deep-blue-800 transition-colors cursor-pointer"
      >
        <CloseIcon className="w-4 h-4" />
      </Link>
    </div>
  );

  return (
    <>
      <Head>
        <title>
          {isEditMode ? "Edit Voucher" : "Add Voucher"} | Gamezygo Admin
        </title>
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="voucher"
        headerRight={headerRight}
      >
        {isPageLoading ? (
          <AdminAddVoucherSkeleton />
        ) : (
          <div className="flex flex-col gap-8 w-full pb-12 select-none font-sans">
            {/* Section 1: Voucher Identities (Name, Code, Discount Type, Discount Value) */}
            <section className="w-full">
              <AdminAddVoucherIdentities
                formData={formData}
                onChange={handleFormChange}
              />
            </section>

            {/* Section 2: Target Game & Target User Lists / Empty States */}
            <section className="w-full">
              <AdminAddVoucherTargetSection
                formData={formData}
                onChange={handleFormChange}
              />
            </section>

            {/* Section 3: Voucher Rules (Min Purchase, Max Usage, Limit Per User, Applicable To Subs) */}
            <section className="w-full">
              <AdminAddVoucherRules
                formData={formData}
                onChange={handleFormChange}
              />
            </section>

            {/* Section 4: Date Range Picker (Start Date & End Date) */}
            <section className="w-full">
              <AdminAddVoucherDateRange
                formData={formData}
                onChange={handleFormChange}
              />
            </section>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
