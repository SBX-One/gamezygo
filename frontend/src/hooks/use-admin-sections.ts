import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSectionService } from "@/services/admin-section.service";
import type { ProductSection } from "@/features/admin/types/admin-section.types";

export const ADMIN_SECTION_KEYS = {
  all: ["admin-sections"] as const,
  list: () => [...ADMIN_SECTION_KEYS.all, "list"] as const,
};

export function useAdminSections() {
  return useQuery({
    queryKey: ADMIN_SECTION_KEYS.list(),
    queryFn: () => adminSectionService.getSections(),
    staleTime: 30 * 1000,
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: string | number; data: { title?: string; display_type?: string } }) =>
      adminSectionService.updateSection(sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SECTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useReorderSections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionIds: Array<string | number>) =>
      adminSectionService.reorderSections(sectionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SECTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useAddGamesToSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, productIds }: { sectionId: string | number; productIds: Array<string | number> }) =>
      adminSectionService.addGamesToSection(sectionId, productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SECTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useRemoveGameFromSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, productId }: { sectionId: string | number; productId: string | number }) =>
      adminSectionService.removeGameFromSection(sectionId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SECTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useClearSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string | number) =>
      adminSectionService.clearSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SECTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => adminSectionService.createSection(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SECTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string | number) => adminSectionService.deleteSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SECTION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["custom-sections"] });
    },
  });
}

