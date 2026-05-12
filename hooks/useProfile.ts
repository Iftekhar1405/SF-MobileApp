import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/services/user.service';
import { useAuthStore } from '@/store/authStore';

export function useProfile() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchCurrentUser,
    enabled: Boolean(token),
  });
}
