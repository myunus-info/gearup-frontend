import apiClient from '@/lib/apiClient';
import type { GearItem, IApiResponse, RentalOrder, User, UserStatus } from '@/types';

export function getAdminUsers() {
  return apiClient<IApiResponse<User[]>>('/admin/users');
}

export function updateAdminUserStatus(id: string, status: UserStatus) {
  return apiClient<IApiResponse<User>>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: { status },
  });
}

export function getAdminGearListings() {
  return apiClient<IApiResponse<GearItem[]>>('/admin/gear');
}

export function getAdminRentalOrders() {
  return apiClient<IApiResponse<RentalOrder[]>>('/admin/rentals');
}
