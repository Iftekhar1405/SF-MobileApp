import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import type { User } from '@/types/models';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { isProfileComplete } from '@/utils/profileComplete';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  shopName: z.string().min(1, 'Shop name is required'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address is too long'),
});

type Form = z.infer<typeof schema>;

type Props = {
  profile: User | null;
};

export function DealerProfileCard({ profile }: Props) {
  const complete = isProfileComplete(profile);
  const [editing, setEditing] = useState(!complete);
  const updateMut = useUpdateProfile();
  const [err, setErr] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name ?? '',
      shopName: profile?.shopName ?? '',
      address: profile?.address ?? '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        shopName: profile.shopName ?? '',
        address: profile.address ?? '',
      });
      if (!isProfileComplete(profile)) setEditing(true);
    }
  }, [profile, reset]);

  const openEdit = () => {
    reset({
      name: profile?.name ?? '',
      shopName: profile?.shopName ?? '',
      address: profile?.address ?? '',
    });
    setEditing(true);
    setErr(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    setErr(null);
    try {
      await updateMut.mutateAsync({
        name: values.name.trim(),
        shopName: values.shopName.trim(),
        address: values.address.trim(),
      });
      setEditing(false);
    } catch (e: unknown) {
      setErr(getApiErrorMessage(e, 'Could not save profile'));
    }
  });

  if (!editing && complete && profile) {
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile.shopName || profile.name).charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.cardHead}>
            <Text style={styles.shopName}>{profile.shopName}</Text>
            <Text style={styles.ownerName}>{profile.name}</Text>
          </View>
          <Pressable onPress={openEdit} hitSlop={8} style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <Ionicons name="call-outline" size={16} color={colors.mediumGray} />
          <Text style={styles.metaText}>+91 {profile.phone}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={16} color={colors.mediumGray} />
          <Text style={styles.metaText}>{profile.address}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.promptHeader}>
        <View style={styles.promptIcon}>
          <Ionicons name="storefront-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.promptText}>
          <Text style={styles.promptTitle}>Complete your profile</Text>
          <Text style={styles.promptSub}>
            Add your shop details to personalize orders and checkout.
          </Text>
        </View>
      </View>

      {err ? <Text style={styles.err}>{err}</Text> : null}

      <Text style={styles.label}>Your name</Text>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              style={[styles.input, fieldState.error && styles.inputErr]}
              placeholder="Full name"
              autoCapitalize="words"
            />
            {fieldState.error ? (
              <Text style={styles.fieldErr}>{fieldState.error.message}</Text>
            ) : null}
          </>
        )}
      />

      <Text style={styles.label}>Shop name</Text>
      <Controller
        control={control}
        name="shopName"
        render={({ field, fieldState }) => (
          <>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              style={[styles.input, fieldState.error && styles.inputErr]}
              placeholder="M/S shop name"
              autoCapitalize="words"
            />
            {fieldState.error ? (
              <Text style={styles.fieldErr}>{fieldState.error.message}</Text>
            ) : null}
          </>
        )}
      />

      <Text style={styles.label}>Address</Text>
      <Controller
        control={control}
        name="address"
        render={({ field, fieldState }) => (
          <>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              style={[
                styles.input,
                styles.inputMultiline,
                fieldState.error && styles.inputErr,
              ]}
              placeholder="Delivery / shop address"
              multiline
              maxLength={200}
            />
            {fieldState.error ? (
              <Text style={styles.fieldErr}>{fieldState.error.message}</Text>
            ) : null}
          </>
        )}
      />

      <Button
        title="Save profile"
        onPress={onSubmit}
        loading={updateMut.isPending || formState.isSubmitting}
      />

      {complete ? (
        <Pressable onPress={() => setEditing(false)} style={styles.cancelWrap}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  cardHead: { flex: 1, minWidth: 0 },
  shopName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.darkGray,
  },
  ownerName: {
    marginTop: 2,
    fontSize: 13,
    color: colors.mediumGray,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightGray,
    marginVertical: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  metaText: {
    flex: 1,
    fontSize: 13,
    color: colors.darkGray,
    lineHeight: 20,
  },
  promptHeader: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  promptIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: { flex: 1 },
  promptTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.darkGray,
  },
  promptSub: {
    marginTop: 4,
    fontSize: 13,
    color: colors.mediumGray,
    lineHeight: 18,
  },
  label: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: SPACING.xs,
    color: colors.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    backgroundColor: colors.offWhite,
    marginBottom: SPACING.sm,
    fontSize: 15,
    color: colors.darkGray,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top' },
  inputErr: { borderColor: colors.error },
  fieldErr: { color: colors.error, marginBottom: SPACING.sm, fontSize: 12 },
  err: { color: colors.error, marginBottom: SPACING.sm, fontSize: 13 },
  cancelWrap: { marginTop: SPACING.sm, alignItems: 'center' },
  cancel: { color: colors.mediumGray, fontWeight: '600' },
});
