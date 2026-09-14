import { useQuery } from "@tanstack/react-query";
import {
  fetchUserGameLibrary,
  fetchGameCredentials,
  type LibraryQueryParams,
} from "@/services/library.service";

export const LIBRARY_KEYS = {
  all: ["library"] as const,
  list: (params?: LibraryQueryParams) => [...LIBRARY_KEYS.all, "list", params] as const,
  credentials: (slug: string) => [...LIBRARY_KEYS.all, "credentials", slug] as const,
};

/**
 * Hook to fetch user's purchased game library
 */
export function useUserLibrary(params?: LibraryQueryParams) {
  return useQuery({
    queryKey: LIBRARY_KEYS.list(params),
    queryFn: () => fetchUserGameLibrary(params),
  });
}

/**
 * Hook to fetch credentials for a purchased game
 */
export function useGameCredentials(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: LIBRARY_KEYS.credentials(slug),
    queryFn: () => fetchGameCredentials(slug),
    enabled: Boolean(slug) && (options?.enabled ?? true),
    retry: false, // Don't retry on 403 Forbidden
  });
}
