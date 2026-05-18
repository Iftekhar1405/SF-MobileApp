import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';
import { authFormStyles as styles } from '@/components/auth/authFormStyles';
import { colors } from '@/constants/colors';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function AuthTextInput({ label, error, style, ...rest }: Props) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        style={[local.input, error && styles.inputErr, style]}
        placeholderTextColor={colors.mediumGray}
      />
      {error ? <Text style={styles.fieldErr}>{error}</Text> : null}
    </>
  );
}

const local = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    marginBottom: 12,
    fontSize: 16,
    color: colors.darkGray,
  },
});
