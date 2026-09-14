import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncements, fetchFaqs } from "@/services/common.service";

export const COMMON_KEYS = {
  announcements: ["announcements"] as const,
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
 * Hook to fetch FAQ items
 */
export function useFaqs() {
  return useQuery({
    queryKey: COMMON_KEYS.faqs,
    queryFn: () => fetchFaqs(),
  });
}
