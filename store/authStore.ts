import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

interface User {
  _id: string;
  name: string;
  email?: string;
  mobile?: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (token, user) => {
    await SecureStore.setItemAsync('authToken', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('authToken');
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadFromStorage: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        // Option 1: Validate token or fetch profile
        // const { data } = await api.get('/user/profile');
        // set({ token, user: data.user, isAuthenticated: true });
        
        // Option 2: Optimistically set authenticated
        set({ token, isAuthenticated: true });
      }
    } catch (e) {
      console.error('Failed to load token', e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
