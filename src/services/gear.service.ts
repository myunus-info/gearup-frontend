import type { GearFilterParams } from '@/types/types';
import { request } from '../lib/request';

export const gearService = {
  listGears: (filters: GearFilterParams = {}) => {
    const query = new URLSearchParams();

    if (filters.category) query.set('category', filters.category);
    if (filters.brand) query.set('brand', filters.brand);
    if (filters.price !== undefined) query.set('price', String(filters.price));
    if (filters.search) query.set('search', filters.search);
    if (filters.condition) query.set('condition', filters.condition);
    if (filters.sortBy) query.set('sortBy', filters.sortBy);
    if (filters.sortOrder) query.set('sortOrder', filters.sortOrder);
    if (filters.page !== undefined) query.set('page', String(filters.page));
    if (filters.limit !== undefined) query.set('limit', String(filters.limit));

    const queryString = query.toString();

    return request(`/gears${queryString ? `?${queryString}` : ''}`, { requiresAuth: false });
  },

  getGearById: (id: string) => {
    return request(`/gears/${id}`, { requiresAuth: false });
  },
  getGearCategories: () => {
    return request('/categories', { requiresAuth: false });
  },
};
