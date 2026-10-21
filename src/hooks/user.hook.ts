'use client';

import { getMe } from '@/api/auth.api';
import type { IUpdateProfilePayload } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useGetMyProfile() {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const res = await getMe();
      return res;
    },
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: IUpdateProfilePayload) => {
      // Typically patches /users/me
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    },
  });
}
