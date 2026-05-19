import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import type { User } from '@/types/models';
import type { DeliveryFormValues } from '@/utils/deliveryAddress';

type Props = {
  profile: User | null | undefined;
  delivery: DeliveryFormValues;
};

export function DeliveryAddressSummary({ profile, delivery }: Props) {
  const hasLines =
    delivery.deliveryAddress.length > 0 || delivery.pincode.length > 0;

  if (!hasLines) {
    return (
      <Text style={styles.hint}>
        Enter delivery address and pincode below.
      </Text>
    );
  }

  return (
    <View style={styles.wrap}>
      {profile?.name ? (
        <View style={styles.row}>
          <Ionicons name="person-outline" size={15} color={colors.mediumGray} />
          <Text style={styles.text}>{profile.name}</Text>
        </View>
      ) : null}
      {profile?.phone ? (
        <View style={styles.row}>
          <Ionicons name="call-outline" size={15} color={colors.mediumGray} />
          <Text style={styles.text}>+91 {profile.phone}</Text>
        </View>
      ) : null}
      <View style={styles.row}>
        <Ionicons name="location-outline" size={15} color={colors.mediumGray} />
        <Text style={styles.text}>{delivery.deliveryAddress}</Text>
      </View>
      {delivery.pincode ? (
        <Text style={styles.sub}>Pincode: {delivery.pincode}</Text>
      ) : null}
      {delivery.landmark ? (
        <Text style={styles.sub}>Landmark: {delivery.landmark}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  text: {
    flex: 1,
    color: colors.mediumGray,
    fontSize: 13,
    lineHeight: 18,
  },
  sub: {
    marginLeft: 23,
    color: colors.mediumGray,
    fontSize: 13,
    lineHeight: 18,
  },
  hint: {
    flex: 1,
    color: colors.mediumGray,
    fontSize: 13,
    lineHeight: 18,
  },
});
