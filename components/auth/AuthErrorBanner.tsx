import Animated from 'react-native-reanimated';
import { Text } from 'react-native';
import { authErrorEnter } from '@/components/auth/authAnimations';
import { authFormStyles as styles } from '@/components/auth/authFormStyles';

type Props = {
  message: string;
};

export function AuthErrorBanner({ message }: Props) {
  return (
    <Animated.Text key={message} entering={authErrorEnter} style={styles.err}>
      {message}
    </Animated.Text>
  );
}
