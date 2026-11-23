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
import {
  AdminCatalogDeleteModal,
  AdminConfirmSaveModal,
} from "@/features/admin/components/catalog";
import {
  useAdminProductDetail,
  useUpdateProduct,
  useToggleProductStatus,
  useAdminCatalogFilters,
} from "@/hooks/use-admin-catalog";
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

export default function AdminEditProductPage() {
  const router = useRouter();
  const { id, from } = router.query;
  const productId = typeof id === "string" ? id : "";
  const isFromPreOrder = from === "pre-orders" || from === "pre-order";
  const backHref = isFromPreOrder ? "/admin/pre-orders" : "/admin/catalog";
  const backLabel = isFromPreOrder ? "Pre-order" : "Katalog";

  const [formData, setFormData] = React.useState<AdminAddProductFormData>(
    DEFAULT_ADD_PRODUCT_FORM
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = React.useState(false);

  // Live database hooks
  const { data: serverProduct, isLoading: isFetchingProduct } =
    useAdminProductDetail(productId);
  const updateProductMutation = useUpdateProduct();
  const toggleStatusMutation = useToggleProductStatus();
  const { data: filterMeta } = useAdminCatalogFilters();
  const { data: serverSections } = useAdminSections();

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
          isPreOrder: Boolean(serverProduct.is_preorder),
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
            serverProduct.promotion_section ||
            serverSections?.find(
              (s) => Number(s.id) === Number(serverProduct.promotion_section_id)
            )?.title ||
            "Pilih section",
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
  }, [serverProduct, serverSections]);

  // Restore draft from sessionStorage if admin previously clicked "Create New Template"
  React.useEffect(() => {
    if (!productId) return;
    try {
      const savedDraft = sessionStorage.getItem(`edit_product_draft_${productId}`);
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
        sessionStorage.removeItem(`edit_product_draft_${productId}`);
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
        `edit_product_draft_${productId}`,
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

        // Resolve category IDs from genre names
        const categoryIds = (formData.genres || [])
          .map((g) => {
            const match = filterMeta?.categories?.find(
              (c: { id: number; name?: string }) => c.name?.toLowerCase() === g.toLowerCase()
            );
            return match ? match.id : null;
          })
          .filter((id): id is number => id !== null);

        // Resolve launcher ID
        const launcherMatch = (filterMeta as { launcher?: Array<{ id: number; name?: string }> })?.launcher?.find(
          (l: { id: number; name?: string }) => l.name?.toLowerCase() === (formData.launcher || "").toLowerCase()
        );
        const launcherId = launcherMatch ? launcherMatch.id : undefined;

        // Resolve promotion section ID
        const sectionMatch = serverSections?.find(
          (s) => s.title === promoSection
        );
        const promoSectionId = sectionMatch ? sectionMatch.id : undefined;

        if (formData.imageFile) {
          const payload = new FormData();
          payload.append("name", formData.name.trim());
          payload.append("price", String(cleanPrice));
          payload.append("steam_url", formData.storeUrl || "");
          payload.append("status", "listing");
          if (formData.accountUsername) {
            payload.append("game_account[username]", formData.accountUsername);
          }
          if (formData.accountPassword) {
            payload.append("game_account[password]", formData.accountPassword);
          }
          payload.append("thumbnail", formData.imageFile);
          formData.genres.forEach((g) => payload.append("genres[]", g));
          categoryIds.forEach((cid) => payload.append("category_ids[]", String(cid)));
          if (launcherId) payload.append("launcher_ids[]", String(launcherId));
          if (promoSectionId) payload.append("promotion_section_id", String(promoSectionId));
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
              status: "listing",
              image_url: formData.imageSrc,
              genres: formData.genres,
              category_ids: categoryIds.length ? categoryIds : undefined,
              launcher_ids: launcherId ? [launcherId] : undefined,
              promotion_section_id: promoSectionId,
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

    // Resolve category IDs from genre names
    const categoryIds = (formData.genres || [])
      .map((g) => {
        const match = filterMeta?.categories?.find(
          (c: { id: number; name?: string }) => c.name?.toLowerCase() === g.toLowerCase()
        );
        return match ? match.id : null;
      })
      .filter((id): id is number => id !== null);

    // Resolve launcher ID
    const launcherMatch = (filterMeta as { launcher?: Array<{ id: number; name?: string }> })?.launcher?.find(
      (l: { id: number; name?: string }) => l.name?.toLowerCase() === (formData.launcher || "").toLowerCase()
    );
    const launcherId = launcherMatch ? launcherMatch.id : undefined;

    // Resolve promotion section ID
    const sectionMatch = serverSections?.find(
      (s) => s.title === promoSection
    );
    const promoSectionId = sectionMatch ? sectionMatch.id : undefined;

    try {
      if (formData.imageFile) {
        const payload = new FormData();
        payload.append("name", formData.name.trim());
        payload.append("price", String(cleanPrice));
        payload.append("steam_url", formData.storeUrl || "");
        payload.append("status", "listing");
        if (formData.accountUsername) {
          payload.append("game_account[username]", formData.accountUsername);
        }
        if (formData.accountPassword) {
          payload.append("game_account[password]", formData.accountPassword);
        }
        payload.append("thumbnail", formData.imageFile);

        // Include selected genres and category IDs
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
            status: "listing", // ensure active in user store
            image_url: formData.imageSrc,
            genres: formData.genres,
            category_ids: categoryIds.length ? categoryIds : undefined,
            launcher_ids: launcherId ? [launcherId] : undefined,
            promotion_section_id: promoSectionId,
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
      toast.success("Perubahan produk berhasil disimpan!");
      router.push(backHref);
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
    router.push(backHref);
  };

  const handleConfirmArchive = async () => {
    setIsArchiveModalOpen(false);
    setIsSaving(true);
    try {
      await toggleStatusMutation.mutateAsync({
        productId,
        isActive: false, // status = 'archive'
      });
      toast.success("Game berhasil diarsipkan.");
      router.push(backHref);
    } catch (err: unknown) {
      console.error(err);
      setIsSaving(false);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengarsipkan game.";
      toast.error(msg);
    }
  };

  // Header Left Title: Breadcrumb "Katalog / Pre-order > Edit Product"
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href={backHref}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {backLabel}
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">
        {serverProduct?.name ? `Edit: ${serverProduct.name}` : "Edit Product"}
      </span>
    </div>
  );

  // Header Right Actions: Save and List, Cancel Edit, Archive Product (Desktop only on md+)
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
        {isSaving ? "Menyimpan..." : "Save and List"}
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

      <Button
        type="button"
        variant="inactive"
        size="sm"
        disabled={isFormLocked}
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
        activeNavId={isFromPreOrder ? "pre-order" : "katalog"}
        headerRight={headerRight}
      >
        {isFetchingProduct && !serverProduct ? (
          <AdminEditProductSkeleton showPreOrder={isFromPreOrder} />
        ) : (
          <div className="flex flex-col gap-8 w-full pb-8">
            {/* Mobile-Only Action Buttons placed above the form */}
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
                {isSaving ? "Menyimpan..." : "Save and List"}
              </Button>

              <div className="flex items-center gap-3 w-full">
                <Button
                  type="button"
                  variant="inactive"
                  size="md"
                  fullWidth
                  disabled={isFormLocked}
                  onClick={handleCancelEdit}
                  className="cursor-pointer flex-1"
                >
                  Cancel Edit
                </Button>

                <Button
                  type="button"
                  variant="inactive"
                  size="md"
                  fullWidth
                  disabled={isFormLocked}
                  onClick={() => setIsArchiveModalOpen(true)}
                  className="cursor-pointer flex-1"
                >
                  Archive
                </Button>
              </div>
            </div>

            {/* Section 1: Media & Basic Info */}
            <AdminAddProductBasicInfo
              formData={formData}
              onChange={handleFormChange}
              showPreOrder={false}
            />

            {/* Section 2: Launcher & Promotion Section */}
            <AdminAddProductLauncherSection
              formData={formData}
              onChange={handleFormChange}
            />

            {/* Section 3: Shared Account Credentials */}
            <AdminAddProductAccountInfo
              formData={formData}
              onChange={handleFormChange}
            />

            {/* Section 4: Minimum & Recommendation Hardware Specs */}
            <AdminAddProductSpecs
              formData={formData}
              onChange={handleFormChange}
            />

            {/* Section 5: Instruction Template Accordion */}
            <AdminAddProductInstructionTemplate
              formData={formData}
              onChange={handleFormChange}
              onCreateNewTemplate={handleCreateNewTemplateWithAutoSave}
            />
          </div>
        )}

        {/* Save Confirmation Modal */}
        <AdminConfirmSaveModal
          isOpen={isConfirmSaveOpen}
          onClose={() => setIsConfirmSaveOpen(false)}
          onConfirm={handleExecuteSave}
          isLoading={isSaving}
          title="Simpan Perubahan Produk?"
          description="Apakah Anda yakin ingin menyimpan perubahan pada konfigurasi dan detail produk ini ke database?"
          confirmText="Simpan Perubahan"
        />

        {/* Archive Confirmation Modal */}
        <AdminCatalogDeleteModal
          isOpen={isArchiveModalOpen}
          onClose={() => setIsArchiveModalOpen(false)}
          onConfirm={handleConfirmArchive}
          title="Arsipkan produk ini?"
          description="Produk ini akan disembunyikan dari katalog store pengguna."
          confirmText="Arsipkan"
        />
      </AdminLayout>
    </>
  );
}
