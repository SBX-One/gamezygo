import type { AdminArticle } from "../types/admin-article.types";

/**
 * Mock data exactly reflecting the 9 cards from the design screenshots:
 * Card 1: Promo Musim Panas (Published at 22/06/2026, 180 views)
 * Card 2: Marvel Tokon Fighting Souls (Published at 22/06/2026, 180 views)
 * Card 3: Promo Musim Panas (Published at 22/06/2026, 180 views)
 * Card 4: Balatro (Unpublish, 180 views)
 * Card 5: Marvel Cyclops / X-Men (Unpublish, 180 views)
 * Card 6: Promo Musim Panas (Published at 22/06/2026, 180 views)
 * Card 7: Promo Musim Panas (Draft, 180 views)
 * Card 8: Marvel Tokon Fighting Souls (Draft, 180 views)
 * Card 9: Sci-Fi Space Cockpit (Draft, 180 views)
 */
export const MOCK_ADMIN_ARTICLES: AdminArticle[] = [
  {
    id: "art-1",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "22/06/2026",
    lastEdited: "7 days ago",
    views: 180,
    category: "Promo",
  },
  {
    id: "art-2",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "22/06/2026",
    lastEdited: "7 days ago",
    views: 180,
    category: "Action",
  },
  {
    id: "art-3",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "22/06/2026",
    lastEdited: "7 days ago",
    views: 180,
    category: "Promo",
  },
  {
    id: "art-4",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
    status: "unpublished",
    publishedAt: "15/05/2026",
    lastEdited: "7 days ago",
    views: 180,
    category: "Card Game",
  },
  {
    id: "art-5",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    status: "unpublished",
    publishedAt: "10/05/2026",
    lastEdited: "7 days ago",
    views: 180,
    category: "Comics",
  },
  {
    id: "art-6",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    publishedAt: "22/06/2026",
    lastEdited: "7 days ago",
    views: 180,
    category: "Promo",
  },
  {
    id: "art-7",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "draft",
    lastEdited: "7 days ago",
    views: 180,
    category: "Draft",
  },
  {
    id: "art-8",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&q=80",
    status: "draft",
    lastEdited: "7 days ago",
    views: 180,
    category: "Draft",
  },
  {
    id: "art-9",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    coverImage:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    status: "draft",
    lastEdited: "7 days ago",
    views: 180,
    category: "Sci-Fi",
  },
];
