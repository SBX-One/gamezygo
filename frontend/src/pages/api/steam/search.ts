import type { NextApiRequest, NextApiResponse } from "next";

interface SteamSearchItem {
  id: number;
  name: string;
  tiny_image: string;
}

interface SteamSearchResponse {
  total: number;
  items: SteamSearchItem[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { term } = req.query;

  if (!term || typeof term !== "string" || !term.trim()) {
    return res.status(422).json({
      message: "The term field is required.",
      errors: { term: ["The term field is required."] },
    });
  }

  try {
    const steamUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
      term
    )}&l=indonesian&cc=ID`;

    const response = await fetch(steamUrl, {
      headers: {
        "Accept-Language": "id,en;q=0.9",
        "User-Agent": "Gamezygo/1.0",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ message: "Gagal berkomunikasi dengan Steam Store API" });
    }

    const json = (await response.json()) as SteamSearchResponse;

    const items = (json.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      tiny_image: item.tiny_image,
      hero_capsule: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${item.id}/hero_capsule.jpg`,
    }));

    return res.status(200).json(items);
  } catch (error) {
    console.error("Error searching Steam games:", error);
    return res.status(500).json({ message: "Terjadi kesalahan internal saat mencari game Steam" });
  }
}
