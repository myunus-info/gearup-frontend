import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GearCondition, GearItem, RentalOrder, RentalStatus } from '@/types/types';
import { providerService } from '@/services/provider.service';
import { toast } from 'sonner';

export function useProviderGear() {
  return useQuery({
    queryKey: ['provider-gear'],
    queryFn: async () => {
      const res = await providerService.getMyGear();
      return res.data;
    },
  });
}

export function useProviderOrders() {
  return useQuery({
    queryKey: ['provider-orders'],
    queryFn: async () => {
      const res = await providerService.getOrders();
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
      return res.data;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RentalStatus }) => {
      const res = await providerService.updateOrderStatus(id, status);
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
