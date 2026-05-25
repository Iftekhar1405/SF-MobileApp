import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import type { Promotion } from '@/types/models';

const FALLBACK_PROMOTION_IMAGE = require('@/assets/images/mens_banner.png');
const AUTO_ADVANCE_MS = 5000;
const TRANSITION_MS = 650;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Props = {
  promotions?: Promotion[];
  height?: number;
  autoAdvanceMs?: number;
};

export function PromotionCarousel({
  promotions = [],
  height = 160,
  autoAdvanceMs = AUTO_ADVANCE_MS,
}: Props) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const animationFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(
    null
  );
  const scrollOffsetRef = useRef(0);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const slides =
    promotions.length > 0
      ? promotions
      : [{ _id: 'fallback-promotion', imageUrl: '', title: 'Promotion' }];

  const cancelTransition = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    activeIndexRef.current = 0;
    scrollOffsetRef.current = 0;
    setActiveIndex(0);
    cancelTransition();
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [cancelTransition, slides.length, width]);

  useEffect(() => cancelTransition, [cancelTransition]);

  const animateToSlide = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      const next = Math.max(0, Math.min(index, slides.length - 1));
      const from = scrollOffsetRef.current;
      const to = next * width;
      const start = Date.now();

      activeIndexRef.current = next;
      setActiveIndex(next);
      cancelTransition();

      const step = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(1, elapsed / TRANSITION_MS);
        const eased = easeInOutCubic(progress);
        const x = from + (to - from) * eased;

        scrollOffsetRef.current = x;
        scrollRef.current?.scrollTo({ x, animated: false });

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          animationFrameRef.current = null;
          scrollOffsetRef.current = to;
          scrollRef.current?.scrollTo({ x: to, animated: false });
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    },
    [cancelTransition, slides.length, width]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      animateToSlide((activeIndexRef.current + 1) % slides.length);
    }, autoAdvanceMs);
    return () => clearInterval(timer);
  }, [animateToSlide, autoAdvanceMs, slides.length]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    const safeNext = Math.max(0, Math.min(next, slides.length - 1));
    activeIndexRef.current = safeNext;
    scrollOffsetRef.current = safeNext * width;
    setActiveIndex(safeNext);
    cancelTransition();
  };

  const goToSlide = (index: number) => {
    animateToSlide(index);
  };

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={cancelTransition}
        onMomentumScrollEnd={onScrollEnd}
        style={styles.bannerScroll}>
        {slides.map((slide) => (
          <Image
            key={slide._id}
            source={
              slide.imageUrl ? { uri: slide.imageUrl } : FALLBACK_PROMOTION_IMAGE
            }
            style={[styles.banner, { width, height }]}
            contentFit="cover"
          />
        ))}
      </ScrollView>
      {slides.length > 1 ? (
        <View style={styles.dots}>
          {slides.map((slide, index) => (
            <Pressable
              key={slide._id}
              hitSlop={8}
              onPress={() => goToSlide(index)}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      ) : (
        <View style={styles.singleDotSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SPACING.lg,
  },
  bannerScroll: {
    marginHorizontal: -SPACING.md,
  },
  banner: {
    borderRadius: RADIUS.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
  },
  dotActive: { backgroundColor: colors.primary },
  singleDotSpacer: { height: SPACING.sm },
});
