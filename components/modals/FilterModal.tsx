import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/Colors';

type Props = { visible: boolean; onClose: () => void };

export function FilterModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Filters</Text>
          <Text style={styles.body}>Advanced filters coming soon.</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.link}>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: { fontWeight: '900', fontSize: 16, marginBottom: 8 },
  body: { color: colors.mediumGray, marginBottom: 16 },
  link: { color: colors.primary, fontWeight: '800' },
});
