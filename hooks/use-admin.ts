import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserStatus } from '@/types/types';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await adminService.listUsers();
      return res.data;
    },
  });
}

export function useAdminGear() {
  return useQuery({
    queryKey: ['admin-gear'],
    queryFn: async () => {
      const res = await adminService.listGears();
      return res.data;
    },
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ['admin-rentals'],
    queryFn: async () => {
      const res = await adminService.listRentals();
      return res.data;
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const res = await adminService.updateUserStatus(id, status);
      return res.data;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-users'] });
      const prevUsers = queryClient.getQueryData(['admin-users']);

      queryClient.setQueryData(['admin-users'], (old: any) => {
        if (!old) return old;
        return old.map((user: any) => (user.id === id ? { ...user, status } : user));
      });

      return { prevUsers };
    },
    onError: (err: any, _vars, context) => {
      if (context?.prevUsers) {
        queryClient.setQueryData(['admin-users'], context.prevUsers);
      }
      toast.error(err.message || 'Failed to update user status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status successfully updated!');
    },
  });
}
