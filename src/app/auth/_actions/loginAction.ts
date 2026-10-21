'use server';

import { env } from '@/config/env';
import type { LoginPayload } from '@/types/types';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(redirectTo: string, payload: LoginPayload) {
  try {
    const response = await fetch(`${env.BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || 'Invalid email or password',
      };
    }

    const cookieStore = await cookies();

    cookieStore.set('accessToken', result.data.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
      sameSite: 'lax',
      path: '/',
    });

    if (result.data.refreshToken) {
      cookieStore.set('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
        path: '/',
      });
    }

    const decoded = jwt.decode(result.data.accessToken) as JwtPayload;

    if (
      redirectTo &&
      typeof redirectTo === 'string' &&
      redirectTo.startsWith('/') &&
      !redirectTo.startsWith('//')
    ) {
      redirect(redirectTo);
    }

    if (decoded?.role === 'ADMIN') redirect('/dashboard/admin');
    else if (decoded?.role === 'PROVIDER') redirect('/dashboard/provider');
    else if (decoded?.role === 'CUSTOMER') redirect('/dashboard/customer');
    else redirect('/');

    return result;
  } catch (error: any) {
    // Re-throw redirect errors so Next.js handles them properly
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return {
      success: false,
      message: error?.message || 'Login failed. Please try again.',
    };
  }
}
