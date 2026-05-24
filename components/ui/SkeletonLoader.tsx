import {
  type DimensionValue,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS } from '@/constants/theme';

type Props = {
  height?: number;
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBox({ height = 16, width = '100%', style }: Props) {
  return <View style={[styles.box, { height, width }, style]} />;
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.lightGray,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
});
