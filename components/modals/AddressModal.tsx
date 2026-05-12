import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/constants/Colors';

type Props = { visible: boolean; onClose: () => void };

export function AddressModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Delivery address</Text>
          <TextInput
            placeholder="Address (local-only until API exists)"
            style={styles.input}
            multiline
          />
          <Pressable onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={styles.link}>Save & close</Text>
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
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  link: { color: colors.primary, fontWeight: '800' },
});
