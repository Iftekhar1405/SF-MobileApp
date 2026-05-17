import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '@/types/models';

export function useProductOptionsSheet() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [sheetProduct, setSheetProduct] = useState<Product | null>(null);

  const openSheet = useCallback((product: Product) => {
    setSheetProduct(product);
  }, []);

  useEffect(() => {
    if (!sheetProduct) return;
    const id = requestAnimationFrame(() => {
      sheetRef.current?.present();
    });
    return () => cancelAnimationFrame(id);
  }, [sheetProduct]);

  const dismissSheet = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const handleSheetDismiss = useCallback(() => {
    setSheetProduct(null);
  }, []);

  return {
    sheetRef,
    sheetProduct,
    openSheet,
    dismissSheet,
    handleSheetDismiss,
  };
}
