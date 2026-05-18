import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { z } from 'zod';
import { authFooterEnter } from '@/components/auth/authAnimations';
import { AuthBrandHeader } from '@/components/auth/AuthBrandHeader';
import { AuthErrorBanner } from '@/components/auth/AuthErrorBanner';
import { AuthScreenShell } from '@/components/auth/AuthScreenShell';
import { AuthSignUpForm } from '@/components/auth/AuthSignUpForm';
import { authFormStyles as styles } from '@/components/auth/authFormStyles';
import { registerRequest } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import {
  isValidIndianPhone,
  normalizeIndianPhone,
} from '@/utils/validateIndianPhone';

const schema = z
  .object({
    name: z.string().min(3, 'Full name must be at least 3 characters'),
    phone: z
      .string()
      .min(10, 'Enter a valid mobile number')
      .refine(isValidIndianPhone, 'Enter a valid 10-digit Indian mobile'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Form = z.infer<typeof schema>;

export default function SignUpScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [err, setErr] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setErr(null);
    const phone = normalizeIndianPhone(values.phone);
    try {
      await registerRequest({
        phone,
        password: values.password,
        name: values.name.trim(),
      });
      await login(phone, values.password);
      router.replace('/(tabs)/home');
    } catch (e: unknown) {
      setErr(getApiErrorMessage(e, 'Could not create account'));
    }
  });

  return (
    <AuthScreenShell centered>
      <AuthBrandHeader subtitle="Create your dealer account" />

      {err ? <AuthErrorBanner message={err} /> : null}

      <AuthSignUpForm
        control={control}
        submitLabel="Create account"
        onSubmit={onSubmit}
        loading={formState.isSubmitting}
      />

      <Animated.View entering={authFooterEnter}>
        <Pressable onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.footerLink}>Already have an account? Sign in</Text>
        </Pressable>
      </Animated.View>
    </AuthScreenShell>
  );
}
