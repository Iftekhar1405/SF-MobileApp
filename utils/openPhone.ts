import * as Linking from 'expo-linking';
import { normalizeWhatsAppPhone } from '@/utils/openWhatsApp';

export async function openPhoneDialer(phone: string): Promise<void> {
  const digits = normalizeWhatsAppPhone(phone);
  const url = `tel:+${digits}`;
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    throw new Error('Phone calls are not available on this device');
  }
  await Linking.openURL(url);
}
