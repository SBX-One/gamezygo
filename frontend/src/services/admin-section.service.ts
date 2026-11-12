import { apiClient } from "@/lib/api-client";
import { resolveImageUrl } from "@/utils/image-url";
import type { ProductSection, SectionProduct } from "@/features/admin/types/admin-section.types";

interface BackendSectionCategory {
  id: number;
  name: string;
  slug?: string;
}

interface BackendSectionProduct {
  id: number | string;
  name?: string;
  title?: string;
  thumbnail?: string;
  image_url?: string;
  imageSrc?: string;
  price?: number;
  discount_price?: number;
  discount?: number | string;
  categories?: Array<BackendSectionCategory | string>;
}

interface BackendCustomSection {
  id: number | string;
  title: string;
  slug: string;
  custom_section_products?: BackendSectionProduct[];
  products?: BackendSectionProduct[];
}

export interface AdminCustomSectionResponse {
  success: boolean;
  message: string;
  data: BackendCustomSection[];
}

function mapSectionProduct(p: BackendSectionProduct): SectionProduct {
  const categories = Array.isArray(p.categories)
    ? p.categories
        .map((c) => (typeof c === "string" ? c : c?.name || ""))
        .filter(Boolean)
    : [];

  return {
    id: String(p.id),
    title: p.name || p.title || "Untitled Game",
    imageSrc: resolveImageUrl(p.thumbnail || p.image_url || p.imageSrc),
    categories,
    price: p.discount_price ?? p.price,
    originalPrice:
      p.price !== undefined && p.discount_price !== undefined && p.discount_price < p.price
        ? `Rp ${Number(p.price).toLocaleString("id-ID")}`
        : undefined,
    discount:
      p.discount !== undefined && p.discount !== null && Number(p.discount) > 0
        ? `${p.discount}%`
        : undefined,
  };
}

function mapCustomSection(section: BackendCustomSection): ProductSection {
  const rawProducts = section.custom_section_products ?? section.products ?? [];
  return {
    id: String(section.id),
    title: section.title,
    slug: section.slug,
    products: rawProducts.map(mapSectionProduct),
  };
}

export const adminSectionService = {
  /**
   * Fetch all product sections for admin
   */
  async getSections(): Promise<ProductSection[]> {
    const response = await apiClient.get<AdminCustomSectionResponse>("/admin/custom-sections");
    return (response.data.data ?? []).map(mapCustomSection);
  },

  /**
   * Create a new custom section
   */
  async createSection(title: string): Promise<ProductSection> {
    const response = await apiClient.post<{ success: boolean; data: BackendCustomSection }>(
      "/admin/custom-sections",
      { title, display_type: "manual" }
    );
    return mapCustomSection(response.data.data);
  },

  /**
   * Update section title
   */
  async updateSection(sectionId: string | number, data: { title?: string; display_type?: string }): Promise<unknown> {
    const numericId = typeof sectionId === "string" ? parseInt(sectionId.replace("sec-", ""), 10) || sectionId : sectionId;
    const response = await apiClient.patch(`/admin/custom-sections/${numericId}`, data);
    return response.data;
  },

  /**
   * Reorder sections by list of IDs
   */
  async reorderSections(sectionIds: Array<string | number>): Promise<unknown> {
    const numericIds = sectionIds.map((id) =>
      typeof id === "string" ? parseInt(id.replace("sec-", ""), 10) || id : id
    );
    try {
      const response = await apiClient.post("/admin/custom-sections/sort", {
        section_ids: numericIds,
      });
      return response.data;
    } catch {
      const response = await apiClient.put("/admin/custom-sections/reorder", {
        section_ids: numericIds,
      });
      return response.data;
    }
  },

  /**
   * Add active games to section
   */
  async addGamesToSection(sectionId: string | number, productIds: Array<string | number>): Promise<SectionProduct[]> {
    const numericSecId = typeof sectionId === "string" ? parseInt(sectionId.replace("sec-", ""), 10) || sectionId : sectionId;
    const numericProductIds = productIds.map((id) =>
      typeof id === "string" ? parseInt(id.replace("prod-", ""), 10) || id : id
    );
    const response = await apiClient.post<{ success: boolean; data: BackendSectionProduct[] }>(
      `/admin/custom-sections/${numericSecId}/products`,
      { product_ids: numericProductIds }
    );
    return (response.data.data ?? []).map(mapSectionProduct);
  },

  /**
   * Remove single game from section
   */
  async removeGameFromSection(sectionId: string | number, productId: string | number): Promise<unknown> {
    const cleanSecId = typeof sectionId === "string" ? sectionId.replace("sec-", "") : sectionId;
    const cleanProdId = typeof productId === "string" ? productId.replace("prod-", "") : productId;
    const response = await apiClient.delete(`/admin/custom-sections/${cleanSecId}/products/${cleanProdId}`);
    return response.data;
  },

  /**
   * Clear all games from section
   */
  async clearSection(sectionId: string | number): Promise<unknown> {
    const cleanSecId = typeof sectionId === "string" ? sectionId.replace("sec-", "") : sectionId;
    try {
      const response = await apiClient.delete(`/admin/custom-sections/${cleanSecId}/products`);
      return response.data;
    } catch {
      const response = await apiClient.post(`/admin/custom-sections/${cleanSecId}/clear`);
      return response.data;
    }
  },

  /**
   * Delete section
   */
  async deleteSection(sectionId: string | number): Promise<unknown> {
    const cleanSecId = typeof sectionId === "string" ? sectionId.replace("sec-", "") : sectionId;
    const response = await apiClient.delete(`/admin/custom-sections/${cleanSecId}`);
    return response.data;
  },
};

