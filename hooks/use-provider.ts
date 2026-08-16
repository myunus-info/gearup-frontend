import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { GearItem, RentalStatus } from '@/types/types';
import { toast } from 'sonner';

export function useProviderGear() {
  return useQuery({
    queryKey: ['provider-gear'],
    queryFn: async () => {
      const res = await api.provider.getMyGear();
      return res.data;
    },
  });
}

export function useProviderOrders() {
  return useQuery({
    queryKey: ['provider-orders'],
    queryFn: async () => {
      const res = await api.provider.getOrders();
      return res.data;
    },
  });
}

export function useAddGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      categoryId: string;
      name: string;
      description?: string;
      brand?: string;
      pricePerDay: number;
      depositAmount?: number;
      quantityTotal: number;
      condition?: any;
      images?: string[];
    }) => {
      const res = await api.provider.addGear(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-gear'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success('Gear item listed successfully!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to add gear item');
    },
  });
}

export function useUpdateGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<GearItem> }) => {
      const res = await api.provider.updateGear(id, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-gear'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success('Gear item updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update gear item');
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.provider.deleteGear(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-gear'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success('Gear item removed successfully!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete gear item');
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RentalStatus }) => {
      const res = await api.provider.updateOrderStatus(id, status);
      return res.data;
    },
    // Optimistic UI updates
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['provider-orders'] });
      const previousOrders = queryClient.getQueryData(['provider-orders']);

      queryClient.setQueryData(['provider-orders'], (old: any) => {
        if (!old) return old;
        return old.map((order: any) => (order.id === id ? { ...order, status } : order));
      });

      return { previousOrders };
    },
    onError: (err: any, _vars, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['provider-orders'], context.previousOrders);
      }
      toast.error(err.message || 'Failed to update order status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      toast.success('Order status updated!');
    },
  });
}
