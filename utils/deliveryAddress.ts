import type { User } from '@/types/models';

export type DeliveryFormValues = {
  deliveryAddress: string;
  pincode: string;
  landmark: string;
};

export function getSavedDelivery(profile: User | null | undefined): DeliveryFormValues {
  return {
    deliveryAddress: profile?.deliveryAddress?.trim() ?? '',
    pincode: profile?.pincode?.trim() ?? '',
    landmark: profile?.landmark?.trim() ?? '',
  };
}

export function hasSavedDelivery(profile: User | null | undefined): boolean {
  const { deliveryAddress, pincode } = getSavedDelivery(profile);
  return deliveryAddress.length > 0 && pincode.length > 0;
}

export function hydrateDeliveryForm(
  profile: User | null | undefined
): DeliveryFormValues {
  const saved = getSavedDelivery(profile);
  if (saved.deliveryAddress && saved.pincode) return saved;
  return {
    deliveryAddress: '',
    pincode: '',
    landmark: saved.landmark,
  };
}
