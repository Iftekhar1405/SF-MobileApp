import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  cartonInfo: string;
  piecesPerCarton: number;
  quantity: number; // in cartons
  category: string;
  image?: string;
}

export interface MOQWarning {
  categoryName: string;
  minQty: number;
  cartQty: number;
  isViolating: boolean;
}

interface CartStore {
  items: CartItem[];
  totalValue: number;
  totalCartons: number;
  totalPieces: number;
  moqWarnings: MOQWarning[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

// Mock MOQ Rules
const MOQ_RULES: Record<string, number> = {
  'footwear': 5,
  'hawai': 10,
};

const calculateTotals = (items: CartItem[]) => {
  let totalValue = 0;
  let totalCartons = 0;
  let totalPieces = 0;
  
  const categoryCount: Record<string, number> = {};

  items.forEach(item => {
    totalValue += item.price * item.quantity;
    totalCartons += item.quantity;
    totalPieces += item.quantity * item.piecesPerCarton;
    
    categoryCount[item.category] = (categoryCount[item.category] || 0) + item.quantity;
  });

  const moqWarnings: MOQWarning[] = Object.keys(MOQ_RULES).map(cat => ({
    categoryName: cat,
    minQty: MOQ_RULES[cat],
    cartQty: categoryCount[cat] || 0,
    isViolating: (categoryCount[cat] || 0) > 0 && (categoryCount[cat] || 0) < MOQ_RULES[cat]
  })).filter(w => w.cartQty > 0);

  return { totalValue, totalCartons, totalPieces, moqWarnings };
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [
    {
      id: 'c1',
      productId: 'p1',
      productName: 'MEDICARE | BLUE | 8X10',
      sku: '11M456',
      price: 5057.76,
      cartonInfo: '48 Pc in Carton',
      piecesPerCarton: 48,
      quantity: 2,
      category: 'footwear'
    }
  ],
  totalValue: 10115.52,
  totalCartons: 2,
  totalPieces: 96,
  moqWarnings: [
    { categoryName: 'footwear', minQty: 5, cartQty: 2, isViolating: true }
  ],

  addItem: (newItem) => {
    set(state => {
      const newItems = [...state.items, { ...newItem, id: Math.random().toString() }];
      return { items: newItems, ...calculateTotals(newItems) };
    });
  },

  updateQuantity: (itemId, quantity) => {
    set(state => {
      const newItems = state.items.map(item => 
        item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0);
      return { items: newItems, ...calculateTotals(newItems) };
    });
  },

  removeItem: (itemId) => {
    set(state => {
      const newItems = state.items.filter(item => item.id !== itemId);
      return { items: newItems, ...calculateTotals(newItems) };
    });
  },

  clearCart: () => set({ items: [], totalValue: 0, totalCartons: 0, totalPieces: 0, moqWarnings: [] })
}));
