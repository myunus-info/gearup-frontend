import apiClient from '@/lib/apiClient';
import type { Category, IApiResponse } from '@/types';

export function getCategories() {
  return apiClient<IApiResponse<Category[]>>('/categories');
}

export function getCategoryById(id: string) {
  return apiClient<IApiResponse<Category>>(`/categories/${id}`);
}
