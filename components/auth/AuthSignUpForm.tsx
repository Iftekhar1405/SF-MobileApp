import { Controller, type Control } from 'react-hook-form';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { authCardEnter } from '@/components/auth/authAnimations';
import { AuthGlassCard } from '@/components/auth/AuthGlassCard';
import { AuthPasswordInput } from '@/components/auth/AuthPasswordInput';
import { AuthTextInput } from '@/components/auth/AuthTextInput';
import { useAuthScrollOnFocus } from '@/components/auth/AuthScrollContext';
import { Button } from '@/components/ui/Button';
import { SPACING } from '@/constants/theme';

export type SignUpFormValues = {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  control: Control<SignUpFormValues>;
  submitLabel: string;
  onSubmit: () => void;
  loading?: boolean;
};

export function AuthSignUpForm({
  control,
  submitLabel,
  onSubmit,
  loading,
}: Props) {
  const scrollForPassword = useAuthScrollOnFocus(140);
  const scrollForConfirm = useAuthScrollOnFocus(220);

  return (
    <Animated.View entering={authCardEnter}>
      <AuthGlassCard>
        <View style={{ marginTop: -SPACING.sm }}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <AuthTextInput
                label="Full name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Your full name"
                autoCapitalize="words"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <AuthTextInput
                label="Phone number"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={14}
                autoCapitalize="none"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <AuthPasswordInput
                label="Password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                onFocus={scrollForPassword}
                placeholder="At least 6 characters"
                autoComplete="password-new"
                textContentType="newPassword"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <AuthPasswordInput
                label="Confirm password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                onFocus={scrollForConfirm}
                placeholder="Re-enter password"
                autoComplete="password-new"
                textContentType="newPassword"
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
