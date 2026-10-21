import apiClient from '@/lib/apiClient';
import type { IApiResponse, Review } from '@/types';

export interface ICreateReviewPayload {
  gearItemId: string;
  rentalOrderId: string;
  rating: number;
  comment?: string;
}

export function createReview(payload: ICreateReviewPayload) {
  return apiClient<IApiResponse<Review>>('/reviews', {
    method: 'POST',
    body: payload,
  });
}
