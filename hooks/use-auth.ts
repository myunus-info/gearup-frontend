import { useMutation, useQuery } from '@tanstack/react-query';
import { LoginPayload, RegisterPayload } from '@/types/types';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: () => {
      toast.success('Login successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      toast.success('Registration successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    retry: false,
  });
}
