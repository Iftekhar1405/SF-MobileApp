import { create } from 'zustand';
import type { User } from '@/types/models';

type UserState = {
  profile: User | null;
  setProfile: (u: User | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
