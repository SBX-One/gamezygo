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
import { useCreateProduct, useAdminCatalogFilters } from "@/hooks/use-admin-catalog";
import { useAdminSections } from "@/hooks/use-admin-sections";
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

export default function AdminAddProductPage() {
  const router = useRouter();
  const [draftFormData, setDraftFormData] =
    React.useState<AdminAddProductFormData | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const createProductMutation = useCreateProduct();
  const { data: filterMeta } = useAdminCatalogFilters();
  const { data: serverSections } = useAdminSections();

  const formData: AdminAddProductFormData = React.useMemo(() => {
    if (draftFormData) return draftFormData;
    const queryTitle =
      router.isReady && typeof router.query.title === "string"
        ? router.query.title
        : "";
    const querySteamUrl =
      router.isReady && typeof router.query.steamUrl === "string"
        ? router.query.steamUrl
        : "";
    return {
      ...DEFAULT_ADD_PRODUCT_FORM,
      name: queryTitle || DEFAULT_ADD_PRODUCT_FORM.name,
      storeUrl: querySteamUrl || DEFAULT_ADD_PRODUCT_FORM.storeUrl,
    };
  }, [draftFormData, router.isReady, router.query.title, router.query.steamUrl]);

  const handleFormChange = (fields: Partial<AdminAddProductFormData>) => {
    setDraftFormData((prev) => ({ ...(prev ?? formData), ...fields }));
    if (errorMessage) setErrorMessage(null);
  };

  const buildPayload = (status: "listing" | "pre-order" | "archive") => {
    const cleanPrice = parseInt(formData.finalPrice.replace(/\D/g, ""), 10) || 0;
    const cleanInitialPrice = parseInt(formData.initialPrice.replace(/\D/g, ""), 10) || cleanPrice;

    // Resolve category IDs from genre names
    const categoryIds = (formData.genres || [])
      .map((g) => {
        const match = filterMeta?.categories?.find(
          (c: { name?: string; id?: number }) => c.name?.toLowerCase() === g.toLowerCase()
        );
        return match ? match.id : null;
      })
      .filter((id): id is number => id !== null);

    // Resolve launcher ID
    const launcherList = (filterMeta as { launcher?: Array<{ name?: string; id?: number }> } | null)?.launcher;
    const launcherMatch = launcherList?.find(
      (l) => l.name?.toLowerCase() === (formData.launcher || "").toLowerCase()
    );
    const launcherId = launcherMatch ? launcherMatch.id : undefined;

    // Resolve promotion section ID
    const sectionMatch = serverSections?.find(
      (s) => s.title === formData.promotionSection
    );
    const promoSectionId = sectionMatch ? sectionMatch.id : undefined;

    // Resolve instruction template ID
    const rawTemplateId = formData.selectedTemplate?.id;
    const isDbId = rawTemplateId && /^\d+$/.test(String(rawTemplateId));
    const instructionId = isDbId ? Number(rawTemplateId) : undefined;

    const isPreOrderProduct = formData.isPreOrder || status === "pre-order";

    if (formData.imageFile) {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("price", String(cleanPrice));
      payload.append("original_price", String(cleanInitialPrice));
      payload.append("is_preorder", String(formData.isPreOrder));
      payload.append("status", status);
      payload.append("steam_url", formData.storeUrl || "");
      if (!isPreOrderProduct) {
        if (formData.accountUsername) {
          payload.append("game_account[username]", formData.accountUsername);
        }
        if (formData.accountPassword) {
          payload.append("game_account[password]", formData.accountPassword);
        }
      }
      payload.append("thumbnail", formData.imageFile);
      formData.genres.forEach((genre) => {
        payload.append("genres[]", genre);
      });
      categoryIds.forEach((cid) => {
        payload.append("category_ids[]", String(cid));
      });
      if (launcherId) {
        payload.append("launcher_ids[]", String(launcherId));
      }
      if (promoSectionId) {
        payload.append("promotion_section_id", String(promoSectionId));
      }
      if (instructionId) {
        payload.append("instruction_template_id", String(instructionId));
      }
      formData.minimumSpecs.forEach((s, i) => {
        payload.append(`specifications[minimum][${i}][type]`, s.label);
        payload.append(`specifications[minimum][${i}][value]`, s.value);
      });
      formData.recommendationSpecs.forEach((s, i) => {
        payload.append(`specifications[recommended][${i}][type]`, s.label);
        payload.append(`specifications[recommended][${i}][value]`, s.value);
      });
      return payload;
    }

    return {
      name: formData.name.trim(),
      price: cleanPrice,
      original_price: cleanInitialPrice,
      is_preorder: formData.isPreOrder,
      status: status,
      steam_url: formData.storeUrl,
      image_url: formData.imageSrc,
      genres: formData.genres,
      category_ids: categoryIds,
      launcher_ids: launcherId ? [launcherId] : undefined,
      promotion_section_id: promoSectionId,
      instruction_template_id: instructionId,
      ...(isPreOrderProduct
        ? {}
        : {
            game_account: {
              username: formData.accountUsername,
              password: formData.accountPassword,
            },
          }),
      specifications: {
        minimum: formData.minimumSpecs.map((s) => ({ type: s.label, value: s.value })),
        recommended: formData.recommendationSpecs.map((s) => ({ type: s.label, value: s.value })),
      },
    };
  };

  const handleSaveAndList = async () => {
    if (!formData.name.trim()) {
      setErrorMessage("Nama produk wajib diisi.");
      toast.warning("Nama produk wajib diisi.", "Validasi");
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await createProductMutation.mutateAsync(
        buildPayload(formData.isPreOrder ? "pre-order" : "listing")
      );
      toast.success("Game baru berhasil ditambahkan dan tampil di toko!");
      router.push("/admin/catalog");
    } catch (err: unknown) {
      console.error(err);
      setIsSaving(false);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan produk baru.";
      toast.error(msg);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.name.trim()) {
      setErrorMessage("Nama produk wajib diisi.");
      toast.warning("Nama produk wajib diisi.", "Validasi");
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await createProductMutation.mutateAsync(buildPayload("archive"));
      toast.success("Game berhasil disimpan sebagai arsip/draft.");
      router.push("/admin/catalog/archived");
    } catch (err: unknown) {
      console.error(err);
      setIsSaving(false);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan draft produk.";
      toast.error(msg);
    }
  };

  // Header Left Title: Breadcrumb "Katalog > Add Product"
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
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

  // Header Right Actions: Save and List, Save Draft, Close Button (Desktop only on md+)
  const headerRight = (
    <div className="hidden md:flex items-center gap-3 select-none">
      <Button
        type="button"
        variant="primary"
        size="sm"
        disabled={isSaving}
        onClick={handleSaveAndList}
        className="cursor-pointer"
      >
        {isSaving ? "Menyimpan..." : "Save and List"}
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
          content="Tambah produk katalog game baru ke Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="katalog"
        headerRight={headerRight}
      >
        <div className="space-y-6 pb-12">
          {/* Mobile-Only Action Buttons placed above the form */}
          <div className="flex flex-col gap-3 w-full md:hidden">
            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              disabled={isSaving}
              onClick={handleSaveAndList}
              className="cursor-pointer"
            >
              {isSaving ? "Menyimpan..." : "Save and List"}
            </Button>

            <Button
              type="button"
              variant="inactive"
              size="md"
              fullWidth
              disabled={isSaving}
              onClick={handleSaveDraft}
              className="cursor-pointer"
            >
              Save Draft
            </Button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Basic Info (Title, Prices, Pre-Order, Genres, Image Cover) */}
          <AdminAddProductBasicInfo
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 2: Launcher & Store URL */}
          <AdminAddProductLauncherSection
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 3: Shared Account Credentials (Hidden for Pre-Order products, FR-25 / BUG-016) */}
          {!formData.isPreOrder && (
            <AdminAddProductAccountInfo
              formData={formData}
              onChange={handleFormChange}
            />
          )}

          {/* Section 4: Minimum & Recommendation Hardware Specs */}
          <AdminAddProductSpecs
            formData={formData}
            onChange={handleFormChange}
          />

          {/* Section 5: Instruction Template Accordion */}
          <AdminAddProductInstructionTemplate
            formData={formData}
            onChange={handleFormChange}
          />
        </div>
      </AdminLayout>
    </>
  );
}
