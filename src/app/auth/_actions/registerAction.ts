'use server';

import { env } from '@/config/env';
import type { RegisterPayload } from '@/types/types';

export async function registerAction(data: RegisterPayload) {
  try {
    const response = await fetch(`${env.BACKEND_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        statusCode: response.status,
        message: result?.message || 'Registration failed',
      };
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error?.message || 'Network error during registration',
    };
  }
}
