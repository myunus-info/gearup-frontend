import apiClient from '@/lib/apiClient';
import type { IApiResponse, RentalOrder } from '@/types';

export interface ICreateRentalPayload {
  gearItemId: string;
  startDate: string;
  endDate: string;
  quantity: number;
}

export function createRentalOrder(payload: ICreateRentalPayload) {
  return apiClient<IApiResponse<RentalOrder>>('/rentals', {
    method: 'POST',
    body: payload,
  });
}

export function getMyRentals() {
  return apiClient<IApiResponse<RentalOrder[]>>('/rentals');
}

export function getRentalById(id: string) {
  return apiClient<IApiResponse<RentalOrder>>(`/rentals/${id}`);
}
