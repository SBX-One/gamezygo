import type { AdminCategoryGroup } from "../types/admin-category.types";

export const MOCK_ADMIN_CATEGORIES: AdminCategoryGroup[] = [
  {
    id: "cat-art-1",
    scope: "article",
    title: "General",
    orderNumber: 1,
    subCategories: [
      { id: "sub-art-1", name: "News & Update", orderNumber: 1 },
      { id: "sub-art-2", name: "Game Guides", orderNumber: 2 },
      { id: "sub-art-3", name: "Review & Recommendations", orderNumber: 3 },
      { id: "sub-art-4", name: "Tutorials", orderNumber: 4 },
    ],
    createdAt: "2026-10-10",
  },
  {
    id: "cat-prod-1",
    scope: "product",
    title: "Genre",
    orderNumber: 1,
    subCategories: [
      { id: "sub-prod-1", name: "Action & Adventure", orderNumber: 1 },
      { id: "sub-prod-2", name: "RPG", orderNumber: 2 },
      { id: "sub-prod-3", name: "Sports & Racing", orderNumber: 3 },
      { id: "sub-prod-4", name: "Fighting", orderNumber: 4 },
    ],
    createdAt: "2026-10-10",
  },
];
