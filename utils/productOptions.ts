import type { Product } from '@/types/models';

export type ProductOptionRow = {
  optionId: string;
  color: string;
  size: string;
  lengths: number;
  sku: string;
  inStock: boolean;
};

function colorInStock(product: Product, color: string): boolean {
  const row = product.colorsStock?.find((c) => c.color === color);
  if (row) return row.inStock !== false;
  return product.inStock !== false;
}

export function expandProductOptions(product: Product): ProductOptionRow[] {
  const colorsMap = product.colors ?? {};
  const colorKeys = Object.keys(colorsMap);
  const sets = product.itemSet ?? [];
  if (!sets.length || !colorKeys.length) return [];
  const rows: ProductOptionRow[] = [];
  for (const color of colorKeys) {
    for (const set of sets) {
      const optionId = `${color}::${set.size}`;
      rows.push({
        optionId,
        color,
        size: set.size,
        lengths: set.lengths,
        sku: product.article ? `${product.article}-${color}-${set.size}` : optionId,
        inStock: colorInStock(product, color),
      });
    }
  }
  return rows;
}

export function optionCount(product: Product): number {
  return expandProductOptions(product).length;
}

export function estimateStockUnits(product: Product): number {
  const colorsMap = product.colors ?? {};
  return Object.keys(colorsMap).length * (product.itemSet?.length ?? 1) * 10;
}
