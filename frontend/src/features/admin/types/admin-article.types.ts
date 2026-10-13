export type AdminArticleStatus = "published" | "draft" | "unpublished";

export interface AdminArticle {
  id: string;
  title: string;
  coverImage: string;
  status: AdminArticleStatus;
  publishedAt?: string;
  lastEdited: string;
  views: number;
  category?: string;
  excerpt?: string;
  content?: string;
  blocks?: ArticleEditorBlock[];
}

export type ArticleBlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "bullet-list"
  | "numbered-list"
  | "image"
  | "quote"
  | "divider"
  | "code"
  | "callout"
  | "table";

export interface ArticleEditorBlock {
  id: string;
  type: ArticleBlockType;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  tableData?: string[][];
  align?: "left" | "center" | "right";
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrike?: boolean;
}

export interface AdminArticleFilterState {
  searchQuery: string;
  isPublished: boolean;
  isDraft: boolean;
  isUnpublished: boolean;
  categories?: string[];
  priceRange?: [number, number];
  sortBy?: "terbaru" | "name_asc";
}

export const INITIAL_ARTICLE_FILTER_STATE: AdminArticleFilterState = {
  searchQuery: "",
  isPublished: false,
  isDraft: false,
  isUnpublished: false,
  categories: [],
  priceRange: [0, 200000],
  sortBy: "terbaru",
};
