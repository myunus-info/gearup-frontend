import { GearItem, IGear, RentalOrder, RentalStatus } from '@/types/types';
import { request } from '../lib/request';

export const providerService = {
  getMyGear: () => {
    return request<GearItem[]>('/provider/gear');
  },
  addGear: (payload: IGear) => {
    return request<GearItem>('/provider/gear', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getGearById: (id: string) => {
    return request<GearItem>(`/provider/gear/${id}`);
  },
  updateGear: (id: string, payload: Partial<GearItem>) => {
    return request<GearItem>(`/provider/gear/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteGear: (id: string) => {
    return request<{ success: boolean }>(`/provider/gear/${id}`, {
      method: 'DELETE',
    });
  },
  getOrders: () => {
    return request<RentalOrder[]>('/provider/orders');
  },
  updateOrderStatus: (id: string, status: RentalStatus) => {
    return request<RentalOrder>(`/provider/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
