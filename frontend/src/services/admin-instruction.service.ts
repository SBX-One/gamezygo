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
  status?: string | null;
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
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const text = b.content.replace(/<[^>]+>/g, "").trim();
    if (!text) continue;

    if (b.type.startsWith("h")) {
      const next = blocks[i + 1];
      const nextText = next ? next.content.replace(/<[^>]+>/g, "").trim() : "";
      if (next && !next.type.startsWith("h") && nextText) {
        steps.push({
          stepNumber: idx++,
          title: text,
          description: nextText,
        });
        i++;
        continue;
      }
      steps.push({
        stepNumber: idx++,
        title: text,
        description: "",
      });
      continue;
    }

    steps.push({
      stepNumber: idx++,
      title: "",
      description: text,
    });
  }
  if (steps.length === 0 && content.trim()) {
    steps.push({
      stepNumber: 1,
      title: "",
      description: content.replace(/<[^>]+>/g, "").trim(),
    });
  }
  return steps;
}

function mapInstructionRow(row: BackendInstructionRow): InstructionTemplate {
  const isExplicitDraft = String(row.status ?? "").toLowerCase() === "draft";
  return {
    id: String(row.id),
    title: String(row.title ?? "Untitled Instruction"),
    badge: isExplicitDraft ? "Draft" : "Listed",
    createdAt: formatDateLabel(row.created_at),
    lastEdit: row.last_edit ? `Last edit ${formatDateLabel(row.last_edit)}` : "Baru saja",
    steps: row.content ? parseInstructionContentToSteps(row.content, row.title) : [],
    content: row.content ?? undefined,
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

