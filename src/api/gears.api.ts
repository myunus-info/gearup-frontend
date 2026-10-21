import apiClient from '@/lib/apiClient';
import type { GearItem, IApiResponse, IQueryGearParams } from '@/types';

export function getGears(params?: IQueryGearParams) {
  const query: Record<string, any> = {};
  if (params?.categoryId && params.categoryId !== 'ALL') query.categoryId = params.categoryId;
  if (params?.condition && (params.condition as string) !== 'ALL')
    query.condition = params.condition;
  if (params?.minPrice !== undefined && params.minPrice > 0) query.minPrice = params.minPrice;
  if (params?.maxPrice !== undefined && params.maxPrice > 0) query.maxPrice = params.maxPrice;
  if (params?.search) query.search = params.search;
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  return apiClient<IApiResponse<GearItem[]>>('/gears', {
    query,
  });
}

export function getGearById(id: string) {
  return apiClient<IApiResponse<GearItem>>(`/gears/${id}`);
}
