import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

type Props = {
  placeholder?: string;
  onPress?: () => void;
  editable?: boolean;
  value?: string;
  onChangeText?: (t: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function SearchBar({
  placeholder = 'Search any product',
  onPress,
  editable,
  value,
  onChangeText,
  style,
}: Props) {
  if (onPress && !editable) {
    return (
      <Pressable onPress={onPress} style={[styles.wrap, style]}>
        <Ionicons name="search" size={20} color={colors.mediumGray} />
        <TextInput
          pointerEvents="none"
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.mediumGray}
          editable={false}
          value={value}
        />
      </Pressable>
    );
  }

  return (
    <View style={[styles.wrap, style]}>
      <Ionicons name="search" size={20} color={colors.mediumGray} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.mediumGray}
        editable={editable !== false}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  input: { flex: 1, fontSize: 15, color: colors.darkGray },
});
