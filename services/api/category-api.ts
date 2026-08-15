import { Category } from '@/lib/types';
import { request } from './request';

export async function getAllCategories() {
  return request<Category[]>('/categories');
}
