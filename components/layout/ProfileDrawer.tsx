import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types/models';

type Props = {
  visible: boolean;
  onClose: () => void;
  user: User | null;
};

export function ProfileDrawer({ visible, onClose, user }: Props) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{user?.shopName ?? 'Account'}</Text>
          {user?.phone ? (
            <Text style={styles.meta}>{user.phone}</Text>
          ) : null}
          <Pressable
            style={styles.link}
            onPress={() => {
              onClose();
              router.push('/(tabs)/shop');
            }}>
            <Text style={styles.linkText}>Shop Now</Text>
          </Pressable>
          <Pressable
            style={styles.link}
            onPress={() => {
              onClose();
              router.push('/(tabs)/payment');
            }}>
            <Text style={styles.linkText}>Orders</Text>
          </Pressable>
          <Pressable
            style={styles.logout}
            onPress={async () => {
              await logout();
              onClose();
              router.replace('/(auth)/login');
            }}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    flexDirection: 'row',
  },
  sheet: {
    width: '78%',
    backgroundColor: colors.white,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  title: { fontSize: 18, fontWeight: '800', color: colors.darkGray },
  meta: { color: colors.mediumGray },
  link: { paddingVertical: SPACING.sm },
  linkText: { fontWeight: '700', color: colors.primary },
  logout: { marginTop: SPACING.lg },
  logoutText: { color: colors.error, fontWeight: '700' },
});
