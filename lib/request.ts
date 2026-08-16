import { ApiResponse } from '@/types/types';
import { env } from '@/config/env';
import { accessTokenExists } from './auth';

const API_BASE_URL = env.BACKEND_API_URL;

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requiresAuth) {
    const accessToken = await accessTokenExists();

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    console.log(response);
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || `Request failed with status ${response.status}`);
  }

  return await response.json();
}
