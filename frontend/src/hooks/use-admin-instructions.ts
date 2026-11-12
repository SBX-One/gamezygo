import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminInstructionService,
  type AdminInstructionQueryParams,
} from "@/services/admin-instruction.service";

export const ADMIN_INSTRUCTION_KEYS = {
  all: ["admin", "instructions"] as const,
  list: (params?: AdminInstructionQueryParams) =>
    [...ADMIN_INSTRUCTION_KEYS.all, "list", params] as const,
  detail: (id: string | number) =>
    [...ADMIN_INSTRUCTION_KEYS.all, "detail", String(id)] as const,
};

export function useAdminInstructions(params?: AdminInstructionQueryParams) {
  return useQuery({
    queryKey: ADMIN_INSTRUCTION_KEYS.list(params),
    queryFn: () => adminInstructionService.getInstructions(params),
    staleTime: 30 * 1000,
  });
}

export function useAdminInstructionDetail(id?: string | number | null) {
  return useQuery({
    queryKey: ADMIN_INSTRUCTION_KEYS.detail(id ?? ""),
    queryFn: () => adminInstructionService.getInstructionDetail(id!),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateAdminInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminInstructionService.createInstruction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_INSTRUCTION_KEYS.all });
    },
  });
}

export function useUpdateAdminInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: { title?: string; content?: string };
    }) => adminInstructionService.updateInstruction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_INSTRUCTION_KEYS.all });
    },
  });
}

export function useDeleteAdminInstruction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => adminInstructionService.deleteInstruction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_INSTRUCTION_KEYS.all });
    },
  });
}

