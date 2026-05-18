import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SHADOW, SPACING } from '@/constants/theme';
import { mediaUrl } from '@/services/api';

type Props = { title: string; image?: string; onPress: () => void };

export function CategoryCard({ title, image, onPress }: Props) {
  const uri = mediaUrl(image);
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image
        source={uri ? { uri } : undefined}
        style={styles.img}
        contentFit="contain"
      />
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    paddingBottom: SPACING.md,
    ...SHADOW.card,
    width: '31%',
    marginBottom: SPACING.md,
  },
  img: { width: '100%', aspectRatio: 1, backgroundColor: colors.white },
  title: {
    marginTop: SPACING.sm,
    fontSize: 11,
    fontWeight: '700',
    color: colors.darkGray,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    lineHeight: 14,
  },
});
