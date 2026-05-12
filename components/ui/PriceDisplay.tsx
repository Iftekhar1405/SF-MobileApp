import { StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/Colors';

type Props = { amount: number; strikethrough?: number };

export function PriceDisplay({ amount, strikethrough }: Props) {
  const main = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace('₹', '₹ ');
  return (
    <>
      <Text style={styles.price}>{main}</Text>
      {strikethrough != null ? (
        <Text style={styles.mrp}>
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          })
            .format(strikethrough)
            .replace('₹', '₹ ')}
        </Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  price: { color: colors.success, fontWeight: '700', fontSize: 15 },
  mrp: {
    color: colors.mediumGray,
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
});
