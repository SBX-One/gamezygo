import { apiClient } from "@/lib/api-client";

export interface AdminCatalogCategoryItem {
  id: number;
  name: string;
}

export interface AdminCatalogProductResponseItem {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  categories: AdminCatalogCategoryItem[];
  price: number;
  original_price?: number;
  is_active: boolean;
  is_preorder: boolean;
  is_draft: boolean;
  is_listed: boolean;
  status: "listing" | "pre-order" | "archive" | string;
  created_at: string | null;
}

export interface AdminCatalogQueryParams {
  search?: string;
  category_ids?: number[];
  status?: string[];
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  page?: number;
  per_page?: number;
}

export interface AdminCatalogListResponse {
  success: boolean;
  message: string;
  data: {
    total_products: number;
    products: AdminCatalogProductResponseItem[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    };
  };
}

export interface AdminCatalogFiltersResponse {
  success: boolean;
  message: string;
  data: {
    categories: AdminCatalogCategoryItem[];
    statuses: Array<{ label: string; value: boolean }>;
    price_range: { min: number; max: number };
    sort_options: Array<{ label: string; value: string }>;
  };
}

export interface AdminCatalogProductDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    price: number;
    original_price: number;
    is_preorder: boolean;
    is_active: boolean;
    status: string;
    is_listed: boolean;
    categories: AdminCatalogCategoryItem[];
    launchers: Array<{ id: number; name: string }>;
    steam_url: string;
    game_account: {
      username: string;
      password?: string;
    };
    specifications: {
      minimum: Array<{ type: string; value: string }>;
      recommended: Array<{ type: string; value: string }>;
    };
    instruction_template?: {
      id: number;
      name: string;
    } | null;
    promotion_section?: string | null;
    promotion_section_id?: number | null;
    custom_sections?: Array<{ id: number; title: string }>;
    created_at: string | null;
  };
}

export interface AdminCatalogArchivedResponse {
  success: boolean;
  message: string;
  data: {
    total_archived?: number;
    total_products?: number;
    products: AdminCatalogProductResponseItem[];
    meta?: {
      current_page: number;
      from: number | null;
      last_page: number;
      per_page: number;
      to: number | null;
      total: number;
    };
  };
}

export const adminCatalogService = {
  /**
   * Fetch paginated list of catalog products
   */
  async getCatalog(params?: AdminCatalogQueryParams): Promise<AdminCatalogListResponse["data"]> {
    const response = await apiClient.get<AdminCatalogListResponse>("/admin/catalog", {
      params: {
        search: params?.search || undefined,
        category_ids: params?.category_ids?.length ? params.category_ids : undefined,
        status: params?.status?.length ? params.status : undefined,
        min_price: params?.min_price !== undefined ? params.min_price : undefined,
        max_price: params?.max_price !== undefined ? params.max_price : undefined,
        sort_by: params?.sort_by || "latest",
        page: params?.page || 1,
        per_page: params?.per_page || 20,
      },
    });

    return response.data.data;
  },

  /**
   * Fetch catalog filters metadata
   */
  async getFilters(): Promise<AdminCatalogFiltersResponse["data"]> {
    try {
      const response = await apiClient.get<AdminCatalogFiltersResponse>("/products/filters");
      return response.data.data;
    } catch {
      const response = await apiClient.get<AdminCatalogFiltersResponse>("/admin/catalog/filters");
      return response.data.data;
    }
  },

  /**
   * Fetch detailed product for viewing or editing
   */
  async getProduct(id: number | string): Promise<AdminCatalogProductDetailResponse["data"]> {
    const response = await apiClient.get<AdminCatalogProductDetailResponse>(`/admin/catalog/${id}`);
    return response.data.data;
  },

  /**
   * Create a new product
   */
  async createProduct(data: FormData | Record<string, unknown>): Promise<unknown> {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post("/admin/catalog", data, {
      headers: isFormData ? { "Content-Type": undefined } : undefined,
    });
    return response.data;
  },

  /**
   * Update product
   */
  async updateProduct(id: number | string, data: FormData | Record<string, unknown>): Promise<unknown> {
    const isFormData = data instanceof FormData;
    // For multipart forms with PHP/Laravel PUT, using POST or spoofing _method works reliably
    const response = await apiClient.post(`/admin/catalog/${id}`, data, {
      headers: isFormData ? { "Content-Type": undefined } : undefined,
    });
    return response.data;
  },

  /**
   * Toggle product De-list / Re-list status (separate from Archive, FR-26).
   * - isListed === true  -> status 'listing' (visible in public storefront)
   * - isListed === false -> status 'draft'   (hidden from public storefront, stays in catalog for quick edit)
   */
  async toggleListingStatus(productId: number | string, isListed: boolean): Promise<unknown> {
    const response = await apiClient.post(`/admin/catalog/${productId}`, {
      status: isListed ? "listing" : "draft",
    });
    return response.data;
  },

  /**
   * Toggle product archive / unarchive status.
   * Strictly for moving products to/from /admin/catalog/archived.
   */
  async toggleArchiveStatus(productId: number | string, isActive: boolean): Promise<unknown> {
    const response = await apiClient.patch(`/admin/catalog/archive/${productId}`, {
      is_archived: !isActive,
      is_active: isActive,
      status: isActive ? "listing" : "archive",
    });
    return response.data;
  },

  /**
   * Delete products by IDs
   */
  async deleteProducts(ids: Array<number | string>): Promise<unknown> {
    const numericIds = ids.map((id) => (typeof id === "string" ? parseInt(id.replace("prod-", ""), 10) || id : id));
    const response = await apiClient.delete("/admin/catalog", {
      data: { ids: numericIds },
    });
    return response.data;
  },

  /**
   * Fetch archived products
   */
  async getArchived(): Promise<AdminCatalogArchivedResponse["data"]> {
    const response = await apiClient.get<AdminCatalogArchivedResponse>("/admin/catalog/archive", {
      params: { per_page: 100 },
    });
    return response.data.data;
  },

  /**
   * Batch update archive / unarchive status for multiple products using be/dev per-product endpoint
   */
  async batchArchiveStatus(ids: Array<number | string>, isActive: boolean): Promise<unknown> {
    return Promise.all(ids.map((id) => this.toggleArchiveStatus(id, isActive)));
  },
};
