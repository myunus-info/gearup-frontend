import { Review } from '@/lib/types';
import { request } from './request';

export async function createReview(payload: {
  rentalOrderId: string;
  gearItemId: string;
  rating: number;
  comment?: string;
}) {
  return request<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
