import { useMemo, useState } from 'react';
import type { BrowseShowMoreConfig } from '@/components/browse/BrowseSectionLayout';

export function useBrowsePreview<T>(
  items: T[],
  previewCount: number,
  showMore: BrowseShowMoreConfig
) {
  const [expanded, setExpanded] = useState(false);

  const displayItems = useMemo(() => {
    if (showMore.mode === 'navigate') {
      return items.slice(0, previewCount);
    }
    if (expanded) return items;
    return items.slice(0, previewCount);
  }, [items, previewCount, showMore.mode, expanded]);

  return {
    displayItems,
    expanded: showMore.mode === 'expand' && expanded,
    expand: () => setExpanded(true),
  };
}
