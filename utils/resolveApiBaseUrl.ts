import { Platform } from 'react-native';

/** Android emulator alias for the host machine's loopback. */
const ANDROID_EMULATOR_HOST = '10.0.2.2';

/**
 * On Android emulator, localhost points at the emulator—not the dev machine.
 * Rewrite loopback hosts to 10.0.2.2 so API calls reach the host backend.
 */
export function resolveApiBaseUrl(raw?: string | null): string {
  const url = raw ?? 'http://localhost:8000/api/v1';
  if (Platform.OS !== 'android') return url;

  try {
    const parsed = new URL(url);
    if (
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1'
    ) {
      parsed.hostname = ANDROID_EMULATOR_HOST;
      return parsed.href.replace(/\/$/, '');
    }
  } catch {
    return url;
  }

  return url;
}
