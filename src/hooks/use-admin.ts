import {
  getAdminGearListings,
  getAdminRentalOrders,
  getAdminUsers,
  updateAdminUserStatus,
} from '@/api';
import type { UserStatus } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await getAdminUsers();
      return res.data;
    },
  });
}

export function useAdminGears() {
  return useQuery({
    queryKey: ['admin-gears'],
    queryFn: async () => {
      const res = await getAdminGearListings();
      return res.data;
    },
  });
}

export const useAdminGear = useAdminGears;

export function useAdminRentals() {
  return useQuery({
    queryKey: ['admin-rentals'],
    queryFn: async () => {
      const res = await getAdminRentalOrders();
      return res.data;
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const res = await updateAdminUserStatus(id, status);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}
