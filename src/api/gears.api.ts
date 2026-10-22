import apiClient from '@/lib/apiClient';
import type { GearItem, IApiResponse, IQueryGearParams } from '@/types';

export function getGears(params?: IQueryGearParams) {
  const query: Record<string, any> = {};
  const cat = params?.category || params?.categoryId;
  if (cat && cat !== 'all' && cat !== 'ALL') {
    query.category = cat;
  }
  if (params?.brand && params.brand !== 'All Brands') {
    query.brand = params.brand;
  }
  if (params?.condition && (params.condition as string) !== 'ALL' && params.condition !== 'all') {
    query.condition = params.condition;
  }
  if (params?.search) query.search = params.search;
  if (params?.sortBy && ['createdAt', 'name', 'pricePerDay'].includes(params.sortBy)) {
    query.sortBy = params.sortBy;
  }
  if (params?.sortOrder && ['asc', 'desc'].includes(params.sortOrder.toLowerCase())) {
    query.sortOrder = params.sortOrder.toLowerCase();
  }
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  return apiClient<IApiResponse<GearItem[]>>('/gears', {
    query,
  });
}

export function getGearById(id: string) {
  return apiClient<IApiResponse<GearItem>>(`/gears/${id}`);
}
