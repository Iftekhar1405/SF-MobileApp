import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { loginRequest } from '@/services/auth.service';
import {
  deleteAuthToken,
  getAuthToken,
  setAuthToken,
} from '@/utils/tokenStorage';

const USER_TOKEN_KEY = 'userTokenJson';

export type UserToken = { name: string; userId: string; role: string };

type AuthState = {
  token: string | null;
  userToken: UserToken | null;
  hydrated: boolean;
  loadFromStorage: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userToken: null,
  hydrated: false,

  loadFromStorage: async () => {
    const token = await getAuthToken();
    const raw = await AsyncStorage.getItem(USER_TOKEN_KEY);
    let userToken: UserToken | null = null;
    if (raw) {
      try {
        userToken = JSON.parse(raw) as UserToken;
      } catch {
        userToken = null;
      }
    }
    set({ token, userToken, hydrated: true });
  },

  login: async (identifier: string, password: string) => {
    const res = await loginRequest({ identifier, password });
    await setAuthToken(res.token);
    await AsyncStorage.setItem(USER_TOKEN_KEY, JSON.stringify(res.userToken));
    set({ token: res.token, userToken: res.userToken });
  },

  logout: async () => {
    await deleteAuthToken();
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
    set({ token: null, userToken: null });
  },
}));
