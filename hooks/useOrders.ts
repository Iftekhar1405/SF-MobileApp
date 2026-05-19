import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchOrderById,
  fetchOrderHistory,
  placeOrder,
  type PlaceOrderBody,
} from '@/services/order.service';

export function useOrderHistory() {
  return useQuery({
    queryKey: ['orders', 'history'],
    queryFn: fetchOrderHistory,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: Boolean(id),
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body?: PlaceOrderBody) => placeOrder(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['orders', 'history'] });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
