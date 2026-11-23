export interface AdminCatalogItem {
  id: string;
  name: string;
  imageSrc: string;
  categories: string[];
  price: number;
  isActive: boolean;
  isPreOrder?: boolean;
  isDraft?: boolean;
  isUnlisted?: boolean;
  stockCount?: number;
  createdAt?: string;
}

export interface AdminCatalogFilterState {
  searchQuery: string;
  isPreOrder: boolean;
  isDraft: boolean;
  isUnlisted: boolean;
  categories: string[];
  statusActive: boolean | null;
  priceRange: [number, number];
  sortBy: "terbaru" | "name_asc";
}

export const INITIAL_CATALOG_FILTER_STATE: AdminCatalogFilterState = {
  searchQuery: "",
  isPreOrder: false,
  isDraft: false,
  isUnlisted: false,
  categories: [],
  statusActive: null,
  priceRange: [0, 200000],
  sortBy: "terbaru",
};
