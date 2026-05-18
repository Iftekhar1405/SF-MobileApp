import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SPACING } from '@/constants/theme';
import { ShowMoreButton } from './ShowMoreButton';

export type BrowseShowMoreConfig =
  | { mode: 'expand' }
  | { mode: 'navigate'; onNavigate: () => void };

type Props = {
  title: string;
  loading?: boolean;
  totalCount: number;
  previewCount: number;
  expanded: boolean;
  showMore: BrowseShowMoreConfig;
  onExpand: () => void;
  children: ReactNode;
};

export function BrowseSectionLayout({
  title,
  loading,
  totalCount,
  previewCount,
  expanded,
  showMore,
  onExpand,
  children,
}: Props) {
  const hasMore = totalCount > previewCount;
  const isNavigate = showMore.mode === 'navigate';
  const showButton = isNavigate
    ? totalCount > 0
    : hasMore && !expanded;

  const handleShowMore = () => {
    if (showMore.mode === 'navigate') showMore.onNavigate();
    else onExpand();
  };

  return (
    <View style={styles.section}>
      <SectionHeader
        title={title}
        variant="prominent"
        actionLabel={showButton && isNavigate ? 'See more' : undefined}
        onAction={showButton && isNavigate ? handleShowMore : undefined}
      />
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <>
          {children}
          {showButton && !isNavigate ? (
            <ShowMoreButton onPress={handleShowMore} label="Show more" />
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  loader: { marginVertical: SPACING.md },
});
