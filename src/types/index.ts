import type { GearCondition, User } from './types';
export * from './types';

export interface IApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ILoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface IQueryGearParams {
  categoryId?: string;
  condition?: GearCondition;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'priceAsc' | 'priceDesc' | 'newest' | 'rating' | 'popular' | string;
  page?: number;
  limit?: number;
}
