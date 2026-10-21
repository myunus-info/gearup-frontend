'use client';

import { getMe, loginUser, logoutUser, registerUser } from '@/api/auth.api';
import type { ILoginPayload, IRegisterPayload } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ILoginPayload) => loginUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: IRegisterPayload) => registerUser(payload),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
