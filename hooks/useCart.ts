import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addToCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '@/services/cart.service';

export function useCartQuery() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => updateCartItem(itemId, { quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}
