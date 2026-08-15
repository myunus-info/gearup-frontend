import { GearFilterParams, GearItem } from '@/lib/types';
import { request } from './request';

export async function getAllGears(filters: GearFilterParams = {}) {
  const query = new URLSearchParams();
  if (filters.category) query.append('category', filters.category);
  if (filters.brand) query.append('brand', filters.brand);
  if (filters.price) query.append('price', filters.price);
  if (filters.search) query.append('search', filters.search);

  return request<GearItem[]>(`/gears?${query.toString()}`);
}

export async function getGearById(id: string) {
  return request<GearItem>(`/gears/${id}`);
}
