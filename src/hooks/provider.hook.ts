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

export const useAddGear = useCreateGear;

export function useUpdateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await updateProviderGear(id, data);
      return res;
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
      return res;
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
    mutationFn: async ({ id, status }: { id: string; status: RentalStatus }) => {
      const res = await updateOrderStatus(id, status);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-orders'] });
    },
  });
}
