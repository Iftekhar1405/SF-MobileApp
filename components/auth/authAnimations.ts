import { Easing, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

/** Smooth ease-out — no spring bounce */
const easeOut = Easing.out(Easing.cubic);

/** Brand logo */
export const authLogoEnter = FadeInDown.delay(80)
  .duration(550)
  .easing(easeOut);

/** Subtitle under logo */
export const authSubtitleEnter = FadeInDown.delay(280)
  .duration(480)
  .easing(easeOut);

/** Glass form card */
export const authCardEnter = FadeInUp.delay(220)
  .duration(520)
  .easing(easeOut);

/** Staggered form fields */
export function authFieldEnter(index: number) {
  return FadeInDown.delay(340 + index * 70)
    .duration(450)
    .easing(easeOut);
}

/** Footer links */
export const authFooterEnter = FadeInUp.delay(620)
  .duration(480)
  .easing(easeOut);

/** Inline error banner */
export const authErrorEnter = FadeInDown.duration(380).easing(easeOut);

/** Screen-level content fade */
export const authScreenEnter = FadeIn.duration(300).easing(easeOut);
