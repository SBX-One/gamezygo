export interface PreOrderItem {
  id: string;
  title: string;
  imageSrc: string;
  categories: string[];
  price: number;
  formattedPrice: string;
  releaseDate?: string;
  status: "pre-order" | "active" | "draft";
}
