'use server';

import { env } from '@/config/env';
import { jwtUtils } from '@/utils/jwt';
import { cookies } from 'next/headers';

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value || null;

  if (!refreshToken) {
    return {
      success: false,
      message: 'Refresh token not found!',
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
    cache: 'no-cache',
  });

  const result = await res.json();

  return result;
};

export const accessTokenExists = async () => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value || null;
  const refreshToken = cookieStore.get('refreshToken')?.value || null;

  if (!accessToken && !refreshToken) {
    return {
      success: false,
      message: 'User not logged in!',
    };
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    //access token has expired but refresh token is valid, get new access token from backend
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      accessToken = newAccessToken;
    }
  }

  return accessToken;
};
