import { create } from 'zustand';

/** Reserved for optimistic UI; server cart remains source of truth via React Query */
export const useCartStore = create(() => ({}));
