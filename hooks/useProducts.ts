import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchProductById,
  fetchProducts,
  fetchProductsByCategory,
} from '@/services/product.service';

export function useProductsInfinite(filters: {
  category?: string;
  gender?: string;
  brand?: string;
  inStock?: boolean;
  pageSize?: number;
  enabled?: boolean;
}) {
  const pageSize = filters.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: ['products', filters],
    initialPageParam: 1,
    enabled: filters.enabled !== false,
    queryFn: ({ pageParam }) =>
      fetchProducts({
        page: pageParam,
        limit: pageSize,
        category: filters.category,
        gender: filters.gender,
        brand: filters.brand,
        inStock: filters.inStock,
      }),
    getNextPageParam: (last) =>
      last.currentPage < last.totalPages ? last.currentPage + 1 : undefined,
  });
}

export function useCategoryProductsInfinite(params: {
  category: string;
  gender?: string;
  inStock?: boolean;
  pageSize?: number;
}) {
  const pageSize = params.pageSize ?? 20;
  return useInfiniteQuery({
    queryKey: ['category-products', params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchProductsByCategory({
        category: params.category,
        gender: params.gender,
        page: pageParam,
        limit: pageSize,
        inStock: params.inStock,
      }),
    getNextPageParam: (last) =>
      last.currentPage < last.totalPages ? last.currentPage + 1 : undefined,
    enabled: Boolean(params.category),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: Boolean(id),
  });
}
