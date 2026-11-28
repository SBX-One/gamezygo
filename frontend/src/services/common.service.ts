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
 * Endpoint: GET /api/v1/faqs?page=home|subscription
 */
export async function fetchFaqs(page?: string): Promise<ApiResponse<FaqItem[]>> {
  const qs = page ? `?page=${encodeURIComponent(page)}` : "";
  return apiGet<ApiResponse<FaqItem[]>>(`/faqs${qs}`);
}

export interface FetchCommunitiesParams {
  search?: string;
  tag?: string;
  tag_id?: number | string;
  tag_ids?: Array<number | string>;
  sort_by?: string;
  per_page?: number;
  page?: number;
}

/**
 * Fetch active community groups for public landing section
 * Primary Endpoint: GET /api/v1/communities
 */
export async function fetchCommunities(
  params?: FetchCommunitiesParams
): Promise<ApiResponse<CommunityItem[]>> {
  let queryString = "";
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(`${key}[]`, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      queryString = `?${qs}`;
    }
  }
  return apiGet<ApiResponse<CommunityItem[]>>(`/communities${queryString}`);
}
