import { colors } from '@/constants/Colors';

const LOW_STOCK_THRESHOLD = 5;

export type StockLevel = 'ok' | 'low' | 'out';

export function getStockLevel(stock: number, inStock?: boolean): StockLevel {
  if (inStock === false || stock <= 0) return 'out';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'ok';
}

export function stockPillColors(level: StockLevel) {
  switch (level) {
    case 'out':
      return { bg: '#FFEBEE', text: colors.error };
    case 'low':
      return { bg: '#FFF3E0', text: colors.warning };
    default:
      return { bg: '#E8F5E9', text: colors.success };
  }
}
