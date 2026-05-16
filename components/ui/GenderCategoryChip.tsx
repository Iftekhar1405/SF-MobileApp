import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

const IMAGE_SIZE = 56;

type Props = {
  label: string;
  image: ImageSource;
  active?: boolean;
  accentColor?: string;
  onPress: () => void;
};

export function GenderCategoryChip({
  label,
  image,
  active,
  accentColor = colors.primary,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}>
      <View style={[styles.imageWrap, active && { borderColor: accentColor }]}>
        <Image source={image} style={styles.image} contentFit="cover" />
      </View>
      <Text
        style={[styles.label, active && styles.labelActive]}
        numberOfLines={2}>
        {label}
      </Text>
      <View
        style={[
          styles.underline,
          active
            ? { backgroundColor: accentColor, opacity: 1 }
            : styles.underlineHidden,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 72,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  chipPressed: { opacity: 0.88 },
  imageWrap: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.offWhite,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    marginTop: SPACING.xs,
    fontSize: 10,
    fontWeight: '600',
    color: colors.mediumGray,
    textAlign: 'center',
    lineHeight: 13,
    minHeight: 26,
  },
  labelActive: {
    color: colors.darkGray,
    fontWeight: '800',
  },
  underline: {
    marginTop: 4,
    height: 2,
    width: '70%',
    borderRadius: RADIUS.pill,
  },
  underlineHidden: {
    opacity: 0,
  },
});
