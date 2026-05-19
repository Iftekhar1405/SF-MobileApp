import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import type { User } from '@/types/models';
import type { DeliveryFormValues } from '@/utils/deliveryAddress';

type Props = {
  profile: User | null | undefined;
  values: DeliveryFormValues;
  onChange: (patch: Partial<DeliveryFormValues>) => void;
};

export function DeliveryAddressFields({ profile, values, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {profile?.name || profile?.phone ? (
        <View style={styles.contact}>
          <Text style={styles.label}>Contact</Text>
          {profile.name ? (
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={16} color={colors.mediumGray} />
              <Text style={styles.metaText}>{profile.name}</Text>
            </View>
          ) : null}
          {profile.phone ? (
            <View style={styles.metaRow}>
              <Ionicons name="call-outline" size={16} color={colors.mediumGray} />
              <Text style={styles.metaText}>+91 {profile.phone}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <Text style={styles.label}>Street address</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="House / shop no., street, area"
        placeholderTextColor={colors.mediumGray}
        value={values.deliveryAddress}
        onChangeText={(deliveryAddress) => onChange({ deliveryAddress })}
        multiline
        maxLength={200}
      />

      <Text style={styles.label}>Pincode</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit pincode"
        placeholderTextColor={colors.mediumGray}
        value={values.pincode}
        onChangeText={(pincode) => onChange({ pincode })}
        keyboardType="number-pad"
        maxLength={6}
      />

      <Text style={styles.label}>Landmark (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Near market, mosque, etc."
        placeholderTextColor={colors.mediumGray}
        value={values.landmark}
        onChangeText={(landmark) => onChange({ landmark })}
        maxLength={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: SPACING.sm },
  contact: {
    gap: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGray,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.mediumGray,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: { color: colors.darkGray, fontSize: 14, flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    backgroundColor: colors.offWhite,
    color: colors.darkGray,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top' },
});
