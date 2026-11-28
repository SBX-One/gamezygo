import { useQuery } from "@tanstack/react-query";
import {
  fetchAnnouncements,
  fetchCommunities,
  fetchFaqs,
  type FetchCommunitiesParams,
} from "@/services/common.service";

export const COMMON_KEYS = {
  announcements: ["announcements"] as const,
  communities: ["communities"] as const,
  faqs: ["faqs"] as const,
};

/**
 * Hook to fetch hero announcement banners
 */
export function useAnnouncements() {
  return useQuery({
    queryKey: COMMON_KEYS.announcements,
    queryFn: () => fetchAnnouncements(),
  });
}

/**
 * Hook to fetch FAQ items scoped by page ("home" for Landing Page, "subscription" for Bundle)
 */
export function useFaqs(page?: string) {
  return useQuery({
    queryKey: page ? [...COMMON_KEYS.faqs, page] : COMMON_KEYS.faqs,
    queryFn: () => fetchFaqs(page),
  });
}

/**
 * Hook to fetch active public communities
 */
export function useCommunities(params?: FetchCommunitiesParams) {
  return useQuery({
    queryKey: params ? [...COMMON_KEYS.communities, params] : COMMON_KEYS.communities,
    queryFn: () => fetchCommunities(params),
    retry: false,
  });
}
