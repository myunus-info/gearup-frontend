import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GearCondition, GearItem, RentalOrder, RentalStatus } from '@/types/types';
import { providerService } from '@/services/provider.service';
import { toast } from 'sonner';

export function useProviderGear() {
  return useQuery({
    queryKey: ['provider-gear'],
    queryFn: async () => {
      const res = await providerService.getMyGear();
      if (!res?.success) throw new Error(res?.message || 'Failed to load gear');
      return res.data;
    },
  });
}

export function useProviderOrders() {
  return useQuery({
    queryKey: ['provider-orders'],
    queryFn: async () => {
      const res = await providerService.getOrders();
      if (!res?.success) throw new Error(res?.message || 'Failed to load orders');
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
      condition?: GearCondition;
      images?: string[];
    }) => {
      const res = await providerService.addGear(payload);
      if (!res?.success) throw new Error(res?.message || 'Failed to add gear');
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-gear'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success('Gear item listed successfully!');
    },
  });
}

export function useUpdateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<GearItem> }) => {
      const res = await providerService.updateGear(id, payload);
      if (!res?.success) throw new Error(res?.message || 'Failed to update gear');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-gear'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success('Gear item updated successfully!');
    },
  });
}

export function useDeleteGear() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await providerService.deleteGear(id);
      if (!res?.success) throw new Error(res?.message || 'Failed to delete gear');
      return res.data;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RentalStatus }) => {
      const res = await providerService.updateOrderStatus(id, status);
      if (!res?.success) throw new Error(res?.message || 'Failed to update order status');
      return res.data;
    },
    // Optimistic UI updates
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['provider-orders'] });
      const previousOrders = queryClient.getQueryData(['provider-orders']);

      queryClient.setQueryData(['provider-orders'], (old: RentalOrder[]) => {
        if (!old) return old;
        return old.map((order: RentalOrder) => (order.id === id ? { ...order, status } : order));
      });

      return { previousOrders };
    },
  });
}
