import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateCurrentUser,
  type UpdateProfileBody,
} from '@/services/user.service';
import { useUserStore } from '@/store/userStore';

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setProfile = useUserStore((s) => s.setProfile);

  return useMutation({
    mutationFn: (body: UpdateProfileBody) => updateCurrentUser(body),
    onSuccess: (user) => {
      setProfile(user);
      qc.setQueryData(['profile'], user);
    },
  });
}
