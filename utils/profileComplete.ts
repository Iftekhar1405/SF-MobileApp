import type { User } from '@/types/models';

export function isProfileComplete(user: User | null | undefined): boolean {
  if (!user) return false;
  const name = user.name?.trim() ?? '';
  const shop = user.shopName?.trim() ?? '';
  const address = user.address?.trim() ?? '';
  if (name.length < 3) return false;
  if (!shop) return false;
  if (!address) return false;
  return true;
}
