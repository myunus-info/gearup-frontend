'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { LoginPayload } from '@/types/types';
import { env } from '@/config/env';

export async function loginAction(redirectTo: string, payload: LoginPayload) {
  const response = await fetch(`${env.BACKEND_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return {
      success: false,
      message: 'Login failed',
    };
  }

  const result = await response.json();

  if (result.success) {
    const cookieStore = await cookies();

    cookieStore.set('accessToken', result.data.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
      sameSite: 'lax',
      path: '/',
    });

    cookieStore.set('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
      path: '/',
    });

    const decoded = jwt.decode(result.data.accessToken) as JwtPayload;

    if (
      redirectTo &&
      typeof redirectTo === 'string' &&
      redirectTo.startsWith('/') &&
      !redirectTo.startsWith('//')
    ) {
      redirect(redirectTo);
    }

    if (decoded.role === 'ADMIN') redirect('/dashboard/admin', 'replace');
    else if (decoded.role === 'PROVIDER') redirect('/dashboard/provider', 'replace');
    else if (decoded.role === 'CUSTOMER') redirect('/dashboard/customer', 'replace');
    else redirect('/');
  }

  return result;
}
