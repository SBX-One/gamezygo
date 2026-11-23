export type CategoryScope = "article" | "product";

export interface SubCategoryItem {
  id: string;
  name: string;
  orderNumber?: number;
}

export interface AdminCategoryGroup {
  id: string;
  scope: CategoryScope;
  title: string;
  orderNumber?: number;
  subCategories: SubCategoryItem[];
  createdAt?: string;
}
