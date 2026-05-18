import { createContext, useContext, type RefObject } from 'react';
import type { ScrollView } from 'react-native';

export const AuthScrollContext = createContext<RefObject<ScrollView | null> | null>(
  null
);

/** Scrolls the auth screen so lower fields stay visible above the keyboard. */
export function useAuthScrollOnFocus(offsetY = 160) {
  const scrollRef = useContext(AuthScrollContext);

  return () => {
    requestAnimationFrame(() => {
      scrollRef?.current?.scrollTo({ y: offsetY, animated: true });
    });
  };
}
