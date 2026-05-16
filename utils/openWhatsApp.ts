import * as Linking from 'expo-linking';

export function normalizeWhatsAppPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = normalizeWhatsAppPhone(phone);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export async function openWhatsAppChat(
  phone: string,
  message: string
): Promise<void> {
  const url = buildWhatsAppUrl(phone, message);
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    throw new Error('WhatsApp is not available on this device');
  }
  await Linking.openURL(url);
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
