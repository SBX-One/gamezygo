/**
 * Gamezygo API Data Models & Contract Definitions
 * Mapped directly from Backend Mock API (Postman Collection v1)
 */

// ============================================================================
// 1. GENERIC API ENVELOPE RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

// ============================================================================
// 2. PRODUCTS & CATEGORIES
// ============================================================================

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductLauncherCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductSpecification {
  id: number;
  label: string;
  requirement: string;
  type: "minimum" | "recommended";
}

export interface ProductInstruction {
  id: number;
  title: string;
  content: string; // Markdown formatted
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  discount_price: number;
  discount: number;
  categories: ProductCategory[];
}

export interface ProductDetailItem {
  id: number;
  name: string;
  description: string;
  price: number;
  price_discount: number;
  discount: number;
  thumbnail?: string;
  steam_url: string;
  status: string;
  rating: number;
  categories?: ProductCategory[];
  product_genre_categories?: ProductCategory[];
  launcher_category?: ProductLauncherCategory;
  product_launcher_category?: ProductLauncherCategory;
  specification_requirements?: ProductSpecification[];
  product_specification_requirements?: ProductSpecification[];
  product_instruction?: ProductInstruction;
}

export interface ProductFilterCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductFilterLauncher {
  id: number;
  name: string;
  slug: string;
}

export interface ProductFilterStatus {
  label: string;
  value: boolean;
}

export interface ProductFilterPriceRange {
  min: number;
  max: number;
}

export interface ProductFilterSortOption {
  label: string;
  value: string;
}

export interface ProductFiltersData {
  categories: ProductFilterCategory[];
  launcher: ProductFilterLauncher[];
  statuses: ProductFilterStatus[];
  price_range: ProductFilterPriceRange;
  sort_options: ProductFilterSortOption[];
}

export interface GameCredentialsItem {
  id: number;
  username: string;
  password: string;
}

// ============================================================================
// 3. CUSTOM SECTIONS (Landing Promo Sections)
// ============================================================================

export interface CustomSectionProductItem extends ProductListItem {
  sort_order?: number;
}

export interface CustomSectionItem {
  id: number;
  title: string;
  slug: string;
  display_type: "manual" | "auto" | string;
  auto_rule: string | null;
  order_number: number;
  is_active: boolean;
  total_products?: number;
  custom_section_products: CustomSectionProductItem[];
}

// ============================================================================
// 4. SUBSCRIPTION PLANS & USER SUBSCRIPTIONS
// ============================================================================

export interface SubscriptionPlanFeature {
  id: number;
  feature: string;
  order_number: number;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration?: number;
  duration_days?: number;
  max_concurrent_access?: number;
  is_active: boolean;
  subscription_plan_features: SubscriptionPlanFeature[];
}

export interface UserActiveSubscription {
  id: number;
  subscription_plan_id: number;
  order_item_id: number;
  status: "active" | "expired" | string;
  started_at: string;
  expires_at: string;
  subscription_plan: SubscriptionPlan;
}

export interface SubscriptionProductItem {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  price_discount: number;
  discount: number;
  rating: number;
  product_genre_categories: ProductCategory[];
  product_launcher_category: ProductLauncherCategory;
}

// ============================================================================
// 5. BLOGS / ARTIKEL
// ============================================================================

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
}

export interface BlogListItem {
  id: number;
  banner_file_url: string;
  title: string;
  slug: string;
  sort_description: string;
  status: string;
  published_at: string;
  meta_title?: string;
  meta_desc?: string;
  category: BlogCategory;
}

export interface BlogDetailItem {
  id: number;
  banner_file_url: string;
  title: string;
  slug: string;
  sort_description: string;
  content: string; // Markdown formatted
  status: string;
  published_at: string;
  category: BlogCategory;
  author: BlogAuthor;
}

// ============================================================================
// 6. REVIEWS & TESTIMONIALS
// ============================================================================

export interface ReviewUser {
  name: string;
  avatar_url?: string;
}

export interface ReviewImage {
  id?: number;
  file_url?: string;
  url?: string;
}

export interface ReviewItem {
  id: number;
  user?: ReviewUser;
  review: string;
  rating: number;
  status: "approved" | "pending" | "rejected" | string;
  images: ReviewImage[];
  product_id?: number;
  order_item_id?: number;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// 7. LEADERBOARD
// ============================================================================

export interface LeaderboardItem {
  rank: number;
  id: number;
  name: string;
  point: number;

}

export interface UserLeaderboardRank {
  rank: number;
  point: number;
  rankings?: {
    weekly?: number;
    monthly?: number;
    all_time?: number;
  };
}

// ============================================================================
// 8. FAQ & ANNOUNCEMENTS
// ============================================================================

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
}

export interface AnnouncementItem {
  id: number;
  banner_file_url: string;
  link: string;
  is_publish: boolean;
  order_number: number;
}

// ============================================================================
// 9. CART
// ============================================================================

export interface CartProductItem {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  discount_price: number;
  discount: number;
}

export interface CartResponse {
  total_prices: number;
  items: CartProductItem[];
}

export interface AddToCartResponse {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  discount_price: number;
  discount: number;
  quantity: number;
}

// ============================================================================
// 10. ORDERS & PAYMENTS
// ============================================================================

export interface OrderItemProduct {
  id: number;
  name: string;
  thumbnail: string;
}

export interface OrderItem {
  id: number;
  item_type: "product" | string;
  product: OrderItemProduct;
  price: number;
}

export interface OrderResponse {
  id: number;
  order_number: string;
  status: "pending" | "paid" | "expired" | "cancelled" | string;
  subtotal_price: number;
  discount_amount: number;
  total_price: number;
  expires_at: string;
}

export interface OrderDetailResponse extends OrderResponse {
  order_items: OrderItem[];
  payment: PaymentResponse | null;
}

export interface VoucherApplyResponse {
  order_number: string;
  voucher_id: number | null;
  subtotal_price: number;
  discount_amount: number;
  total_price: number;
}

export interface PaymentResponse {
  id: number;
  order_id: number;
  payment_method: string;
  gateway_reference: string;
  amount: number;
  status: "pending" | "paid" | "expired" | string;
  expired_at: string;
}

// ============================================================================
// 11. GAME REQUESTS
// ============================================================================

export interface GameRequestItem {
  id: number;
  name: string;
  steam_url: string;
  request_count?: number;
  status: "pending" | "approved" | "rejected" | string;
  note: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 12. WISHLIST
// ============================================================================

export interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  price_discount: number;
  discount: number;
  rating?: number;
}

export interface WishlistItem {
  id: number;
  product: WishlistProduct;
  created_at: string;
}

// ============================================================================
// 13. USER PROFILE
// ============================================================================

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  role?: "customer" | "admin" | string;
  joined_date?: string;
  phone?: string | null;
  total_transactions?: number;
  total_points?: number;
  total_games?: number;
  total_games_owned?: number;
  rankings?: {
    weekly?: number;
    monthly?: number;
    all_time?: number;
  };
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface AuthLoginPayload {
  email: string;
  password?: string;
}

export interface AuthRegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponseData {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  user?: UserProfileResponse;
}

interface _Unused {
  _unused?: never;
}
