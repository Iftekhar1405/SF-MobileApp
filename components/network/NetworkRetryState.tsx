import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';
import { getNetworkErrorMessage, isNetworkError } from '@/utils/networkError';

type Props = {
  error?: unknown;
  onRetry: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
};

export function NetworkRetryState({
  error,
  onRetry,
  loading,
  title,
  message,
}: Props) {
  const networkIssue = isNetworkError(error);

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons
          name={networkIssue ? 'cloud-offline-outline' : 'alert-circle-outline'}
          size={36}
          color={networkIssue ? colors.warning : colors.error}
        />
      </View>
      <Text style={styles.title}>
        {title ?? (networkIssue ? 'You are offline' : 'Could not load data')}
      </Text>
      <Text style={styles.message}>
        {message ?? getNetworkErrorMessage(error)}
      </Text>
      <Button
        title="Retry"
        onPress={onRetry}
        loading={loading}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: colors.offWhite,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.darkGray,
    textAlign: 'center',
  },
  message: {
    marginTop: SPACING.sm,
    color: colors.mediumGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: SPACING.lg,
    alignSelf: 'stretch',
  },
});
