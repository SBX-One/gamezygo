import * as React from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchUserGameLibrary,
  fetchGameCredentials,
  type LibraryQueryParams,
} from "@/services/library.service";
import { useAuthStore } from "@/stores/use-auth-store";

export const LIBRARY_KEYS = {
  all: ["library"] as const,
  list: (params?: LibraryQueryParams) => [...LIBRARY_KEYS.all, "list", params] as const,
  infinite: (params?: Omit<LibraryQueryParams, "page">) =>
    [...LIBRARY_KEYS.all, "infinite", params] as const,
  credentials: (slug: string) => [...LIBRARY_KEYS.all, "credentials", slug] as const,
};

/**
 * Hook to fetch user's purchased game library
 */
export function useUserLibrary(
  params?: LibraryQueryParams,
  options?: { enabled?: boolean }
) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: LIBRARY_KEYS.list(params),
    queryFn: () => fetchUserGameLibrary(params),
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Hook to fetch user's purchased game library with infinite scroll
 */
export function useInfiniteUserLibrary(
  params?: Omit<LibraryQueryParams, "page">,
  options?: { enabled?: boolean }
) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useInfiniteQuery({
    queryKey: LIBRARY_KEYS.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      fetchUserGameLibrary({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage?.meta?.current_page ?? 1;
      const last = lastPage?.meta?.last_page ?? 1;
      return current < last ? current + 1 : undefined;
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
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

/**
 * Hook to check if a specific game is already owned in user's library
 */
export function useOwnedGames() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: libraryRes } = useUserLibrary(undefined, { enabled: isAuthenticated });

  const ownedGames = React.useMemo(() => {
    return libraryRes?.data || [];
  }, [libraryRes]);

  const isGameOwned = React.useCallback(
    (productId?: string | number, title?: string, slug?: string): boolean => {
      if (!isAuthenticated || !ownedGames || ownedGames.length === 0) return false;
      const strId = String(productId || "");
      const cleanTitle = title?.trim().toLowerCase();
      const cleanSlug = slug?.trim().toLowerCase();

      return ownedGames.some((item) => {
        if (strId && String(item.id) === strId) return true;
        if (cleanTitle && item.name?.trim().toLowerCase() === cleanTitle) return true;
        if (cleanSlug && item.slug?.trim().toLowerCase() === cleanSlug) return true;
        return false;
      });
    },
    [isAuthenticated, ownedGames]
  );

  return {
    ownedGames,
    isGameOwned,
    hasOwnedGames: ownedGames.length > 0,
  };
}
