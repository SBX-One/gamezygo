import { apiClient } from "@/lib/api-client";
import type { ProductSection, SectionProduct } from "@/features/admin/types/admin-section.types";

export interface AdminCustomSectionResponse {
  success: boolean;
  message: string;
  data: ProductSection[];
}

export const adminSectionService = {
  /**
   * Fetch all product sections for admin
   */
  async getSections(): Promise<ProductSection[]> {
    const response = await apiClient.get<AdminCustomSectionResponse>("/admin/custom-sections");
    return response.data.data;
  },

  /**
   * Create a new custom section
   */
  async createSection(title: string): Promise<ProductSection> {
    const response = await apiClient.post<{ success: boolean; data: ProductSection }>(
      "/admin/custom-sections",
      { title, display_type: "manual" }
    );
    return response.data.data;
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
    const response = await apiClient.put("/admin/custom-sections/reorder", {
      section_ids: sectionIds,
    });
    return response.data;
  },

  /**
   * Add active games to section
   */
  async addGamesToSection(sectionId: string | number, productIds: Array<string | number>): Promise<SectionProduct[]> {
    const numericSecId = typeof sectionId === "string" ? parseInt(sectionId.replace("sec-", ""), 10) || sectionId : sectionId;
    const response = await apiClient.post<{ success: boolean; data: SectionProduct[] }>(
      `/admin/custom-sections/${numericSecId}/products`,
      { product_ids: productIds }
    );
    return response.data.data;
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
    const response = await apiClient.post(`/admin/custom-sections/${cleanSecId}/clear`);
    return response.data;
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

