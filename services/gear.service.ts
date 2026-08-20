import { GearFilterParams } from '@/types/types';
import { request } from '../lib/request';

export const gearService = {
  listGears: (filters: GearFilterParams = {}) => {
    const query = new URLSearchParams();
    if (filters.category) query.append('category', filters.category);
    if (filters.brand) query.append('brand', filters.brand);
    if (filters.price) query.append('price', filters.price);
    if (filters.search) query.append('search', filters.search);

    return request(`/gears?${query.toString()}`, { requiresAuth: false });
  },
  getGearById: (id: string) => {
    return request(`/gears/${id}`, { requiresAuth: false });
  },
  getGearCategories: () => {
    return request('/categories', { requiresAuth: false });
  },
};
