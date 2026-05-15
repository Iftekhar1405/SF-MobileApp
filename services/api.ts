import axios from 'axios';
import { router } from 'expo-router';
import { deleteAuthToken, getAuthToken } from '@/utils/tokenStorage';
import { resolveApiBaseUrl } from '@/utils/resolveApiBaseUrl';

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const baseURL = resolveApiBaseUrl(rawApiUrl);

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await deleteAuthToken();
      try {
        router.replace('/(auth)/login');
      } catch {
        /* router not ready */
      }
    }
    return Promise.reject(error);
  }
);

export function mediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  const base = process.env.EXPO_PUBLIC_MEDIA_BASE;
  if (!base) return path;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
