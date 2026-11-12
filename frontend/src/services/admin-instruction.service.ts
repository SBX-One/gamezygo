import { apiClient } from "@/lib/api-client";
import { parseContentToArticleBlocks } from "@/features/admin/utils/article-content.utils";
import type {
  InstructionStep,
  InstructionTemplate,
} from "@/features/admin/types/admin-instruction.types";

interface BackendInstructionRow {
  id: number | string;
  title?: string;
  content?: string | null;
  is_used?: boolean;
  total_products?: number;
  created_at?: string | null;
  last_edit?: string | null;
}

function formatDateLabel(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function parseInstructionContentToSteps(
  content?: string | null,
  fallbackTitle = "Instruksi"
): InstructionStep[] {
  if (!content || !content.trim()) return [];
  const blocks = parseContentToArticleBlocks(content);
  const steps: InstructionStep[] = [];
  let idx = 1;
  for (const b of blocks) {
    const text = b.content.replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    steps.push({
      stepNumber: idx++,
      title: b.type.startsWith("h") ? text : `Langkah ${steps.length + 1}`,
      description: text,
    });
  }
  if (steps.length === 0 && content.trim()) {
    steps.push({
      stepNumber: 1,
      title: fallbackTitle,
      description: content.replace(/<[^>]+>/g, "").trim(),
    });
  }
  return steps;
}

function mapInstructionRow(row: BackendInstructionRow): InstructionTemplate {
  const isUsed = Boolean(row.is_used || (row.total_products ?? 0) > 0);
  return {
    id: String(row.id),
    title: String(row.title ?? "Untitled Instruction"),
    badge: isUsed ? "Listed" : "Draft",
    createdAt: formatDateLabel(row.created_at),
    lastEdit: row.last_edit ? `Last edit ${formatDateLabel(row.last_edit)}` : "Baru saja",
    steps: row.content ? parseInstructionContentToSteps(row.content, row.title) : [],
  };
}

export interface AdminInstructionQueryParams {
  search?: string;
  is_used?: boolean;
  sort_by?: "latest" | "oldest" | "most_used" | "title";
  page?: number;
  per_page?: number;
}

export interface AdminInstructionListResult {
  totalInstructions: number;
  instructions: InstructionTemplate[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const adminInstructionService = {
  async getInstructions(params?: AdminInstructionQueryParams): Promise<AdminInstructionListResult> {
    const response = await apiClient.get<{
      data?: {
        total_instructions?: number;
        instructions?: BackendInstructionRow[];
        meta?: AdminInstructionListResult["meta"];
      };
    }>("/admin/instructions", {
      params: {
        search: params?.search || undefined,
        is_used: params?.is_used,
        sort_by: params?.sort_by || "latest",
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 100,
      },
    });

    const data = response.data?.data;
    const rawList = Array.isArray(data?.instructions) ? data.instructions : [];
    const instructions = rawList.map(mapInstructionRow);

    return {
      totalInstructions: Number(data?.total_instructions ?? instructions.length),
      instructions,
      meta: data?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: params?.per_page ?? 100,
        total: instructions.length,
      },
    };
  },

  async getInstructionDetail(id: string | number): Promise<InstructionTemplate> {
    const response = await apiClient.get<{ data?: BackendInstructionRow }>(
      `/admin/instructions/${id}`
    );
    return mapInstructionRow(response.data?.data ?? { id });
  },

  async createInstruction(payload: {
    title: string;
    content: string;
  }): Promise<InstructionTemplate> {
    const response = await apiClient.post<{ data?: BackendInstructionRow }>(
      "/admin/instructions",
      payload
    );
    return mapInstructionRow(response.data?.data ?? { id: Date.now(), ...payload });
  },

  async updateInstruction(
    id: string | number,
    payload: { title?: string; content?: string }
  ): Promise<InstructionTemplate> {
    const response = await apiClient.put<{ data?: BackendInstructionRow }>(
      `/admin/instructions/${id}`,
      payload
    );
    return mapInstructionRow(response.data?.data ?? { id, ...payload });
  },

  async deleteInstruction(id: string | number): Promise<void> {
    await apiClient.delete(`/admin/instructions/${id}`);
  },
};

