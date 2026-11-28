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
  pc_requirements?: {
    minimum?: string;
    recommended?: string;
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
  return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/hero_capsule.jpg`;
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

export interface ParsedSystemRequirements {
  os: string;
  cpu: string;
  ram: string;
  gpu: string;
  directx: string;
  storage: string;
  soundCard?: string;
  network?: string;
  notes?: string;
}

/**
 * Parses Steam Store API raw HTML pc_requirements strings (minimum & recommended)
 * into clean structured specifications for display cards (supports English & Indonesian labels).
 */
export function parseSteamRequirements(
  htmlString?: string,
  fallback?: Partial<ParsedSystemRequirements>
): ParsedSystemRequirements {
  const result: ParsedSystemRequirements = {
    os: fallback?.os || "Windows 10 (64-bit)",
    cpu: fallback?.cpu || "Intel Core i5-2500K / AMD FX-6300",
    ram: fallback?.ram || "8 GB RAM",
    gpu: fallback?.gpu || "NVIDIA GeForce GTX 660 / AMD Radeon HD 7870",
    directx: fallback?.directx || "Versi 11",
    storage: fallback?.storage || "30 GB Available Space",
    soundCard: fallback?.soundCard || "DX Compatible",
    network: fallback?.network,
    notes: fallback?.notes,
  };

  if (!htmlString || typeof htmlString !== "string") return result;

  // Normalize HTML line breaks and tags
  const clean = htmlString
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

  const lines = clean
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/^(os|sistem operasi)\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^(os|sistem operasi)\s*\*?\s*:\s*/i, "").trim();
      if (val) result.os = val;
    } else if (/^(processor|prosesor|cpu)\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^(processor|prosesor|cpu)\s*\*?\s*:\s*/i, "").trim();
      if (val) result.cpu = val;
    } else if (/^(memory|memori|ram)\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^(memory|memori|ram)\s*\*?\s*:\s*/i, "").trim();
      if (val) result.ram = val;
    } else if (/^(graphics|grafis|gpu|video card|kartu grafis)\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^(graphics|grafis|gpu|video card|kartu grafis)\s*\*?\s*:\s*/i, "").trim();
      if (val) result.gpu = val;
    } else if (/^directx\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^directx\s*\*?\s*:\s*/i, "").trim();
      if (val) result.directx = val;
    } else if (/^(storage|penyimpanan|hard drive|ruang penyimpanan)\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^(storage|penyimpanan|hard drive|ruang penyimpanan)\s*\*?\s*:\s*/i, "").trim();
      if (val) result.storage = val;
    } else if (/^(sound card|kartu suara)\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^(sound card|kartu suara)\s*\*?\s*:\s*/i, "").trim();
      if (val) result.soundCard = val;
    } else if (/^(network|jaringan)\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^(network|jaringan)\s*\*?\s*:\s*/i, "").trim();
      if (val) result.network = val;
    } else if (/^(additional notes|catatan tambahan)\s*\*?\s*:/i.test(line)) {
      const val = line.replace(/^(additional notes|catatan tambahan)\s*\*?\s*:\s*/i, "").trim();
      if (val) result.notes = val;
    } else if (lower.includes("os:")) {
      const val = line.split(/os:/i)[1]?.trim();
      if (val) result.os = val;
    }
  }

  return result;
}
