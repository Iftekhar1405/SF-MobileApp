export type ProductSortOption =
  | 'default'
  | 'article_asc'
  | 'article_desc'
  | 'price_asc'
  | 'price_desc';

export const PRODUCT_SORT_OPTIONS: {
  key: ProductSortOption;
  label: string;
  section: 'name' | 'price';
}[] = [
  { key: 'article_asc', label: 'A → Z', section: 'name' },
  { key: 'article_desc', label: 'Z → A', section: 'name' },
  { key: 'price_asc', label: 'Low to high', section: 'price' },
  { key: 'price_desc', label: 'High to low', section: 'price' },
];

export type ApiSortParams = {
  sortBy?: 'article' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

/** Maps UI sort selection to API query params. */
export function toApiSortParams(sort: ProductSortOption): ApiSortParams {
  switch (sort) {
    case 'article_asc':
      return { sortBy: 'article', sortOrder: 'asc' };
    case 'article_desc':
      return { sortBy: 'article', sortOrder: 'desc' };
    case 'price_asc':
      return { sortBy: 'price', sortOrder: 'asc' };
    case 'price_desc':
      return { sortBy: 'price', sortOrder: 'desc' };
    default:
      return { sortBy: 'createdAt', sortOrder: 'desc' };
  }
}

export function productSortLabel(sort: ProductSortOption): string {
  const match = PRODUCT_SORT_OPTIONS.find((o) => o.key === sort);
  if (match) return match.label;
  return 'Sort';
}
