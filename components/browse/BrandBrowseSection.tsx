import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  BrowseSectionLayout,
  type BrowseShowMoreConfig,
} from '@/components/browse/BrowseSectionLayout';
import { BrandCard } from '@/components/ui/BrandCard';
import { SPACING } from '@/constants/theme';
import { useBrowsePreview } from '@/hooks/useBrowsePreview';
import { normalizeBrand } from '@/utils/brand';

const DEFAULT_PREVIEW = 12;

type Props = {
  title?: string;
  brands?: string[];
  loading?: boolean;
  previewCount?: number;
  showMore?: BrowseShowMoreConfig;
  onBrandPress: (brand: string) => void;
};

export function BrandBrowseSection({
  title = 'Shop by brand',
  brands,
  loading,
  previewCount = DEFAULT_PREVIEW,
  showMore = { mode: 'expand' },
  onBrandPress,
}: Props) {
  const names = useMemo(
    () => (brands ?? []).map((b) => normalizeBrand(b)),
    [brands]
  );

  const { displayItems, expanded, expand } = useBrowsePreview(
    names,
    previewCount,
    showMore
  );

  return (
    <BrowseSectionLayout
      title={title}
      loading={loading}
      totalCount={names.length}
      previewCount={previewCount}
      expanded={expanded}
      showMore={showMore}
      onExpand={expand}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {displayItems.map((name) => (
          <BrandCard key={name} name={name} onPress={() => onBrandPress(name)} />
        ))}
      </ScrollView>
    </BrowseSectionLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: SPACING.xs },
});
