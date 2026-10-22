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
import { toast } from 'sonner';

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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['provider-gears'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success(data?.message || 'Equipment item listed successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || 'Failed to create equipment item');
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['provider-gears'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success(data?.message || 'Equipment item updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || 'Failed to update equipment item');
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['provider-gears'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success(data?.message || 'Equipment listing removed successfully');
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || 'Failed to delete equipment item');
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['provider-orders'] });
      toast.success(data?.message || 'Rental order status updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || 'Failed to update order status');
    },
  });
}
