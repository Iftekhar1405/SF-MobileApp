import { api } from './api';
import type { Product } from '@/types/models';

export type ProductsPage = {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
};

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  gender?: string;
  brand?: string;
  material?: string;
  inStock?: boolean;
}): Promise<ProductsPage> {
  const { data } = await api.get<{
    products: Product[];
    totalProducts: number;
    totalPages: number;
    currentPage: number;
  }>('/products', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      category: params.category,
      gender: params.gender,
      brand: params.brand,
      material: params.material,
      inStock:
        params.inStock === undefined
          ? undefined
          : params.inStock
            ? 'true'
            : 'false',
    },
  });
  return {
    products: data.products,
    totalProducts: data.totalProducts,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
  };
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data } = await api.get<{ product: Product }>(`/products/${id}`);
  return data.product;
}

export async function fetchBrands(): Promise<string[]> {
  const { data } = await api.get<{ brands: string[] }>('/products/brands');
  return data.brands ?? [];
}

export async function searchProductsByArticle(
  article: string
): Promise<Product[]> {
  const { data } = await api.get<{ products?: Product[]; success?: boolean }>(
    '/products/article',
    { params: { article } }
  );
  return data.products ?? [];
}

export async function fetchProductsByCategory(params: {
  category: string;
  gender?: string;
  page?: number;
  limit?: number;
  inStock?: boolean;
}): Promise<ProductsPage> {
  const { data } = await api.get<{
    products: Product[];
    totalProducts?: number;
    totalPages?: number;
    currentPage?: number;
  }>('/search/category/specific', {
    params: {
      category: params.category,
      gender: params.gender,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      inStock:
        params.inStock === undefined
          ? undefined
          : params.inStock
            ? 'true'
            : 'false',
    },
  });
  return {
    products: data.products ?? [],
    totalProducts: data.totalProducts ?? data.products?.length ?? 0,
    totalPages: data.totalPages ?? 1,
    currentPage: data.currentPage ?? 1,
  };
}

export async function searchProductsQuery(params: {
  q: string;
  page?: number;
}): Promise<{ products: Product[]; totalPages: number; currentPage: number }> {
  const { data } = await api.get<{
    products: Product[];
    totalPages: number;
    currentPage: number;
  }>('/search', {
    params: { q: params.q, page: params.page ?? 1 },
  });
  return {
    products: data.products ?? [],
    totalPages: data.totalPages ?? 1,
    currentPage: data.currentPage ?? 1,
  };
}
