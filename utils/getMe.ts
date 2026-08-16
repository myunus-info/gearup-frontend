'use server';

import { cookies } from 'next/headers';

const BASE_URL = process.env.BACKEND_API_URL;

export async function getMe() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return {
      success: false,
      message: 'Unauthorized user',
    };
  }

  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'force-cache',
    next: {
      revalidate: 24 * 60 * 60,
      tags: ['my-profile'],
    },
  });

  const result = await res.json();

  return result;
}
