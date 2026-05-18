import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { authCardEnter } from '@/components/auth/authAnimations';
import { AuthGlassCard } from '@/components/auth/AuthGlassCard';
import { AuthPasswordInput } from '@/components/auth/AuthPasswordInput';
import { AuthTextInput } from '@/components/auth/AuthTextInput';
import { useAuthScrollOnFocus } from '@/components/auth/AuthScrollContext';
import { Button } from '@/components/ui/Button';
import { SPACING } from '@/constants/theme';

type Props<T extends FieldValues> = {
  control: Control<T>;
  phoneName: Path<T>;
  passwordName: Path<T>;
  submitLabel: string;
  onSubmit: () => void;
  loading?: boolean;
  phonePlaceholder?: string;
};

export function AuthPhonePasswordForm<T extends FieldValues>({
  control,
  phoneName,
  passwordName,
  submitLabel,
  onSubmit,
  loading,
  phonePlaceholder = '10-digit mobile number',
}: Props<T>) {
  const scrollForPassword = useAuthScrollOnFocus(80);

  return (
    <Animated.View entering={authCardEnter}>
      <AuthGlassCard>
        <View style={{ marginTop: -SPACING.sm }}>
          <Controller
            control={control}
            name={phoneName}
            render={({ field, fieldState }) => (
              <AuthTextInput
                label="Phone number"
                value={field.value as string}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder={phonePlaceholder}
                keyboardType="phone-pad"
                maxLength={14}
                autoCapitalize="none"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={passwordName}
            render={({ field, fieldState }) => (
              <AuthPasswordInput
                label="Password"
                value={field.value as string}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                onFocus={scrollForPassword}
                autoComplete="password"
                textContentType="password"
                error={fieldState.error?.message}
              />
            )}
          />

          <View style={{ marginTop: 8 }}>
            <Button title={submitLabel} onPress={onSubmit} loading={loading} />
          </View>
        </View>
      </AuthGlassCard>
    </Animated.View>
  );
}
