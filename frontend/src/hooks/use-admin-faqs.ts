import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFaqService, type AdminFaqQueryParams } from "@/services/admin-faq.service";

export const ADMIN_FAQ_KEYS = {
  all: ["admin", "faqs"] as const,
  list: (params?: AdminFaqQueryParams) => [...ADMIN_FAQ_KEYS.all, "list", params] as const,
  pages: () => [...ADMIN_FAQ_KEYS.all, "pages"] as const,
};

export function useAdminFaqs(params?: AdminFaqQueryParams) {
  return useQuery({
    queryKey: ADMIN_FAQ_KEYS.list(params),
    queryFn: () => adminFaqService.getFaqs(params),
    staleTime: 30 * 1000,
  });
}

export function useAdminFaqPages() {
  return useQuery({
    queryKey: ADMIN_FAQ_KEYS.pages(),
    queryFn: () => adminFaqService.getPages(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAdminFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminFaqService.createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FAQ_KEYS.all });
    },
  });
}

export function useUpdateAdminFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Parameters<typeof adminFaqService.updateFaq>[1];
    }) => adminFaqService.updateFaq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FAQ_KEYS.all });
    },
  });
}

export function useDeleteAdminFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => adminFaqService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FAQ_KEYS.all });
    },
  });
}

