import axios from 'axios';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { deleteAuthToken, getAuthToken } from '@/utils/tokenStorage';
import { resolveApiBaseUrl } from '@/utils/resolveApiBaseUrl';

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const baseURL = resolveApiBaseUrl(rawApiUrl);

// #region agent log
fetch('http://127.0.0.1:7423/ingest/5f54783f-77cc-4e9b-aee4-ae5a2b3b4ac2', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Debug-Session-Id': 'daa49c',
  },
  body: JSON.stringify({
    sessionId: 'daa49c',
    location: 'services/api.ts:init',
    message: 'API client configured',
    data: {
      rawApiUrl: rawApiUrl.replace(/\/\/[^@]+@/, '//***@'),
      baseURL: baseURL.replace(/\/\/[^@]+@/, '//***@'),
      hasEnvUrl: Boolean(process.env.EXPO_PUBLIC_API_URL),
      platform: Platform.OS,
    },
    timestamp: Date.now(),
    hypothesisId: 'B',
  }),
}).catch(() => {});
// #endregion

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
    // #region agent log
    fetch('http://127.0.0.1:7423/ingest/5f54783f-77cc-4e9b-aee4-ae5a2b3b4ac2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': 'daa49c',
      },
      body: JSON.stringify({
        sessionId: 'daa49c',
        location: 'services/api.ts:responseError',
        message: 'API request failed',
        data: {
          baseURL: api.defaults.baseURL,
          url: error.config?.url,
          status: error.response?.status,
          code: error.code,
          message: error.message,
        },
        timestamp: Date.now(),
        hypothesisId: 'B-D',
      }),
    }).catch(() => {});
    // #endregion
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
