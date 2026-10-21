'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  revalidateTag('my-profile', 'max');

  redirect('/auth/login');
}
