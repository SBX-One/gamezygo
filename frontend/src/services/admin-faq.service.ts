import { apiClient } from "@/lib/api-client";
import type { AdminFaqItem } from "@/features/admin/types/admin-faq.types";

const PAGE_TO_CATEGORY: Record<string, string> = {
  home: "Landing Page",
  landing: "Landing Page",
  landing_page: "Landing Page",
  subscription: "Subscription",
  catalog: "Katalog Game",
  checkout: "Checkout",
  general: "General",
};

const CATEGORY_TO_PAGE: Record<string, string> = {
  "Landing Page": "home",
  Subscription: "subscription",
  "Katalog Game": "catalog",
  Checkout: "checkout",
  General: "general",
};

export function mapBackendPageToCategory(page?: string | null): string {
  const key = String(page ?? "general").trim().toLowerCase();
  return PAGE_TO_CATEGORY[key] ?? (page ? String(page) : "General");
}

export function mapCategoryToBackendPage(category?: string | null): string {
  if (!category) return "general";
  return CATEGORY_TO_PAGE[category] ?? category.trim().toLowerCase().replace(/\s+/g, "_");
}

function formatFaqLastEdit(iso?: string | null): string {
  if (!iso) return "Baru saja";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface BackendFaqRow {
  id: number | string;
  question?: string;
  answer?: string;
  page?: string;
  order_number?: number;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

function mapBackendFaqToItem(row: BackendFaqRow): AdminFaqItem {
  return {
    id: String(row.id),
    question: String(row.question ?? ""),
    answer: String(row.answer ?? ""),
    category: mapBackendPageToCategory(row.page),
    isActive: row.is_active !== false,
    orderNumber: Number(row.order_number ?? 0),
    isExpanded: true,
    lastEdit: formatFaqLastEdit(row.updated_at ?? row.created_at),
  };
}

export interface AdminFaqQueryParams {
  search?: string;
  page_name?: string;
  is_active?: boolean;
  sort_by?: "order_number" | "latest" | "oldest";
  page?: number;
  per_page?: number;
}

export interface AdminFaqListResult {
  totalFaqs: number;
  faqs: AdminFaqItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const adminFaqService = {
  async getFaqs(params?: AdminFaqQueryParams): Promise<AdminFaqListResult> {
    const response = await apiClient.get<{
      data?: {
        total_faqs?: number;
        faqs?: BackendFaqRow[];
        meta?: AdminFaqListResult["meta"];
      };
    }>("/admin/faqs", {
      params: {
        search: params?.search || undefined,
        page_name: params?.page_name || undefined,
        is_active: params?.is_active,
        sort_by: params?.sort_by || "order_number",
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 100,
      },
    });

    const data = response.data?.data;
    const rawFaqs = Array.isArray(data?.faqs) ? data.faqs : [];
    const faqs = rawFaqs.map(mapBackendFaqToItem);

    return {
      totalFaqs: Number(data?.total_faqs ?? faqs.length),
      faqs,
      meta: data?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: params?.per_page ?? 100,
        total: faqs.length,
      },
    };
  },

  async getPages(): Promise<string[]> {
    const response = await apiClient.get<{ data?: string[] }>("/admin/faqs/pages");
    const rawPages = Array.isArray(response.data?.data) ? response.data.data : [];
    const categories = rawPages.map((p) => mapBackendPageToCategory(p));
    const defaults = ["Landing Page", "Subscription", "Katalog Game", "Checkout"];
    return Array.from(new Set([...defaults, ...categories]));
  },

  async createFaq(payload: {
    question: string;
    answer: string;
    category: string;
    order_number?: number;
    is_active?: boolean;
  }): Promise<AdminFaqItem> {
    const response = await apiClient.post<{ data?: BackendFaqRow }>("/admin/faqs", {
      question: payload.question,
      answer: payload.answer,
      page: mapCategoryToBackendPage(payload.category),
      order_number: payload.order_number ?? 0,
      is_active: payload.is_active ?? true,
    });
    return mapBackendFaqToItem(response.data?.data ?? { id: Date.now(), ...payload });
  },

  async updateFaq(
    id: string | number,
    payload: {
      question?: string;
      answer?: string;
      category?: string;
      order_number?: number;
      is_active?: boolean;
    }
  ): Promise<AdminFaqItem> {
    const body: Record<string, unknown> = {};
    if (payload.question !== undefined) body.question = payload.question;
    if (payload.answer !== undefined) body.answer = payload.answer;
    if (payload.category !== undefined) body.page = mapCategoryToBackendPage(payload.category);
    if (payload.order_number !== undefined) body.order_number = payload.order_number;
    if (payload.is_active !== undefined) body.is_active = payload.is_active;

    const response = await apiClient.put<{ data?: BackendFaqRow }>(`/admin/faqs/${id}`, body);
    return mapBackendFaqToItem(response.data?.data ?? { id, ...payload });
  },

  async getFaqDetail(id: string | number): Promise<AdminFaqItem> {
    const response = await apiClient.get<{ data?: BackendFaqRow }>(
      `/admin/faqs/${id}`
    );
    return mapBackendFaqToItem(response.data?.data ?? { id });
  },

  async updateFaqStatus(
    id: string | number,
    isActive: boolean
  ): Promise<AdminFaqItem> {
    const response = await apiClient.patch<{ data?: BackendFaqRow }>(
      `/admin/faqs/${id}/status`,
      { is_active: isActive }
    );
    return mapBackendFaqToItem(
      response.data?.data ?? { id, is_active: isActive }
    );
  },

  async sortFaqs(
    orders: Array<{ id: number; order_number: number }>
  ): Promise<void> {
    await apiClient.post("/admin/faqs/sort", { orders });
  },

  async deleteFaq(id: string | number): Promise<void> {
    await apiClient.delete(`/admin/faqs/${id}`);
  },

  async batchDeleteFaqs(ids: Array<string | number>): Promise<void> {
    const numericIds = ids
      .map((id) => Number(id))
      .filter((n) => !Number.isNaN(n));
    await apiClient.delete("/admin/faqs", {
      data: { ids: numericIds },
    });
  },
};

