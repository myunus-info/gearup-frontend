'use client';

import { confirmPayment, getMyPayments, initiatePayment } from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (payload: {
      orderId?: string;
      rentalOrderId?: string;
      paymentMethod?: string;
      provider?: string;
    }) => {
      return initiatePayment(payload);
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || 'Payment initiation failed');
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { orderId: string; tranId: string; status: string }) => {
      const res = await confirmPayment(payload);
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
      toast.success(data?.message || 'Payment confirmed and reservation updated!');
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err?.message || 'Payment confirmation failed');
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
