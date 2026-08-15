import { ApiResponse } from '@/lib/types';
import { accessTokenExists } from '../token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gearupapi.vercel.app/api/v1';

// Fetch wrapper with fallback
export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = accessTokenExists();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Cookie'] = `accessToken=${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: unknown) {
    throw err;
  }
}
