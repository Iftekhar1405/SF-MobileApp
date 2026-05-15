import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS } from '@/constants/theme';

type Props = { height?: number; style?: object };

export function SkeletonBox({ height = 16, style }: Props) {
  return <View style={[styles.box, { height }, style]} />;
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.lightGray,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
});
