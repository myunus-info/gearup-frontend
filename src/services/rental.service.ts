import { request } from '../lib/request';

export const rentalService = {
  createOrder: (payload: {
    startDate: string;
    endDate: string;
    items: { gearItemId: string; quantity: number }[];
  }) => {
    return request('/rentals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getMyOrders: () => {
    return request('/rentals');
  },
  getOrderById: (id: string) => {
    return request(`/rentals/${id}`);
  },
};
