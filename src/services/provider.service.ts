import { GearItem, IGear, RentalStatus } from '@/types/types';
import { request } from '../lib/request';

export const providerService = {
  getMyGear: () => {
    return request('/provider/gear');
  },
  addGear: (payload: IGear) => {
    return request('/provider/gear', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getGearById: (id: string) => {
    return request(`/provider/gear/${id}`);
  },
  updateGear: (id: string, payload: Partial<GearItem>) => {
    return request(`/provider/gear/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteGear: (id: string) => {
    return request(`/provider/gear/${id}`, {
      method: 'DELETE',
    });
  },
  getOrders: () => {
    return request('/provider/orders');
  },
  updateOrderStatus: (id: string, status: RentalStatus) => {
    return request(`/provider/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
