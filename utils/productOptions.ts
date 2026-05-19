import type { CartItem, Product } from '@/types/models';

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

export function isProductInStock(product: Product): boolean {
  if (product.inStock === false) return false;
  if (product.colorsStock?.length) {
    return product.colorsStock.some((c) => c.inStock !== false);
  }
  return true;
}

function formatItemSets(product: Product): string {
  const sets = product.itemSet ?? [];
  if (!sets.length) return '';
  return sets.map((s) => `${s.size}×${s.lengths}`).join(' ');
}

/** Search/list line: article | all colors | item sets */
export function formatSearchResultLine(product: Product): string {
  const article = product.article?.trim() || '—';
  const colorKeys = Object.keys(product.colors ?? {});
  const colorsPart = colorKeys.length > 0 ? colorKeys.join(', ') : '—';
  const itemSets = formatItemSets(product) || '—';
  return `${article} | ${colorsPart} | ${itemSets}`;
}

/** Card title: [Article] [Brand] | [color] [item sets] */
export function formatProductCardName(product: Product): string {
  const article = product.article?.trim() ?? '';
  const brand = product.brand?.trim() ?? '';
  const left = [article, brand].filter(Boolean).join(' ');

  const colorKeys = Object.keys(product.colors ?? {});
  const color = colorKeys[0] ?? '';
  const itemSets = formatItemSets(product);
  const right = [color, itemSets].filter(Boolean).join(' ');

  if (!left && !right) return brand || article || 'Product';
  if (!right) return left;
  if (!left) return right;
  return `${left} | ${right}`;
}

/** Cart / order line: article brand | color size×lengths */
export function formatCartItemLine(
  product: Product,
  item: Pick<CartItem, 'color' | 'itemSet'>
): string {
  const article = product.article?.trim() ?? '';
  const brand = product.brand?.trim() ?? '';
  const left = [article, brand].filter(Boolean).join(' ');
  const set = item.itemSet?.[0];
  const setPart = set ? `${set.size}×${set.lengths}` : '';
  const right = [item.color, setPart].filter(Boolean).join(' ');
  if (!left && !right) return brand || article || 'Product';
  if (!right) return left;
  if (!left) return right;
  return `${left} | ${right}`;
}

export function cartItemImageUri(
  product: Product,
  color: string
): string | undefined {
  const byColor = product.colors?.[color]?.[0];
  return byColor ?? product.images?.[0];
}
