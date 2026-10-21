import {
  type ICreateReviewPayload,
  confirmPayment,
  createRentalOrder,
  createReview,
  getMyPayments,
  getMyRentals,
  getRentalById,
} from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await getRentalById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { orderId: string; tranId: string; status: string }) => {
      const res = await confirmPayment(payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
    },
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => {
      const res = await getMyPayments();
      return res.data;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ICreateReviewPayload) => {
      const res = await createReview(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['gears'] });
    },
  });
}
