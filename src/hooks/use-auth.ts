import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export function useGetMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    retry: false,
  });
}
