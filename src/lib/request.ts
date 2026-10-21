'use server';

import { env } from '@/config/env';
import { accessTokenExists } from './auth';

const API_BASE_URL = env.BACKEND_API_URL;

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function request(endpoint: string, options: RequestOptions = {}) {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requiresAuth) {
    const accessToken = await accessTokenExists();

    // accessTokenExists() returns the raw token string when authenticated, or an
    // object ({ success: false, ... }) when not. Only attach a real string token.
    if (typeof accessToken === 'string') {
      headers.set('Cookie', `accessToken=${accessToken}`);
      // headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);

    // Return the backend payload as-is. We deliberately do NOT throw here: this
    // module is a Server Action, and throwing inside a Server Action in production
    // surfaces as the masked "An error occurred in the Server Components render"
    // (React #441) error, hiding the real backend message and producing a 500.
    // Callers inspect `success` and throw a plain client-side error instead.
    return data;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Network request failed',
      data: null,
    };
  }
}
