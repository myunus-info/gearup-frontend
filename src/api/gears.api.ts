import apiClient from '@/lib/apiClient';
import type { GearItem, IApiResponse, IQueryGearParams } from '@/types';

export function getGears(params?: IQueryGearParams) {
  const query: Record<string, any> = {};
  if (params?.category && params.category !== 'all' && params.category !== 'ALL') {
    query.category = params.category;
  }
  if (params?.categoryId && params.categoryId !== 'ALL' && params.categoryId !== 'all') {
    query.categoryId = params.categoryId;
  }
  if (params?.brand && params.brand !== 'All Brands') {
    query.brand = params.brand;
  }
  if (params?.condition && (params.condition as string) !== 'ALL' && params.condition !== 'all') {
    query.condition = params.condition;
  }
  if (params?.minPrice !== undefined && params.minPrice > 0) query.minPrice = params.minPrice;
  if (params?.maxPrice !== undefined && params.maxPrice > 0) query.maxPrice = params.maxPrice;
  if (params?.search) query.search = params.search;
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  return apiClient<IApiResponse<GearItem[]>>('/gears', {
    query,
  });
}

export function getGearById(id: string) {
  return apiClient<IApiResponse<GearItem>>(`/gears/${id}`);
}
