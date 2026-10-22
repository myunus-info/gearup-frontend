import {
  type ICreateReviewPayload,
  createRentalOrder,
  createReview,
  getMyRentals,
  getRentalById,
} from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export { useConfirmPayment, useMyPayments } from './payment.hook';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      startDate: string;
      endDate: string;
      items: { gearItemId: string; quantity: number }[];
    }) => {
      return createRentalOrder(payload as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await getMyRentals();
      return res.data;
    },
  });
}

export function useOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await getRentalById(id);
      return res.data;
    },
    enabled: !!id && enabled,
    retry: 1,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateReviewPayload) => {
      const res = await createReview(payload);
      return res.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
      toast.success(data?.message || 'Thank you! Your equipment review was submitted.');
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || 'Failed to submit review');
    },
  });
}
