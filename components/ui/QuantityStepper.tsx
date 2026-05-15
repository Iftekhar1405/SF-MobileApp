import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

type Props = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  optionLabel?: string;
  disabled?: boolean;
};

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  optionLabel,
  disabled,
}: Props) {
  return (
    <View style={styles.col}>
      <View style={styles.row}>
        <Pressable
          onPress={onDecrement}
          disabled={disabled}
          style={({ pressed }) => [
            styles.btn,
            pressed && { opacity: 0.7 },
            disabled && { opacity: 0.4 },
          ]}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Text style={styles.value}>{value}</Text>
        <Pressable
          onPress={onIncrement}
          disabled={disabled}
          style={({ pressed }) => [
            styles.btn,
            pressed && { opacity: 0.7 },
            disabled && { opacity: 0.4 },
          ]}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
      {optionLabel ? (
        <Text style={styles.opt}>{optionLabel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  col: { alignItems: 'center', gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  btn: {
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: RADIUS.sm,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  btnText: { color: colors.success, fontSize: 20, fontWeight: '700' },
  value: { minWidth: 28, textAlign: 'center', fontWeight: '700' },
  opt: { color: colors.mediumGray, fontSize: 12 },
});
