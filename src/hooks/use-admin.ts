import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserStatus } from '@/types/types';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';

type AdminUser = {
  id: string;
  status: UserStatus;
  [key: string]: unknown;
};

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await adminService.listUsers();
      if (!res?.success) throw new Error(res?.message || 'Failed to load users');
      return res.data;
    },
  });
}

export function useAdminGear() {
  return useQuery({
    queryKey: ['admin-gear'],
    queryFn: async () => {
      const res = await adminService.listGears();
      if (!res?.success) throw new Error(res?.message || 'Failed to load gear');
      return res.data;
    },
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ['admin-rentals'],
    queryFn: async () => {
      const res = await adminService.listRentals();
      if (!res?.success) throw new Error(res?.message || 'Failed to load rentals');
      return res.data;
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const res = await adminService.updateUserStatus(id, status);
      if (!res?.success) throw new Error(res?.message || 'Failed to update user status');
      return res.data;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-users'] });
      const prevUsers = queryClient.getQueryData<AdminUser[]>(['admin-users']);

      queryClient.setQueryData<AdminUser[]>(['admin-users'], (old) => {
        if (!old) return old;
        return old.map((user) => (user.id === id ? { ...user, status } : user));
      });

      return { prevUsers };
    },
    onError: (err: unknown, _vars, context) => {
      const errMsg = err instanceof Error ? err.message : 'Failed to update user status';
      if (context?.prevUsers) {
        queryClient.setQueryData(['admin-users'], context.prevUsers);
      }
      toast.error(errMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status successfully updated!');
    },
  });
}
