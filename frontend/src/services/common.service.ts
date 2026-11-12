import { apiGet } from "@/lib/api-client";
import type {
  ApiResponse,
  AnnouncementItem,
  CommunityItem,
  FaqItem,
} from "@/types";

/**
 * Fetch announcement banners for hero carousel
 * Endpoint: GET /api/v1/announcements
 */
export async function fetchAnnouncements(): Promise<
  ApiResponse<AnnouncementItem[]>
> {
  return apiGet<ApiResponse<AnnouncementItem[]>>("/announcements");
}

/**
 * Fetch frequently asked questions
 * Endpoint: GET /api/v1/faqs
 */
export async function fetchFaqs(): Promise<ApiResponse<FaqItem[]>> {
  return apiGet<ApiResponse<FaqItem[]>>("/faqs");
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
