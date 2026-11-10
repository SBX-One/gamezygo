import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminUserService,
  type AdminUserQueryParams,
} from "@/services/admin-user.service";
import type { UserStatus } from "@/features/admin/types/admin-user.types";

export const ADMIN_USER_KEYS = {
  all: ["admin", "users"] as const,
  list: (params?: AdminUserQueryParams) =>
    ["admin", "users", "list", params] as const,
  detail: (id: string | number) =>
    ["admin", "users", "detail", String(id)] as const,
};

export function useAdminUsers(params?: AdminUserQueryParams) {
  return useQuery({
    queryKey: ADMIN_USER_KEYS.list(params),
    queryFn: () => adminUserService.getUsers(params),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useAdminUserDetail(id: string | number | undefined) {
  return useQuery({
    queryKey: ADMIN_USER_KEYS.detail(id || ""),
    queryFn: () => adminUserService.getUser(id!),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string | number;
      status: UserStatus;
    }) => adminUserService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ADMIN_USER_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Record<string, unknown>;
    }) => adminUserService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ADMIN_USER_KEYS.detail(variables.id),
      });
    },
  });
}

export function useWipeUserSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => adminUserService.wipeSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_KEYS.detail(id) });
    },
  });
}

