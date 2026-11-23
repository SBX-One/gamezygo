import { apiClient } from "@/lib/api-client";
import type {
  AdminCategoryGroup,
  CategoryScope,
  SubCategoryItem,
} from "@/features/admin/types/admin-category.types";

export interface BackendSubCategoryItem {
  id: number | string;
  category_id?: number | string;
  category_name?: string;
  name: string;
  slug?: string;
  description?: string | null;
  total_products?: number;
  total_blogs?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BackendCategoryItem {
  id: number | string;
  name: string;
  slug?: string;
  description?: string | null;
  total_sub_categories?: number;
  total_products?: number;
  total_blogs?: number;
  sub_categories?: BackendSubCategoryItem[];
  created_at?: string;
  updated_at?: string;
}

interface BackendCategoriesListResponse {
  success: boolean;
  message: string;
  data: {
    total_categories?: number;
    categories?: BackendCategoryItem[];
  };
}

function mapBackendCategoryToGroup(
  item: BackendCategoryItem,
  scope: CategoryScope,
  orderIdx: number
): AdminCategoryGroup {
  const subCategories: SubCategoryItem[] = (item.sub_categories ?? []).map(
    (sub, idx) => ({
      id: String(sub.id),
      name: sub.name,
      orderNumber: idx + 1,
    })
  );

  return {
    id: String(item.id),
    scope,
    title: item.name,
    orderNumber: orderIdx + 1,
    subCategories,
    createdAt: item.created_at ? item.created_at.split("T")[0] : undefined,
  };
}

export const adminCategoryService = {
  /**
   * Fetch all product categories with sub-categories.
   */
  async getProductCategories(search?: string): Promise<AdminCategoryGroup[]> {
    const response = await apiClient.get<BackendCategoriesListResponse>(
      "/admin/product-categories",
      { params: { search: search || undefined } }
    );
    const list = response.data?.data?.categories ?? [];
    return list.map((item, idx) => mapBackendCategoryToGroup(item, "product", idx));
  },

  /**
   * Fetch all blog/article categories with sub-categories.
   */
  async getBlogCategories(search?: string): Promise<AdminCategoryGroup[]> {
    const response = await apiClient.get<BackendCategoriesListResponse>(
      "/admin/blog-categories",
      { params: { search: search || undefined } }
    );
    const list = response.data?.data?.categories ?? [];
    return list.map((item, idx) => mapBackendCategoryToGroup(item, "article", idx));
  },

  /**
   * Fetch both product and blog categories combined.
   */
  async getAllCategories(search?: string): Promise<{
    productCategories: AdminCategoryGroup[];
    articleCategories: AdminCategoryGroup[];
    categories: AdminCategoryGroup[];
  }> {
    const [products, articles] = await Promise.all([
      this.getProductCategories(search).catch(() => []),
      this.getBlogCategories(search).catch(() => []),
    ]);

    return {
      productCategories: products,
      articleCategories: articles,
      categories: [...articles, ...products],
    };
  },

  /**
   * Create a root category (and optionally initial sub-categories).
   */
  async createCategory(
    scope: CategoryScope,
    payload: {
      title: string;
      description?: string;
      subCategories?: string[];
    }
  ): Promise<AdminCategoryGroup> {
    const endpoint =
      scope === "product" ? "/admin/product-categories" : "/admin/blog-categories";

    const response = await apiClient.post<{ data: BackendCategoryItem }>(endpoint, {
      name: payload.title,
      description: payload.description || undefined,
    });

    const createdCat = response.data?.data;
    const catId = createdCat?.id;

    // Create initial sub-categories if provided
    const createdSubs: SubCategoryItem[] = [];
    if (catId && Array.isArray(payload.subCategories) && payload.subCategories.length > 0) {
      const subEndpoint =
        scope === "product"
          ? `/admin/product-categories/${catId}/sub-categories`
          : `/admin/blog-categories/${catId}/sub-categories`;

      for (let i = 0; i < payload.subCategories.length; i++) {
        const subName = payload.subCategories[i]?.trim();
        if (!subName) continue;
        try {
          const subRes = await apiClient.post<{ data: BackendSubCategoryItem }>(
            subEndpoint,
            { name: subName }
          );
          createdSubs.push({
            id: String(subRes.data?.data?.id ?? Date.now() + i),
            name: subName,
            orderNumber: i + 1,
          });
        } catch {
          createdSubs.push({
            id: `temp-${Date.now()}-${i}`,
            name: subName,
            orderNumber: i + 1,
          });
        }
      }
    }

    return {
      id: String(createdCat?.id ?? Date.now()),
      scope,
      title: createdCat?.name ?? payload.title,
      subCategories: createdSubs,
      createdAt: new Date().toISOString().split("T")[0],
    };
  },

  /**
   * Update a root category title or description.
   */
  async updateCategory(
    scope: CategoryScope,
    id: string | number,
    payload: { title?: string; description?: string }
  ): Promise<void> {
    const endpoint =
      scope === "product"
        ? `/admin/product-categories/${id}`
        : `/admin/blog-categories/${id}`;

    await apiClient.put(endpoint, {
      name: payload.title,
      description: payload.description,
    });
  },

  /**
   * Delete a root category (cascades to sub-categories on backend).
   */
  async deleteCategory(scope: CategoryScope, id: string | number): Promise<void> {
    const endpoint =
      scope === "product"
        ? `/admin/product-categories/${id}`
        : `/admin/blog-categories/${id}`;

    await apiClient.delete(endpoint);
  },

  /**
   * Create a sub-category under a parent category.
   */
  async createSubCategory(
    scope: CategoryScope,
    categoryId: string | number,
    name: string
  ): Promise<SubCategoryItem> {
    const endpoint =
      scope === "product"
        ? `/admin/product-categories/${categoryId}/sub-categories`
        : `/admin/blog-categories/${categoryId}/sub-categories`;

    const response = await apiClient.post<{ data: BackendSubCategoryItem }>(endpoint, {
      name,
    });

    const sub = response.data?.data;
    return {
      id: String(sub?.id ?? Date.now()),
      name: sub?.name ?? name,
    };
  },

  /**
   * Update an existing sub-category.
   */
  async updateSubCategory(
    scope: CategoryScope,
    subId: string | number,
    name: string
  ): Promise<void> {
    const endpoint =
      scope === "product"
        ? `/admin/product-sub-categories/${subId}`
        : `/admin/blog-sub-categories/${subId}`;

    await apiClient.put(endpoint, { name });
  },

  /**
   * Delete a sub-category.
   */
  async deleteSubCategory(
    scope: CategoryScope,
    subId: string | number
  ): Promise<void> {
    const endpoint =
      scope === "product"
        ? `/admin/product-sub-categories/${subId}`
        : `/admin/blog-sub-categories/${subId}`;

    await apiClient.delete(endpoint);
  },
};

