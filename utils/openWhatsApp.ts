import * as Linking from 'expo-linking';

export function normalizeWhatsAppPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = normalizeWhatsAppPhone(phone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppFallbackUrl(phone: string, message: string): string {
  const digits = normalizeWhatsAppPhone(phone);
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(message)}`;
}

export async function openWhatsAppChat(
  phone: string,
  message: string
): Promise<void> {
  const urls = [
    buildWhatsAppUrl(phone, message),
    buildWhatsAppFallbackUrl(phone, message),
  ];
  let lastError: unknown;

  for (const url of urls) {
    try {
      await Linking.openURL(url);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Could not open WhatsApp');
}

export function getWhatsAppAdminPhone(): string {
  return (
    process.env.EXPO_PUBLIC_WHATSAPP_ADMIN_PHONE?.trim() || '917024191093'
  );
}

export function getWebAppUrl(): string {
  return (
    process.env.EXPO_PUBLIC_WEB_APP_URL?.trim() ||
    'https://salimfootwear.com'
  ).replace(/\/$/, '');
}
