import { StyleSheet, View } from 'react-native';
import {
  BrowseSectionLayout,
  type BrowseShowMoreConfig,
} from '@/components/browse/BrowseSectionLayout';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { useBrowsePreview } from '@/hooks/useBrowsePreview';
import type { CategoryRow } from '@/services/category.service';

const DEFAULT_PREVIEW = 9;

type Props = {
  title?: string;
  categories?: CategoryRow[];
  loading?: boolean;
  previewCount?: number;
  showMore?: BrowseShowMoreConfig;
  onCategoryPress: (category: string) => void;
};

export function CategoryBrowseSection({
  title = 'Shop by category',
  categories,
  loading,
  previewCount = DEFAULT_PREVIEW,
  showMore = { mode: 'expand' },
  onCategoryPress,
}: Props) {
  const items = categories ?? [];
  const { displayItems, expanded, expand } = useBrowsePreview(
    items,
    previewCount,
    showMore
  );

  return (
    <BrowseSectionLayout
      title={title}
      loading={loading}
      totalCount={items.length}
      previewCount={previewCount}
      expanded={expanded}
      showMore={showMore}
      onExpand={expand}>
      <View style={styles.grid}>
        {displayItems.map((c) => (
          <CategoryCard
            key={c.category}
            title={c.category}
            image={c.image}
            onPress={() => onCategoryPress(c.category)}
          />
        ))}
      </View>
    </BrowseSectionLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
