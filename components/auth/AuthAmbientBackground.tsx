import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';

function SoftOrb({
  size,
  color,
  style,
  duration,
  maxOpacity,
}: {
  size: number;
  color: string;
  style: object;
  duration: number;
  maxOpacity: number;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [duration, t]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: maxOpacity * 0.3 + t.value * maxOpacity * 0.7,
    transform: [
      { scale: 0.88 + t.value * 0.16 },
      { translateY: (t.value - 0.5) * 28 },
      { translateX: (t.value - 0.5) * 16 },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
        animatedStyle,
      ]}
    />
  );
}

export function AuthAmbientBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.base} />
      <View style={styles.baseTint} />
      <SoftOrb
        size={280}
        color={colors.primary}
        duration={4500}
        maxOpacity={0.30}
        style={{ top: '-8%', left: '-26%' }}
      />
      <SoftOrb
        size={220}
        color={colors.primaryDark}
        duration={5600}
        maxOpacity={0.25}
        style={{ top: '36%', right: '-30%' }}
      />
      <SoftOrb
        size={180}
        color="#B0BEC5"
        duration={4000}
        maxOpacity={0.30}
        style={{ bottom: '6%', left: '4%' }}
      />
      <SoftOrb
        size={140}
        color={colors.primaryTint}
        duration={3400}
        maxOpacity={0.22}
        style={{ top: '16%', right: '6%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F4F5F8',
  },
  baseTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  orb: {
    position: 'absolute',
  },
});
