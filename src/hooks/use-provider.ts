import {
  createProviderGear,
  deleteProviderGear,
  getProviderGears,
  getProviderOrders,
  updateOrderStatus,
  updateProviderGear,
} from '@/api';
import type { RentalStatus } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProviderGears() {
  return useQuery({
    queryKey: ['provider-gears'],
    queryFn: async () => {
      const res = await getProviderGears();
      return res.data;
    },
  });
}

// Alias for singular import compatibility
export const useProviderGear = useProviderGears;

export function useProviderOrders() {
  return useQuery({
    queryKey: ['provider-orders'],
    queryFn: async () => {
      const res = await getProviderOrders();
      return res.data;
    },
  });
}

export function useCreateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await createProviderGear(payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-gears'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
    },
  });
}

// Alias for add gear import compatibility
export const useAddGear = useCreateGear;

export function useUpdateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await updateProviderGear(id, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-gears'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteProviderGear(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-gears'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: RentalStatus }) => {
      const res = await updateOrderStatus(orderId, status);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-orders'] });
    },
  });
}
