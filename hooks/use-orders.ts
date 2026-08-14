import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export function useMyOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.orders.getMyOrders();
      return res.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.orders.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const res = await api.payments.getMyPayments();
      return res.data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      startDate: string;
      endDate: string;
      items: { gearItemId: string; quantity: number }[];
    }) => {
      const res = await api.orders.create(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["gears"] });
      toast.success("Rental order placed successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to place order");
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      rentalOrderId: string;
      gearItemId: string;
      rating: number;
      comment?: string;
    }) => {
      const res = await api.reviews.create(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["gears"] });
      queryClient.invalidateQueries({ queryKey: ["gear"] });
      toast.success("Thank you for your review!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit review");
    },
  });
}
