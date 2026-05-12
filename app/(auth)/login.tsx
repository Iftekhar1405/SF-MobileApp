import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';
import { SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

const schema = z.object({
  identifier: z.string().min(3, 'Enter phone or email'),
  password: z.string().min(1, 'Password required'),
});

type Form = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [err, setErr] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setErr(null);
    try {
      console.log("values", values);
      await login(values.identifier.trim(), values.password);
      console.log("login successful");
      router.replace('/(tabs)');
    } catch (e: unknown) {
      console.log("error", e);
      const msg =
        typeof e === 'object' &&
        e &&
        'response' in e &&
        (e as { response?: { data?: { msg?: string } } }).response?.data?.msg;
      setErr(typeof msg === 'string' ? msg : 'Login failed');
    }
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.brand}>
          {process.env.EXPO_PUBLIC_APP_NAME ?? 'Ajanta Shoes'}
        </Text>
        <Text style={styles.tag}>B2B wholesale ordering</Text>

        {err ? <Text style={styles.err}>{err}</Text> : null}

        <Text style={styles.label}>Mobile / Email</Text>
        <Controller
          control={control}
          name="identifier"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                {...field}
                onChangeText={field.onChange}
                style={[
                  styles.input,
                  fieldState.error && styles.inputErr,
                ]}
                autoCapitalize="none"
                keyboardType="default"
                placeholder="Phone or email"
              />
              {fieldState.error ? (
                <Text style={styles.fieldErr}>{fieldState.error.message}</Text>
              ) : null}
            </>
          )}
        />

        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                {...field}
                onChangeText={field.onChange}
                style={[
                  styles.input,
                  fieldState.error && styles.inputErr,
                ]}
                secureTextEntry
                placeholder="Password"
              />
              {fieldState.error ? (
                <Text style={styles.fieldErr}>{fieldState.error.message}</Text>
              ) : null}
            </>
          )}
        />

        <Button
          title="Sign in"
          onPress={onSubmit}
          loading={formState.isSubmitting}
        />

        <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.offWhite },
  container: { flex: 1, padding: SPACING.lg, justifyContent: 'center' },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  tag: {
    textAlign: 'center',
    color: colors.mediumGray,
    marginBottom: SPACING.xl,
  },
  label: { fontWeight: '600', marginBottom: SPACING.xs, color: colors.darkGray },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: SPACING.md,
    backgroundColor: colors.white,
    marginBottom: SPACING.sm,
  },
  inputErr: { borderColor: colors.error },
  fieldErr: { color: colors.error, marginBottom: SPACING.sm, fontSize: 12 },
  err: {
    color: colors.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  forgot: {
    marginTop: SPACING.md,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
  },
});
