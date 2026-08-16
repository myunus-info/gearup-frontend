import { RentalOrder } from '@/types/types';
import { request } from '../lib/request';

export const rentalService = {
  createOrder: (payload: {
    startDate: string;
    endDate: string;
    items: { gearItemId: string; quantity: number }[];
  }) => {
    return request<{ order: RentalOrder; paymentUrl?: string }>('/rentals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getMyOrders: () => {
    return request<RentalOrder[]>('/rentals');
  },
  getOrderById: (id: string) => {
    return request<RentalOrder>(`/rentals/${id}`);
  },
};
