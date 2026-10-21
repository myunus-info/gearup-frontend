'use client';

import { getMe } from '@/api/auth.api';
import { useQuery } from '@tanstack/react-query';

export { useAuth } from '@/providers/authProvider';

export function useGetMe() {
  return useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      try {
        const res = await getMe();
        return {
          success: true,
          data: res.data,
          statusCode: res.statusCode || 200,
          message: res.message || 'Authenticated',
        };
      } catch (err: any) {
        return {
          success: false,
          data: null,
          statusCode: err?.statusCode || 401,
          message: err?.message || 'Unauthenticated',
        };
      }
    },
    staleTime: 60 * 1000,
    retry: false,
  });
}
