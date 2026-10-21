'use server';

import { env } from '@/config/env';
import { cookies } from 'next/headers';

const BASE_URL = env.BACKEND_API_URL;

export async function getMe() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return {
      success: false,
      message: 'Unauthorized user',
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        message: 'Authentication failed',
      };
    }

    const result = await response.json();
    return result;
  } catch {
    return {
      success: false,
      statusCode: 400,
      message: 'Authentication failed',
    };
  }
}
