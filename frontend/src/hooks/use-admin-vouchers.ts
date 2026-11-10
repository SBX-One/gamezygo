import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminVoucherService,
  type AdminVoucherQueryParams,
} from "@/services/admin-voucher.service";

export const ADMIN_VOUCHER_KEYS = {
  all: ["admin", "vouchers"] as const,
  list: (params?: AdminVoucherQueryParams) =>
    ["admin", "vouchers", "list", params] as const,
  detail: (id: string | number) =>
    ["admin", "vouchers", "detail", String(id)] as const,
  analytics: (codeOrId?: string | number) =>
    ["admin", "vouchers", "analytics", String(codeOrId || "")] as const,
};

export function useAdminVouchers(params?: AdminVoucherQueryParams) {
  return useQuery({
    queryKey: ADMIN_VOUCHER_KEYS.list(params),
    queryFn: () => adminVoucherService.getVouchers(params),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useAdminVoucherDetail(id: string | number | undefined) {
  return useQuery({
    queryKey: ADMIN_VOUCHER_KEYS.detail(id || ""),
    queryFn: () => adminVoucherService.getVoucher(id!),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof adminVoucherService.createVoucher>[0]) =>
      adminVoucherService.createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
    },
  });
}

export function useUpdateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Record<string, unknown>;
    }) => adminVoucherService.updateVoucher(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ADMIN_VOUCHER_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
    },
  });
}

export function useToggleVoucherStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string | number;
      isActive?: boolean;
    }) => adminVoucherService.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
    },
  });
}

export function useDeleteVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => adminVoucherService.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
    },
  });
}

export function useBatchDeleteVouchers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[] | number[]) =>
      adminVoucherService.batchDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_VOUCHER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
    },
  });
}

export function useVoucherAnalytics(params?: { code?: string; id?: string | number }) {
  return useQuery({
    queryKey: ADMIN_VOUCHER_KEYS.analytics(params?.id || params?.code),
    queryFn: () => adminVoucherService.getAnalytics(params),
    staleTime: 60 * 1000,
  });
}

