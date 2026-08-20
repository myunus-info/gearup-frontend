import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GearCondition, GearItem, RentalStatus } from '@/types/types';
import { providerService } from '@/services/provider.service';

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
  });
}

export function useUpdateGear() {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<GearItem> }) => {
      const res = await providerService.updateGear(id, payload);
      return res.data;
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

      queryClient.setQueryData(['provider-orders'], (old: any) => {
        if (!old) return old;
        return old.map((order: any) => (order.id === id ? { ...order, status } : order));
      });

      return { previousOrders };
    },
  });
}
