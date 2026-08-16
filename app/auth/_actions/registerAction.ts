'use server';

import { env } from '@/config/env';
import type { RegisterPayload } from '@/types/types';

export async function registerAction(data: RegisterPayload) {
  console.log('data : ', data);
  const response = await fetch(`${env.BACKEND_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  console.log('response: ', response);

  if (!response.ok) {
    return {
      success: false,
      statusCode: response.status,
      message: `${response.statusText}: Registration failed.`,
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
