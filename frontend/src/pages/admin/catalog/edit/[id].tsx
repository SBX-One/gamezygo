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
import {
  useAdminProductDetail,
  useUpdateProduct,
  useToggleProductStatus,
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

export default function AdminEditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const productId = typeof id === "string" ? id : "";

  const [formData, setFormData] = React.useState<AdminAddProductFormData>(
    MOCK_EDIT_PRODUCT_FORM
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false);

  // Live database hooks
  const { data: serverProduct, isLoading: isFetchingProduct } =
    useAdminProductDetail(productId);
  const updateProductMutation = useUpdateProduct();
  const toggleStatusMutation = useToggleProductStatus();

  // Populate form with real database data
  React.useEffect(() => {
    if (serverProduct) {
      setFormData((prev) => ({
        ...prev,
        name: serverProduct.name,
        finalPrice: String(serverProduct.price),
        initialPrice: String(
          serverProduct.original_price || serverProduct.price
        ),
        isPreOrder: Boolean(serverProduct.is_preorder),
        genres: serverProduct.categories
          ? serverProduct.categories.map((c) => c.name)
          : prev.genres,
        imageSrc: serverProduct.image_url || prev.imageSrc,
        launcher:
          (serverProduct.launchers?.[0]?.name as "Steam") || prev.launcher,
        storeUrl: serverProduct.steam_url || prev.storeUrl,
        accountUsername:
          serverProduct.game_account?.username || prev.accountUsername,
        accountPassword:
          serverProduct.game_account?.password || prev.accountPassword,
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
      }));
    }
  }, [serverProduct]);

  const handleFormChange = (fields: Partial<AdminAddProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSaveAndList = async () => {
    if (!formData.name.trim()) {
      toast.warning("Nama produk wajib diisi.", "Validasi");
      return;
    }

    setIsSaving(true);
    const cleanPrice =
      parseInt(formData.finalPrice.replace(/\D/g, ""), 10) || 0;

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

        // Include selected genres
        formData.genres.forEach((genre) => {
          payload.append("genres[]", genre);
        });

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
            game_account: {
              username: formData.accountUsername,
              password: formData.accountPassword,
            },
          },
        });
      }
      toast.success("Perubahan produk berhasil disimpan!");
      router.push("/admin/catalog");
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
    router.push("/admin/catalog");
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
      router.push("/admin/catalog");
    } catch (err: unknown) {
      console.error(err);
      setIsSaving(false);
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal mengarsipkan game.";
      toast.error(msg);
    }
  };
      router.push("/admin/catalog");
    }
  };

  // Header Left Title: Breadcrumb "Katalog > Edit Product"
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-label-xs">
      <Link
        href="/admin/catalog"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Katalog
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">
        {serverProduct?.name ? `Edit: ${serverProduct.name}` : "Edit Product"}
      </span>
    </div>
  );

  // Header Right Actions: Save and List, Cancel Edit, Archive Product
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
        {isSaving ? "Menyimpan..." : "Save and List"}
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
          {isFetchingProduct && (
            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Memuat data produk dari database...
            </div>
          )}

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
          />
        </div>

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
