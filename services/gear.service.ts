import { Category, GearFilterParams, GearItem } from '@/types/types';
import { request } from '../lib/request';

export const gearService = {
  listGears: (filters: GearFilterParams = {}) => {
    const query = new URLSearchParams();
    if (filters.category) query.append('category', filters.category);
    if (filters.brand) query.append('brand', filters.brand);
    if (filters.price) query.append('price', filters.price);
    if (filters.search) query.append('search', filters.search);

    return request<GearItem[]>(`/gears?${query.toString()}`);
  },
  getGearById: (id: string) => {
    return request<GearItem>(`/gears/${id}`);
  },
  getGearCategories: () => {
    return request<Category[]>('/categories');
  },
};
