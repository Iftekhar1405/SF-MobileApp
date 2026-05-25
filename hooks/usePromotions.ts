import { useQuery } from '@tanstack/react-query';
import { fetchPromotions } from '@/services/promotion.service';

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: fetchPromotions,
  });
}
