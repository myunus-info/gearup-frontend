import { GearCondition, GearItem, RentalOrder, RentalStatus } from '@/lib/types';
import { request } from './request';

export async function getMyGear() {
  return request<GearItem[]>('/provider/gear');
}

export async function addGear(payload: {
  categoryId: string;
  name: string;
  description?: string;
  brand?: string;
  pricePerDay: number;
  depositAmount?: number;
  quantityTotal: number;
  condition?: GearCondition;
  images?: string[];
}) {
  return request<GearItem>('/provider/gear', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getGearById(id: string) {
  return request<GearItem>(`/provider/gear/${id}`);
}

export async function updateGear(id: string, payload: Partial<GearItem>) {
  return request<GearItem>(`/provider/gear/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteGear(id: string) {
  return request<{ success: boolean }>(`/provider/gear/${id}`, {
    method: 'DELETE',
  });
}

export async function getOrders() {
  return request<RentalOrder[]>('/provider/orders');
}

export async function updateOrderStatus(id: string, status: RentalStatus) {
  return request<RentalOrder>(`/provider/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
