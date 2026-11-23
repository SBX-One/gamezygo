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
  AdminEditProductSkeleton,
} from "@/features/admin/components/catalog/add";
import {
  DEFAULT_ADD_PRODUCT_FORM,
  type AdminAddProductFormData,
} from "@/features/admin/types/admin-add-product.types";
import { AdminConfirmSaveModal } from "@/features/admin/components/catalog";
import {
  useAdminProductDetail,
  useUpdateProduct,
} from "@/hooks/use-admin-catalog";
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

export default function AdminPreOrderEditProductPage() {
  const router = useRouter();
  const { id, action } = router.query;
  const productId = typeof id === "string" ? id : "";
  const isContinueToList = action === "list";

  const [formData, setFormData] = React.useState<AdminAddProductFormData>(
    DEFAULT_ADD_PRODUCT_FORM
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = React.useState(false);

  // Live database hooks
  const { data: serverProduct, isLoading: isFetchingProduct } =
    useAdminProductDetail(productId);
  const updateProductMutation = useUpdateProduct();

  // Populate form with real database data
  React.useEffect(() => {
    if (serverProduct) {
      const timer = setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          name: serverProduct.name,
          finalPrice: String(serverProduct.price),
          initialPrice: String(
            serverProduct.original_price || serverProduct.price
          ),
          // If "Continue to List", toggle Pre-order to false so it is prepared for immediate storefront listing
          isPreOrder: isContinueToList ? false : Boolean(serverProduct.is_preorder),
          genres: serverProduct.categories
            ? Array.from(
                new Set(
                  serverProduct.categories
                    .map((c) => (c.name ? c.name.trim() : ""))
                    .filter(Boolean)
                )
              )
            : prev.genres,
          imageSrc: serverProduct.image_url || prev.imageSrc,
          launcher:
            (serverProduct.launchers?.[0]?.name as "Steam") || prev.launcher,
          promotionSection:
            serverProduct.promotion_section || prev.promotionSection || "Pilih section",
          storeUrl: serverProduct.steam_url || "",
          accountUsername: serverProduct.game_account?.username || "",
          accountPassword: serverProduct.game_account?.password || "",
          minimumSpecs:
            serverProduct.specifications?.minimum &&
            serverProduct.specifications.minimum.length > 0
              ? serverProduct.specifications.minimum.map((s, idx) => ({
                  id: `min-${idx}`,
                  label: s.type,
                  value: s.value,
                }))
              : prev.minimumSpecs,
          recommendationSpecs:
            serverProduct.specifications?.recommended &&
            serverProduct.specifications.recommended.length > 0
              ? serverProduct.specifications.recommended.map((s, idx) => ({
                  id: `rec-${idx}`,
                  label: s.type,
                  value: s.value,
                }))
              : prev.recommendationSpecs,
          hasInstructionTemplate: Boolean(serverProduct.instruction_template),
          selectedTemplate: serverProduct.instruction_template
            ? {
                id: String(serverProduct.instruction_template.id),
                title: serverProduct.instruction_template.name,
                badge: "Listed",
                createdAt: "22/07/2026",
                lastEdit: "Last edit 7 days ago",
                steps: prev.selectedTemplate?.steps || [
                  {
                    stepNumber: 1,
                    title: serverProduct.instruction_template.name,
                    description:
                      "Ikuti langkah download dan login sesuai panduan resmi akun game.",
                  },
                ],
              }
            : prev.selectedTemplate,
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [serverProduct, isContinueToList]);

  // Restore draft from sessionStorage if admin previously clicked "Create New Template"
  React.useEffect(() => {
    if (!productId) return;
    try {
      const savedDraft = sessionStorage.getItem(`edit_preorder_draft_${productId}`);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object") {
          const timer = setTimeout(() => {
            setFormData((prev) => ({
              ...prev,
              ...parsed,
            }));
          }, 0);
          return () => clearTimeout(timer);
        }
        sessionStorage.removeItem(`edit_preorder_draft_${productId}`);
      }
    } catch {
      // ignore
    }
  }, [productId]);

  const handleFormChange = (fields: Partial<AdminAddProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  // Auto-save current edits to DB and sessionStorage before navigating to create new instruction
  const handleCreateNewTemplateWithAutoSave = async () => {
    try {
      sessionStorage.setItem(
        `edit_preorder_draft_${productId}`,
        JSON.stringify(formData)
      );
    } catch {
      // ignore
    }

    if (formData.name.trim()) {
      try {
        setIsSaving(true);
        const cleanPrice =
          parseInt(formData.finalPrice.replace(/\D/g, ""), 10) || 0;
        const targetStatus = isContinueToList || !formData.isPreOrder ? "listing" : "pre-order";

        const specifications = {
          minimum: (formData.minimumSpecs || []).map((s) => ({
            type: s.label,
            value: s.value,
          })),
          recommended: (formData.recommendationSpecs || []).map((s) => ({
            type: s.label,
            value: s.value,
          })),
        };

        const promoSection =
          formData.promotionSection && formData.promotionSection !== "Pilih section"
            ? formData.promotionSection
            : "";

        const rawTemplateId = formData.selectedTemplate?.id;
        const isDbId =
          rawTemplateId &&
          /^\d+$/.test(String(rawTemplateId)) &&
          Number(rawTemplateId) < 100000;
        const instructionId = isDbId ? Number(rawTemplateId) : undefined;
        const instructionTitle = formData.selectedTemplate?.title || undefined;

        if (formData.imageFile) {
          const payload = new FormData();
          payload.append("name", formData.name.trim());
          payload.append("price", String(cleanPrice));
          payload.append("steam_url", formData.storeUrl || "");
          payload.append("status", targetStatus);
          payload.append("is_preorder", formData.isPreOrder ? "1" : "0");
          if (formData.accountUsername) {
            payload.append("game_account[username]", formData.accountUsername);
          }
          if (formData.accountPassword) {
            payload.append("game_account[password]", formData.accountPassword);
          }
          payload.append("thumbnail", formData.imageFile);
          formData.genres.forEach((g) => payload.append("genres[]", g));
          payload.append("specifications", JSON.stringify(specifications));
          payload.append("promotion_section", promoSection);
          if (instructionId) {
            payload.append("instruction_template_id", String(instructionId));
          }
          if (instructionTitle) {
            payload.append("instruction_title", instructionTitle);
          }
          await updateProductMutation.mutateAsync({ id: productId, data: payload });
        } else {
          await updateProductMutation.mutateAsync({
            id: productId,
            data: {
              name: formData.name.trim(),
              price: cleanPrice,
              steam_url: formData.storeUrl,
              status: targetStatus,
              is_preorder: formData.isPreOrder,
              image_url: formData.imageSrc,
              genres: formData.genres,
              game_account: {
                username: formData.accountUsername,
                password: formData.accountPassword,
              },
              specifications,
              promotion_section: promoSection,
              instruction_template_id: instructionId,
              instruction_title: instructionTitle,
            },
          });
        }
        toast.info("Perubahan produk tersimpan sebelum membuka pembuat instruksi.", "Tersimpan");
      } catch (err) {
        console.warn("Auto-save sebelum buat instruksi:", err);
      } finally {
        setIsSaving(false);
      }
    }

    const returnUrl = router.asPath;
    router.push(`/admin/instructions/add?returnUrl=${encodeURIComponent(returnUrl)}&productId=${productId}`);
  };

  const handleSaveAndList = () => {
    if (!formData.name.trim()) {
      toast.warning("Nama produk wajib diisi.", "Validasi");
      return;
    }
    setIsConfirmSaveOpen(true);
  };

  const handleExecuteSave = async () => {
    setIsSaving(true);
    const cleanPrice =
      parseInt(formData.finalPrice.replace(/\D/g, ""), 10) || 0;

    // Status is 'listing' if continue to list or pre-order switch is toggled off, otherwise 'pre-order'
    const targetStatus = isContinueToList || !formData.isPreOrder ? "listing" : "pre-order";

    const specifications = {
      minimum: (formData.minimumSpecs || []).map((s) => ({
        type: s.label,
        value: s.value,
      })),
      recommended: (formData.recommendationSpecs || []).map((s) => ({
        type: s.label,
        value: s.value,
      })),
    };

    const promoSection =
      formData.promotionSection && formData.promotionSection !== "Pilih section"
        ? formData.promotionSection
        : "";

    const rawTemplateId = formData.selectedTemplate?.id;
    const isDbId =
      rawTemplateId &&
      /^\d+$/.test(String(rawTemplateId)) &&
      Number(rawTemplateId) < 100000;
    const instructionId = isDbId ? Number(rawTemplateId) : undefined;
    const instructionTitle = formData.selectedTemplate?.title || undefined;

    try {
      if (formData.imageFile) {
        const payload = new FormData();
        payload.append("name", formData.name.trim());
        payload.append("price", String(cleanPrice));
        payload.append("steam_url", formData.storeUrl || "");
        payload.append("status", targetStatus);
        payload.append("is_preorder", formData.isPreOrder ? "1" : "0");
        if (formData.accountUsername) {
          payload.append("game_account[username]", formData.accountUsername);
        }
        if (formData.accountPassword) {
          payload.append("game_account[password]", formData.accountPassword);
        }
        payload.append("thumbnail", formData.imageFile);

        formData.genres.forEach((genre) => {
          payload.append("genres[]", genre);
        });

        payload.append("specifications", JSON.stringify(specifications));
        payload.append("promotion_section", promoSection);
        if (instructionId) {
          payload.append("instruction_template_id", String(instructionId));
        }
        if (instructionTitle) {
          payload.append("instruction_title", instructionTitle);
        }

        await updateProductMutation.mutateAsync({
          id: productId,
          data: payload,
        });
      } else {
        await updateProductMutation.mutateAsync({
          id: productId,
          data: {
            name: formData.name.trim(),
            price: cleanPrice,
            steam_url: formData.storeUrl,
            status: targetStatus,
            is_preorder: formData.isPreOrder,
            image_url: formData.imageSrc,
            genres: formData.genres,
            game_account: {
              username: formData.accountUsername,
              password: formData.accountPassword,
            },
            specifications,
            promotion_section: promoSection,
            instruction_template_id: instructionId,
            instruction_title: instructionTitle,
          },
        });
      }

      setIsConfirmSaveOpen(false);

      if (targetStatus === "listing") {
        toast.success(`Game "${formData.name}" berhasil dipublikasikan ke katalog toko!`, "Berhasil Terdaftar");
      } else {
        toast.success(`Perubahan game "${formData.name}" berhasil disimpan!`, "Tersimpan");
      }

      router.push("/admin/pre-orders");
    } catch (err: unknown) {
      console.error("Gagal mengupdate produk:", err);
      setIsSaving(false);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menyimpan perubahan produk. Silakan coba kembali.";
      toast.error(msg);
    }
  };

  const handleCancelEdit = () => {
    router.push("/admin/pre-orders");
  };

  // Header Left Title: Breadcrumb "Pre-order > Continue to List / Edit Product"
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/pre-orders"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Pre-order
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">
        {isContinueToList
          ? serverProduct?.name
            ? `Continue to List: ${serverProduct.name}`
            : "Continue to List"
          : serverProduct?.name
          ? `Edit: ${serverProduct.name}`
          : "Edit Product"}
      </span>
    </div>
  );

  // Header Right Actions: Save and List, Cancel Edit (Desktop only on md+)
  const isFormLocked = isSaving || (isFetchingProduct && !serverProduct);
  const headerRight = (
    <div className="hidden md:flex items-center gap-3 select-none">
      <Button
        type="button"
        variant="primary"
        size="sm"
        disabled={isFormLocked}
        onClick={handleSaveAndList}
        className="cursor-pointer"
      >
        {isSaving
          ? "Menyimpan..."
          : isContinueToList
          ? "Save and List"
          : "Simpan Perubahan"}
      </Button>

      <Button
        type="button"
        variant="inactive"
        size="sm"
        disabled={isFormLocked}
        onClick={handleCancelEdit}
        className="cursor-pointer"
      >
        Cancel Edit
      </Button>
    </div>
  );

  return (
    <>
      <Head>
        <title>
          {isContinueToList ? "Continue to List" : "Edit Pre-order Product"} | Gamezygo Admin
        </title>
        <meta
          name="description"
          content="Edit detail dan konfigurasi produk pre-order Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="pre-order"
        headerRight={headerRight}
      >
        {isFetchingProduct && !serverProduct ? (
          <AdminEditProductSkeleton showPreOrder={true} />
        ) : (
          <div className="space-y-6 pb-16">
            {/* Mobile-Only Action Buttons (Simpan Perubahan / Save and List + Cancel Edit) placed above the form */}
            <div className="flex flex-col gap-3 w-full md:hidden">
              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                disabled={isFormLocked}
                onClick={handleSaveAndList}
                className="cursor-pointer"
              >
                {isSaving
                  ? "Menyimpan..."
                  : isContinueToList
                  ? "Save and List"
                  : "Simpan Perubahan"}
              </Button>

              <Button
                type="button"
                variant="inactive"
                size="md"
                fullWidth
                disabled={isFormLocked}
                onClick={handleCancelEdit}
                className="cursor-pointer"
              >
                Cancel Edit
              </Button>
            </div>

            {/* Main Container Card */}
            <div className="w-full rounded-2xl bg-deep-blue-950 border border-deep-blue-700 p-6 sm:p-8 space-y-8 select-none">
              {/* Section 1: Basic Information */}
              <AdminAddProductBasicInfo
                formData={formData}
                onChange={handleFormChange}
                showPreOrder={true}
              />

              <hr className="border-deep-blue-700/60" />

              {/* Section 2: Product Launcher */}
              <AdminAddProductLauncherSection
                formData={formData}
                onChange={handleFormChange}
              />

              <hr className="border-deep-blue-700/60" />

              {/* Section 3: Informasi Akun Game */}
              <AdminAddProductAccountInfo
                formData={formData}
                onChange={handleFormChange}
              />

              <hr className="border-deep-blue-700/60" />

              {/* Section 4: Spesifikasi Sistem */}
              <AdminAddProductSpecs
                formData={formData}
                onChange={handleFormChange}
              />

              <hr className="border-deep-blue-700/60" />

              {/* Section 5: Template Instruksi */}
              <AdminAddProductInstructionTemplate
                formData={formData}
                onChange={handleFormChange}
                onCreateNewTemplate={handleCreateNewTemplateWithAutoSave}
              />
            </div>
          </div>
        )}

        {/* Save Confirmation Modal */}
        <AdminConfirmSaveModal
          isOpen={isConfirmSaveOpen}
          onClose={() => setIsConfirmSaveOpen(false)}
          onConfirm={handleExecuteSave}
          isLoading={isSaving}
          title={isContinueToList ? "Publikasikan ke Katalog Toko?" : "Simpan Perubahan Pre-order?"}
          description={
            isContinueToList
              ? `Apakah Anda yakin ingin mempublikasikan game "${formData.name}" dari Pre-order ke katalog aktif toko?`
              : `Apakah Anda yakin ingin menyimpan perubahan pada konfigurasi dan detail game "${formData.name}"?`
          }
          confirmText={isContinueToList ? "Publikasikan" : "Simpan Perubahan"}
        />
      </AdminLayout>
    </>
  );
}

