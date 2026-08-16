import { GearItem, RentalOrder, User, UserStatus } from '@/types/types';
import { request } from '../lib/request';

export const adminService = {
  listUsers: () => {
    return request<User[]>('/admin/users');
  },
  updateUserStatus: (id: string, status: UserStatus) => {
    return request<User>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  listGears: () => {
    return request<GearItem[]>('/admin/gear');
  },
  listRentals: () => {
    return request<RentalOrder[]>('/admin/rentals');
  },
};
