/**
 * Steam Store API Client Service
 * Provides helper methods to fetch game details, capsules, and search results
 * via the local Next.js proxy route /api/steam/game/[appId] & /api/steam/search
 */

export interface SteamGameDetails {
  app_id: number;
  name: string;
  banner: string;
  hero_capsule: string;
  background: string;
  description: string;
  is_free: boolean;
  genres: string[];
  price: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    formatted: string;
  } | null;
  screenshots: Array<{
    thumbnail: string;
    full: string;
  }>;
  trailer: {
    thumbnail: string;
    mp4: string;
    webm: string;
  } | null;
}

export interface SteamSearchResult {
  id: number;
  name: string;
  tiny_image: string;
  hero_capsule: string;
}

/**
 * Get high resolution Steam Library/Hero vertical capsule (600x900 / 3:4 aspect ratio)
 */
export function getSteamCapsuleUrl(appId: number | string): string {
  return `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`;
}

/**
 * Fetch game details from internal Steam proxy API
 */
export async function fetchSteamGame(appId: number): Promise<SteamGameDetails | null> {
  try {
    const res = await fetch(`/api/steam/game/${appId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch Steam game ${appId}:`, err);
    return null;
  }
}

/**
 * Search games via internal Steam proxy API
 */
export async function searchSteamGames(term: string): Promise<SteamSearchResult[]> {
  try {
    const res = await fetch(`/api/steam/search?term=${encodeURIComponent(term)}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to search Steam games:", err);
    return [];
  }
}
