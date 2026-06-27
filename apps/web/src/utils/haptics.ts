/**
 * Lightweight haptic helper.
 *
 * Uses the Vibration API where available (Android Chrome / Firefox).
 * iOS Safari ignores `navigator.vibrate` — there is no public web haptic API
 * on iOS yet — so this becomes a silent no-op there.
 */

export type HapticIntensity = 'light' | 'medium' | 'heavy' | 'selection';

const DURATION: Record<HapticIntensity, number | number[]> = {
  selection: 8,
  light: 12,
  medium: 22,
  heavy: 32,
};

export const triggerHaptic = (intensity: HapticIntensity = 'selection') => {
  if (typeof window === 'undefined') return;
  const navigatorAny = window.navigator as Navigator & {
    vibrate?: (pattern: number | number[]) => boolean;
  };
  if (typeof navigatorAny.vibrate !== 'function') return;
  try {
    navigatorAny.vibrate(DURATION[intensity]);
  } catch {
    // ignore — vibrate can throw on locked-down environments
  }
};
