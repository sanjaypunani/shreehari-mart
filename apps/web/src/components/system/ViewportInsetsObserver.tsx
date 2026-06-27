'use client';

import { useEffect } from 'react';

const KEYBOARD_OPEN_THRESHOLD = 120;

export function ViewportInsetsObserver() {
  useEffect(() => {
    const root = document.documentElement;
    let rafId: number | null = null;
    const zoomHotkeys = new Set(['+', '-', '=', '0']);

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
    const preventGestureZoom = (event: Event) => {
      event.preventDefault();
    };
    const preventPinchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };
    const preventWheelZoom = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };
    const preventKeyboardZoom = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && zoomHotkeys.has(event.key)) {
        event.preventDefault();
      }
    };

    updateViewportInsets();

    window.addEventListener('resize', requestUpdate);
    window.addEventListener('orientationchange', requestUpdate);
    document.addEventListener('gesturestart', preventGestureZoom, {
      passive: false,
    } as AddEventListenerOptions);
    document.addEventListener('gesturechange', preventGestureZoom, {
      passive: false,
    } as AddEventListenerOptions);
    document.addEventListener('touchmove', preventPinchZoom, {
      passive: false,
    });
    window.addEventListener('wheel', preventWheelZoom, { passive: false });
    window.addEventListener('keydown', preventKeyboardZoom);
    window.visualViewport?.addEventListener('resize', requestUpdate);
    window.visualViewport?.addEventListener('scroll', requestUpdate);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('orientationchange', requestUpdate);
      document.removeEventListener('gesturestart', preventGestureZoom);
      document.removeEventListener('gesturechange', preventGestureZoom);
      document.removeEventListener('touchmove', preventPinchZoom);
      window.removeEventListener('wheel', preventWheelZoom);
      window.removeEventListener('keydown', preventKeyboardZoom);
      window.visualViewport?.removeEventListener('resize', requestUpdate);
      window.visualViewport?.removeEventListener('scroll', requestUpdate);
    };
  }, []);

  return null;
}
