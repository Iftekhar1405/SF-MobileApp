import axios from 'axios';

export function isNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  if (error.response) return false;
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED' ||
    error.message.toLowerCase().includes('network') ||
    error.message.toLowerCase().includes('timeout')
  );
}

export function getNetworkErrorMessage(error?: unknown): string {
  if (isNetworkError(error)) {
    return 'Please check your internet connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}
