import { UserStatus } from '@/types/types';
import { request } from '../lib/request';

export const adminService = {
  listUsers: () => {
    return request('/admin/users');
  },
  updateUserStatus: (id: string, status: UserStatus) => {
    return request(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  listGears: () => {
    return request('/admin/gear');
  },
  listRentals: () => {
    return request('/admin/rentals');
  },
};
