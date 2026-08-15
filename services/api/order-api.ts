import { RentalOrder } from '@/lib/types';
import { request } from './request';

export async function createOrder(payload: {
  startDate: string;
  endDate: string;
  items: { gearItemId: string; quantity: number }[];
}) {
  return request<{ order: RentalOrder; paymentUrl?: string }>('/rentals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMyOrders() {
  return request<RentalOrder[]>('/rentals');
}

export async function getOrderById(id: string) {
  return request<RentalOrder>(`/rentals/${id}`);
}
