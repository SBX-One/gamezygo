import { apiGet } from "@/lib/api-client";
import type { ApiResponse, AnnouncementItem, FaqItem } from "@/types";

/**
 * Fetch announcement banners for hero carousel
 * Primary Endpoint (Postman guest): GET /api/v1/announcements/
 * Fallback Endpoint: GET /api/v1/user/announcements/
 */
export async function fetchAnnouncements(): Promise<
  ApiResponse<AnnouncementItem[]>
> {
  try {
    return await apiGet<ApiResponse<AnnouncementItem[]>>("/announcements/");
  } catch {
    return apiGet<ApiResponse<AnnouncementItem[]>>("/user/announcements/");
  }
}

/**
 * Fetch frequently asked questions
 * Primary Endpoint: GET /api/v1/faqs/
 * Fallback Endpoint (Postman raw URL): GET /api/v1/user/faqs/
 */
export async function fetchFaqs(): Promise<ApiResponse<FaqItem[]>> {
  try {
    return await apiGet<ApiResponse<FaqItem[]>>("/faqs/");
  } catch {
    return apiGet<ApiResponse<FaqItem[]>>("/user/faqs/");
  }
}
