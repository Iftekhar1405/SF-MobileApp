import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '@/types/models';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { mediaUrl } from '@/services/api';
import { formatSearchResultLine, optionCount } from '@/utils/productOptions';

type Props = {
  product: Product;
  onPress: () => void;
  onOpenOptions: () => void;
  onAddToCart: () => void;
};

export function SearchResultRow({
  product,
  onPress,
  onOpenOptions,
  onAddToCart,
}: Props) {
  const img = mediaUrl(product.images?.[0]);
  const title = formatSearchResultLine(product);
  const multiOptions = optionCount(product) > 1;
  const [addedNotice, setAddedNotice] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCartPress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.86,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 220,
        useNativeDriver: true,
      }),
    ]).start();
    onAddToCart();
    setAddedNotice(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setAddedNotice(false), 2200);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.main, pressed && styles.mainPressed]}>
          <Image
            source={img ? { uri: img } : undefined}
            style={styles.thumb}
            contentFit="contain"
          />
          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={3}>
              {title}
            </Text>
            {product.price != null ? (
              <Text style={styles.price}>
                ₹{' '}
                {product.price.toLocaleString('en-IN', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </Text>
            ) : null}
          </View>
        </Pressable>

        {multiOptions ? (
          <Pressable
            onPress={onOpenOptions}
            hitSlop={8}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconPressed]}>
            <Ionicons name="options-outline" size={22} color={colors.darkGray} />
          </Pressable>
        ) : (
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
              onPress={handleCartPress}
              hitSlop={8}
              style={({ pressed }) => [
                styles.iconBtn,
                styles.iconBtnCart,
                pressed && styles.iconPressed,
              ]}>
              <Ionicons name="cart-outline" size={22} color={colors.primary} />
            </Pressable>
          </Animated.View>
        )}
      </View>

      {addedNotice ? (
        <Text style={styles.addedNotice}>Quantity added</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minWidth: 0,
  },
  mainPressed: { opacity: 0.88 },
  thumb: {
    width: 56,
    height: 56,
    backgroundColor: colors.offWhite,
    borderRadius: RADIUS.sm,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 18,
  },
  price: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnCart: {
    backgroundColor: colors.primaryTint,
  },
  iconPressed: { opacity: 0.75 },
  addedNotice: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
});
