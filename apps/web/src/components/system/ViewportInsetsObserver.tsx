'use client';

import { useEffect } from 'react';

const KEYBOARD_OPEN_THRESHOLD = 120;

export function ViewportInsetsObserver() {
  useEffect(() => {
    const root = document.documentElement;
    let rafId: number | null = null;

    const updateViewportInsets = () => {
      const visualViewport = window.visualViewport;
      const layoutViewportHeight = window.innerHeight;
      const visualViewportHeight = visualViewport?.height ?? layoutViewportHeight;
      const visualViewportOffsetTop = visualViewport?.offsetTop ?? 0;

      const overlap = Math.max(
        0,
        layoutViewportHeight - (visualViewportHeight + visualViewportOffsetTop)
      );

      const keyboardInset =
        overlap > KEYBOARD_OPEN_THRESHOLD ? Math.round(overlap) : 0;

      root.style.setProperty(
        '--app-viewport-height',
        `${Math.round(visualViewportHeight)}px`
      );
      root.style.setProperty('--keyboard-inset-height', `${keyboardInset}px`);
    };

    const requestUpdate = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(updateViewportInsets);
    };

    updateViewportInsets();

    window.addEventListener('resize', requestUpdate);
    window.addEventListener('orientationchange', requestUpdate);
    window.visualViewport?.addEventListener('resize', requestUpdate);
    window.visualViewport?.addEventListener('scroll', requestUpdate);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('orientationchange', requestUpdate);
      window.visualViewport?.removeEventListener('resize', requestUpdate);
      window.visualViewport?.removeEventListener('scroll', requestUpdate);
    };
  }, []);

  return null;
}
