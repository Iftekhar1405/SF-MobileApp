export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === 'object' &&
    error &&
    'response' in error &&
    typeof (error as { response?: { data?: { msg?: string } } }).response?.data
      ?.msg === 'string'
  ) {
    return (error as { response: { data: { msg: string } } }).response.data.msg;
  }
  return fallback;
}
