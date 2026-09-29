export type UserRole = 'buyer' | 'seller' | 'admin' | 'support';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: string;
  email_verified_at?: string | null;
  seller_profile?: SellerProfile | null;
}

export interface SellerProfile {
  id: number;
  user_id: number;
  business_name: string;
  slug: string;
  bio?: string | null;
  craft_description?: string | null;
  location_city: string;
  location_region: string;
  verification_status: 'basic' | 'verified' | 'established' | 'pending' | 'rejected';
  seller_status: 'active' | 'paused' | 'suspended';
  rating_average: number;
  rating_count: number;
  completed_orders: number;
  total_sales: number;
  avatar_url?: string | null;
  cover_url?: string | null;
  social_links?: Record<string, string> | null;
  user?: User;
  products?: Product[];
  reviews?: Review[];
  is_seeded?: boolean;
  new_seller_boost_started_at?: string | null;
  new_seller_boost_ends_at?: string | null;
  response_time_minutes?: number;
  on_time_delivery_rate?: number;
  cancellation_rate?: number;
  discovery_boost?: DiscoveryBoostStatus;
}

export interface DiscoveryBoostStatus {
  is_boosted: boolean;
  boost_score: number;
  boost_percent: number;
  current_boost_percent: number;
  is_consistent: boolean;
  remaining_days: number;
  duration_days: number;
  started_at?: string | null;
  ends_at?: string | null;
  metrics?: {
    has_in_stock: boolean;
    cancellation_rate: number;
    cancellation_ok: boolean;
    on_time_delivery_rate: number;
    delivery_ok: boolean;
  };
}

export interface Category {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  icon?: string | null;
  image_url?: string | null;
  status: string;
  sort_order: number;
  children?: Category[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku?: string | null;
  name: string;
  price: number;
  stock_quantity: number;
  attributes_json?: Record<string, any> | null;
}

export interface CustomizationOption {
  id: number;
  product_id: number;
  name: string;
  type: 'text' | 'select' | 'color';
  options_json?: string[] | null;
  price_delta: number;
  is_required: boolean;
}

export interface Product {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  compare_at_price?: number | null;
  status: 'draft' | 'pending_review' | 'published' | 'paused' | 'archived';
  stock_quantity: number;
  production_days: number;
  is_customizable: boolean;
  materials?: string | null;
  dimensions?: string | null;
  care_instructions?: string | null;
  weight_grams?: number | null;
  rating_average: number;
  rating_count: number;
  is_featured: boolean;
  is_seeded?: boolean;
  ranking_score?: number;
  impressions_count?: number;
  clicks_count?: number;
  wishlist_count?: number;
  sales_count?: number;
  _ranking_score?: number;
  _ranking_signals?: Record<string, number>;
  created_at?: string;
  seller: SellerProfile;
  category?: Category;
  primary_image?: ProductImage;
  images?: ProductImage[];
  variants?: ProductVariant[];
  customization_options?: CustomizationOption[];
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  customization?: Record<string, string> | null;
  unit_price: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  seller_id: number;
  product_id?: number | null;
  variant_id?: number | null;
  product_title: string;
  product_image?: string | null;
  product_snapshot_json: Record<string, any>;
  customization_json?: Record<string, string> | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  status: 'pending' | 'accepted' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  seller?: SellerProfile;
  product?: Product;
  is_seeded?: boolean;
}

export interface Order {
  id: number;
  order_number: string;
  buyer_id: number;
  status: 'pending_payment' | 'paid' | 'confirmed' | 'processing' | 'ready_to_ship' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  shipping_address_snapshot: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state_province?: string;
    postal_code?: string;
    country?: string;
  };
  shipping_method: 'standard' | 'express';
  payment_method: 'cod' | 'jazzcash_easypaisa' | 'card' | 'bank_transfer';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string | null;
  placed_at: string;
  delivered_at?: string | null;
  created_at: string;
  items?: OrderItem[];
  buyer?: User;
  is_seeded?: boolean;
}

export interface Review {
  id: number;
  order_id?: number | null;
  buyer_id: number;
  seller_id: number;
  product_id: number;
  rating: number;
  comment: string;
  status: string;
  seller_response?: string | null;
  buyer?: User;
  created_at?: string;
  is_seeded?: boolean;
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state_province?: string | null;
  postal_code?: string | null;
  country: string;
  is_default: boolean;
}
