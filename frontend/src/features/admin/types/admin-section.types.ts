export interface SectionProduct {
  id: string;
  title: string;
  imageSrc: string;
  categories: string[];
  price?: number;
  originalPrice?: string;
  discount?: string;
}

export interface ProductSection {
  id: string;
  title: string;
  slug: string;
  products: SectionProduct[];
}
