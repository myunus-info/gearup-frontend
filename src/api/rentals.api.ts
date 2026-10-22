import apiClient from '@/lib/apiClient';
import type { IApiResponse, RentalOrder } from '@/types';

export interface IRentalItemInput {
  gearItemId: string;
  quantity: number;
}

export interface ICreateRentalPayload {
  startDate: string;
  endDate: string;
  items?: IRentalItemInput[];
  gearItemId?: string;
  quantity?: number;
}

export function createRentalOrder(payload: ICreateRentalPayload) {
  const items =
    payload.items && payload.items.length > 0
      ? payload.items
      : payload.gearItemId
        ? [{ gearItemId: payload.gearItemId, quantity: payload.quantity || 1 }]
        : [];

  return apiClient<IApiResponse<{ order: RentalOrder; paymentUrl?: string }>>('/rentals', {
    method: 'POST',
    body: {
      startDate: payload.startDate,
      endDate: payload.endDate,
      items,
    },
  });
}

export function getMyRentals() {
  return apiClient<IApiResponse<RentalOrder[]>>('/rentals');
}

export function getRentalById(id: string) {
  return apiClient<IApiResponse<RentalOrder>>(`/rentals/${id}`);
}
