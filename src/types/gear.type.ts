import type { ProviderProfile } from './auth.type';

export type GearCondition = 'NEW' | 'GOOD' | 'FAIR' | 'WORN';

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
}

export type ICategory = Category;

export interface Review {
  id: string;
  customerId: string;
  gearItemId: string;
  rentalOrderId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  gearItem?: {
    id: string;
    name: string;
    images: string[];
  };
}

export type IReview = Review;

export interface GearItem {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  pricePerDay: number | string;
  depositAmount?: number | string | null;
  quantityTotal: number;
  quantityAvailable: number;
  condition?: GearCondition | null;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  provider?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    providerProfile?: ProviderProfile | null;
  };
  reviews?: Review[];
  avgRating?: number;
}

export type IGearItem = GearItem;

export interface GearFilterParams {
  search?: string;
  category?: string;
  categoryId?: string;
  brand?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export type IGearFilterParams = GearFilterParams;
export type IQueryGearParams = GearFilterParams;

export interface IGear {
  categoryId: string;
  name: string;
  description?: string;
  brand?: string;
  pricePerDay: number;
  depositAmount?: number;
  quantityTotal: number;
  condition?: GearCondition;
  images?: string[];
}

export type ICreateGearPayload = IGear;
