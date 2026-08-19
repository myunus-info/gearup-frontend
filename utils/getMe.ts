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

  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    // cache: 'no-store',

    cache: 'force-cache',
    next: {
      revalidate: 24 * 60 * 60,
      tags: ['my-profile'],
    },
  });

  if (!response.ok) {
    return {
      success: false,
      message: 'Authentication failed',
    };
  }

  const result = await response.json();

  if (!result.success) {
    return {
      success: false,
      statusCode: 500,
      message: 'Something went wrong. Please try again.',
    };
  }

  return result;
}
