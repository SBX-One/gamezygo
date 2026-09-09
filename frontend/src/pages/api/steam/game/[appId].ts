import type { NextApiRequest, NextApiResponse } from "next";

interface SteamPriceOverview {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted?: string;
  final_formatted: string;
}

interface SteamScreenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

interface SteamMovie {
  id: number;
  name: string;
  thumbnail: string;
  mp4?: { [resolution: string]: string };
  webm?: { [resolution: string]: string };
  highlight: boolean;
}

interface SteamAppDetailsResponse {
  [appId: string]: {
    success: boolean;
    data?: {
      name: string;
      header_image: string;
      background_raw?: string;
      short_description: string;
      is_free: boolean;
      price_overview?: SteamPriceOverview;
      screenshots?: SteamScreenshot[];
      movies?: SteamMovie[];
      genres?: Array<{ id: string; description: string }>;
      pc_requirements?:
        | {
            minimum?: string;
            recommended?: string;
          }
        | unknown[];
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { appId } = req.query;

  if (!appId || Array.isArray(appId) || isNaN(Number(appId))) {
    return res.status(400).json({ message: "Parameter appId harus berupa angka." });
  }

  const numericAppId = Number(appId);

  try {
    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${numericAppId}&cc=ID&l=indonesian`;
    const response = await fetch(steamUrl, {
      headers: {
        "Accept-Language": "id,en;q=0.9",
        "User-Agent": "Gamezygo/1.0",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ message: "Gagal berkomunikasi dengan Steam Store API" });
    }

    const json = (await response.json()) as SteamAppDetailsResponse;
    const appData = json[numericAppId.toString()];

    if (!appData || !appData.success || !appData.data) {
      return res.status(404).json({ message: "Game tidak ditemukan di Steam" });
    }

    const { data } = appData;

    // High resolution capsule image for vertical 3:4 product cards
    const libraryCapsuleUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${numericAppId}/library_600x900_2x.jpg`;

    const highlightTrailer = data.movies?.find((m) => m.highlight) || data.movies?.[0];

    const result = {
      app_id: numericAppId,
      name: data.name,
      banner: data.header_image,
      hero_capsule: libraryCapsuleUrl,
      background: data.background_raw || "",
      description: data.short_description || "",
      is_free: data.is_free,
      genres: data.genres?.map((g) => g.description) || ["Action"],
      price: data.price_overview
        ? {
            currency: data.price_overview.currency,
            initial: Math.round(data.price_overview.initial / 100),
            final: Math.round(data.price_overview.final / 100),
            discount_percent: data.price_overview.discount_percent,
            initial_formatted:
              data.price_overview.initial_formatted ||
              `Rp ${Math.round(data.price_overview.initial / 100).toLocaleString("id-ID")}`,
            formatted: data.price_overview.final_formatted,
          }
        : null,
      screenshots:
        data.screenshots?.map((s) => ({
          thumbnail: s.path_thumbnail,
          full: s.path_full,
        })) || [],
      trailer: highlightTrailer
        ? {
            thumbnail: highlightTrailer.thumbnail,
            mp4: highlightTrailer.mp4?.max || highlightTrailer.mp4?.["480"] || "",
            webm: highlightTrailer.webm?.max || highlightTrailer.webm?.["480"] || "",
          }
        : null,
      pc_requirements:
        data.pc_requirements && !Array.isArray(data.pc_requirements)
          ? {
              minimum: (data.pc_requirements as { minimum?: string }).minimum || "",
              recommended: (data.pc_requirements as { recommended?: string }).recommended || "",
            }
          : null,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error fetching Steam app ${numericAppId}:`, error);
    return res.status(500).json({ message: "Terjadi kesalahan internal saat mengambil data Steam" });
  }
}
