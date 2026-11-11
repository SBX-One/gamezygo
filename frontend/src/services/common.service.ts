import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  AnnouncementItem,
  CommunityItem,
  FaqItem,
} from "@/types";

/**
 * Fetch announcement banners for hero carousel
 * Primary Endpoint (Postman guest): GET /api/v1/announcements/
 * Fallback Endpoint: GET /api/v1/user/announcements/
 */
export async function fetchAnnouncements(): Promise<
  ApiResponse<AnnouncementItem[]>
> {
  try {
    return await apiGet<ApiResponse<AnnouncementItem[]>>("/user/announcements");
  } catch {
    return apiGet<ApiResponse<AnnouncementItem[]>>("/announcements");
  }
}

/**
 * Fetch frequently asked questions
 * Primary Endpoint: GET /api/v1/user/faqs
 * Fallback Endpoint: GET /api/v1/faqs
 */
export async function fetchFaqs(): Promise<ApiResponse<FaqItem[]>> {
  try {
    return await apiGet<ApiResponse<FaqItem[]>>("/user/faqs");
  } catch {
    return apiGet<ApiResponse<FaqItem[]>>("/faqs");
  }
}

/**
 * Fetch active community groups for public landing section
 * Primary Endpoint: GET /api/v1/communities
 */
export async function fetchCommunities(): Promise<
  ApiResponse<CommunityItem[]>
> {
  return apiGet<ApiResponse<CommunityItem[]>>("/communities");
}
