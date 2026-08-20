import { useMutation, useQuery } from '@tanstack/react-query';
import { rentalService } from '@/services/rental.service';
import { paymentService } from '@/services/payment.service';
import { reviewService } from '@/services/review.service';

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: {
      startDate: string;
      endDate: string;
      items: { gearItemId: string; quantity: number }[];
    }) => {
      const res = await rentalService.createOrder(payload);
      return res;
    },
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await rentalService.getMyOrders();
      return res.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await rentalService.getOrderById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => {
      const res = await paymentService.getMyPayments();
      return res.data;
    },
  });
}

export function useCreateReview() {
  return useMutation({
    mutationFn: async (payload: {
      rentalOrderId: string;
      gearItemId: string;
      rating: number;
      comment?: string;
    }) => {
      const res = await reviewService.createReview(payload);
      return res.data;
    },
  });
}
