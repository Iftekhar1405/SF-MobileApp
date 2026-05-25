export type User = {
  _id: string;
  name: string;
  phone: string;
  shopName: string;
  address?: string;
  deliveryAddress?: string;
  pincode?: string;
  landmark?: string;
  role?: string;
};

export type ItemSet = { size: string; lengths: number };

export type Product = {
  _id: string;
  brand: string;
  article?: string;
  price: number;
  category?: string;
  gender?: string;
  material?: string;
  description?: string;
  inStock?: boolean;
  images: string[];
  itemSet: ItemSet[];
  colors: Record<string, string[]>;
  colorsStock?: { color: string; inStock: boolean }[];
};

export type Promotion = {
  _id: string;
  title?: string;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  _id: string;
  productId: Product | string;
  quantity: number;
  price: number;
  itemSet: ItemSet[];
  color: string;
  createdAt?: string;
};

export type Cart = {
  _id?: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
};

export type Order = {
  _id: string;
  userId: string | User;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  status: string;
  deliveryAddress?: string;
  pincode?: string;
  landmark?: string;
  createdAt?: string;
  updatedAt?: string;
};
