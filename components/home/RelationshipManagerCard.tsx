import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { RELATIONSHIP_MANAGER } from '@/constants/support';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { openPhoneDialer } from '@/utils/openPhone';
import { openWhatsAppChat } from '@/utils/openWhatsApp';

export function RelationshipManagerCard() {
  const { label, phoneE164, phoneDisplay } = RELATIONSHIP_MANAGER;

  const onCall = async () => {
    try {
      await openPhoneDialer(phoneE164);
    } catch {
      Alert.alert('Unable to call', `Dial ${phoneDisplay} from your phone app.`);
    }
  };

  const onWhatsApp = async () => {
    try {
      await openWhatsAppChat(phoneE164, 'Hello, I need assistance with my order.');
    } catch {
      Alert.alert('WhatsApp unavailable', `Message us at ${phoneDisplay}.`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.phone}>{phoneDisplay}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={onWhatsApp}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Open WhatsApp">
          <Ionicons name="logo-whatsapp" size={22} color={colors.darkGray} />
        </Pressable>
        <Pressable
          onPress={onCall}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Call">
          <Ionicons name="call-outline" size={22} color={colors.darkGray} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  body: { flex: 1, minWidth: 0 },
  label: {
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '600',
  },
  phone: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '800',
    color: colors.darkGray,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  pressed: { opacity: 0.85 },
});
