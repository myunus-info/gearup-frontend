import { GearItem, RentalOrder, User, UserStatus } from '@/lib/types';
import { request } from './request';

export async function getUsers() {
  return request<User[]>('/admin/users');
}

export async function updateUserStatus(id: string, status: UserStatus) {
  return request<User>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getAllGear() {
  return request<GearItem[]>('/admin/gear');
}

export async function getAllRentals() {
  return request<RentalOrder[]>('/admin/rentals');
}
