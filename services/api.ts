import axios from 'axios';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { deleteAuthToken, getAuthToken } from '@/utils/tokenStorage';
import { resolveApiBaseUrl } from '@/utils/resolveApiBaseUrl';

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const baseURL = resolveApiBaseUrl(rawApiUrl);

const DEBUG_INGEST =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:7423/ingest/5f54783f-77cc-4e9b-aee4-ae5a2b3b4ac2'
    : 'http://127.0.0.1:7423/ingest/5f54783f-77cc-4e9b-aee4-ae5a2b3b4ac2';

// #region agent log
(() => {
  let host = '';
  try {
    host = new URL(baseURL).hostname;
  } catch {
    host = '(invalid-url)';
  }
  fetch(DEBUG_INGEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': 'df9cd7',
    },
    body: JSON.stringify({
      sessionId: 'df9cd7',
      location: 'app/services/api.ts:init',
      message: 'API client initialized',
      data: {
        platformOS: Platform.OS,
        rawApiUrl,
        baseURL,
        parsedHost: host,
        hostRewritten: rawApiUrl !== baseURL,
      },
      timestamp: Date.now(),
      hypothesisId: 'H1',
      runId: 'verify-port',
    }),
  }).catch(() => {});
})();
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
    fetch(DEBUG_INGEST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': 'df9cd7',
      },
      body: JSON.stringify({
        sessionId: 'df9cd7',
        location: 'app/services/api.ts:responseError',
        message: 'API request failed',
        data: {
          platformOS: Platform.OS,
          code: error?.code ?? null,
          message: error?.message ?? null,
          status: error?.response?.status ?? null,
          baseURL: error?.config?.baseURL ?? null,
          url: error?.config?.url ?? null,
          hasResponse: Boolean(error?.response),
          responsePreview:
            typeof error?.response?.data === 'string'
              ? error.response.data.slice(0, 80)
              : error?.response?.data?.msg ?? null,
        },
        timestamp: Date.now(),
        hypothesisId: 'H2',
        runId: 'verify-port',
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
