import apiClient from '@/lib/apiClient';
import type { GearItem, IApiResponse, RentalOrder, RentalStatus } from '@/types';

export function getProviderGears() {
  return apiClient<IApiResponse<GearItem[]>>('/provider/gear');
}

export function createProviderGear(payload: any) {
  return apiClient<IApiResponse<GearItem>>('/provider/gear', {
    method: 'POST',
    body: payload,
  });
}

export function updateProviderGear(id: string, payload: any) {
  return apiClient<IApiResponse<GearItem>>(`/provider/gear/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteProviderGear(id: string) {
  return apiClient<IApiResponse<{ id: string }>>(`/provider/gear/${id}`, {
    method: 'DELETE',
  });
}

export function getProviderOrders() {
  return apiClient<IApiResponse<RentalOrder[]>>('/provider/orders');
}

export function updateOrderStatus(orderId: string, status: RentalStatus) {
  return apiClient<IApiResponse<RentalOrder>>(`/provider/orders/${orderId}`, {
    method: 'PATCH',
    body: { status },
  });
}
