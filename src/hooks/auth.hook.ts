'use client';

import { getMe, loginUser, logoutUser, registerUser } from '@/api/auth.api';
import type { ILoginPayload, IRegisterPayload, Role, User } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useGetMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await getMe();
        return res?.data ?? null;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ILoginPayload) => loginUser(payload),
    onSuccess: (res: any, variables: ILoginPayload) => {
      if (res?.data?.accessToken) {
        Cookies.set('accessToken', res.data.accessToken, { expires: 1, path: '/' });
        localStorage.setItem('accessToken', res.data.accessToken);
      }
      if (res?.data?.refreshToken) {
        Cookies.set('refreshToken', res.data.refreshToken, { expires: 7, path: '/' });
        localStorage.setItem('refreshToken', res.data.refreshToken);
      }

      toast.success(res?.message || 'Signed in successfully!');
      queryClient.invalidateQueries({ queryKey: ['me'] });

      const role = res?.data?.user?.role;
      if (variables?.redirectTo) {
        router.push(variables.redirectTo);
      } else if (role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (role === 'PROVIDER') {
        router.push('/dashboard/provider');
      } else {
        router.push('/dashboard/customer');
      }
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || 'Login failed. Please check your credentials.',
      );
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: IRegisterPayload) => registerUser(payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || 'Registration successful! Please log in.');
      router.replace('/login');
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
      toast.success('Signed out successfully');
      router.replace('/login');
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
      toast.error(err?.data?.message || err?.message || 'Failed to sign out');
      router.replace('/login');
    },
  });
}

export function useDemoLogin() {
  const loginMutation = useLogin();

  const demoLogin = (role: Role) => {
    let email = 'customer@gearup.com';
    if (role === 'ADMIN') email = 'admin@gearup.com';
    if (role === 'PROVIDER') email = 'provider@gearup.com';

    return loginMutation.mutate({ email, password: 'Password123!' });
  };

  return { demoLogin, isPending: loginMutation.isPending };
}

export function useAuth() {
  const { data: user, isPending: isLoading } = useGetMe();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();
  const { demoLogin } = useDemoLogin();
  const queryClient = useQueryClient();

  const login = async (payload: ILoginPayload, redirectTo?: string) => {
    try {
      await loginMutation.mutateAsync({ ...payload, redirectTo });
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Handled in onError
    }
  };

  const register = async (payload: IRegisterPayload) => {
    try {
      await registerMutation.mutateAsync(payload);
      return true;
    } catch {
      return false;
    }
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  const updateUser = (updatedData: Partial<User>) => {
    queryClient.setQueryData(['me'], (prev: User | null | undefined) =>
      prev ? { ...prev, ...updatedData } : prev,
    );
  };

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    demoLogin,
    register,
    logout,
    refreshUser,
    updateUser,
    loginMutation,
    logoutMutation,
    registerMutation,
  };
}

export const useLoginMutation = useLogin;
export const useRegisterMutation = useRegister;
export const useLogoutMutation = useLogout;
