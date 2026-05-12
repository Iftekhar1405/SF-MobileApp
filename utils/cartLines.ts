import type { Cart, CartItem } from '@/types/models';

export function isPopulatedProduct(
  p: CartItem['productId']
): p is import('@/types/models').Product {
  return typeof p === 'object' && p !== null && '_id' in p;
}

export function cartQtyForProduct(cart: Cart | undefined, productId: string): number {
  if (!cart?.items?.length) return 0;
  return cart.items.reduce((sum, item) => {
    const pid = isPopulatedProduct(item.productId)
      ? item.productId._id
      : String(item.productId);
    return pid === productId ? sum + item.quantity : sum;
  }, 0);
}

export function cartLinesForProduct(
  cart: Cart | undefined,
  productId: string
): CartItem[] {
  if (!cart?.items?.length) return [];
  return cart.items.filter((item) => {
    const pid = isPopulatedProduct(item.productId)
      ? item.productId._id
      : String(item.productId);
    return pid === productId;
  });
}
