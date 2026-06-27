'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const SPLASH_SEEN_KEY = 'cropzo:splash-seen';

/**
 * First-visit gate. On the very first visit (when the localStorage flag is
 * absent) we redirect to /splash. The splash screen itself sets the flag
 * once the user taps "Start shopping" or "Sign in".
 */
export function FirstVisitSplashGate() {
  const router = useRouter();

  React.useEffect(() => {
    try {
      if (!window.localStorage.getItem(SPLASH_SEEN_KEY)) {
        router.replace('/splash');
      }
    } catch {
      // localStorage unavailable — skip the gate, behave as returning user.
    }
  }, [router]);

  return null;
}
