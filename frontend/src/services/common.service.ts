import { apiGet } from "@/lib/api-client";
import type { ApiResponse, AnnouncementItem, FaqItem } from "@/types";

/**
 * Fetch announcement banners for hero carousel
 * Endpoint: GET /api/v1/user/announcements/
 */
export async function fetchAnnouncements(): Promise<
  ApiResponse<AnnouncementItem[]>
> {
  return apiGet<ApiResponse<AnnouncementItem[]>>("/user/announcements/");
}

/**
 * Fetch frequently asked questions
 * Endpoint: GET /api/v1/user/faq/
 */
export async function fetchFaqs(): Promise<ApiResponse<FaqItem[]>> {
  return apiGet<ApiResponse<FaqItem[]>>("/user/faq/");
}
