import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { authFormStyles as styles } from '@/components/auth/authFormStyles';
import { colors } from '@/constants/colors';

type Props = Omit<TextInputProps, 'secureTextEntry'> & {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  label: string;
};

export function AuthPasswordInput({
  value,
  onChangeText,
  onBlur,
  error,
  label,
  placeholder = 'Your password',
  ...rest
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[local.row, error && styles.inputErr]}>
        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          style={local.input}
          secureTextEntry={!visible}
          placeholder={placeholder}
          placeholderTextColor={colors.mediumGray}
        />
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={10}
          style={local.eyeBtn}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}>
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.mediumGray}
          />
        </Pressable>
      </View>
      {error ? <Text style={styles.fieldErr}>{error}</Text> : null}
    </>
  );
}

const local = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 8,
    fontSize: 16,
    color: colors.darkGray,
  },
  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
