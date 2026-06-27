'use client';

import { useCallback, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down' | null;

interface ScrollDirectionState {
  /** Current scroll direction – null until the user has scrolled past the threshold. */
  scrollDirection: ScrollDirection;
  /** True when the scroll container is at (or very near) the top. */
  isAtTop: boolean;
}

/**
 * Tracks scroll direction on a given container element.
 *
 * Usage:
 *   const { scrollDirection, isAtTop, scrollRef } = useScrollDirection();
 *   <div ref={scrollRef} style={{ overflowY: 'auto' }}> ... </div>
 *
 * The header / bottom-tabs should be visible when `isAtTop` is true
 * OR `scrollDirection === 'up'`.
 */
export function useScrollDirection(threshold = 10) {
  const [state, setState] = useState<ScrollDirectionState>({
    scrollDirection: null,
    isAtTop: true,
  });

  const lastScrollTop = useRef(0);
  const ticking = useRef(false);

  const scrollRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const handleScroll = () => {
        if (ticking.current) return;
        ticking.current = true;

        requestAnimationFrame(() => {
          const currentScrollTop = node.scrollTop;
          const atTop = currentScrollTop <= 5;

          if (atTop) {
            setState({ scrollDirection: null, isAtTop: true });
          } else {
            const diff = currentScrollTop - lastScrollTop.current;
            if (Math.abs(diff) >= threshold) {
              setState({
                scrollDirection: diff > 0 ? 'down' : 'up',
                isAtTop: false,
              });
            }
          }

          lastScrollTop.current = currentScrollTop;
          ticking.current = false;
        });
      };

      node.addEventListener('scroll', handleScroll, { passive: true });

      // Cleanup: we rely on the ref being stable (callback ref with []).
      // In practice React will not re-call this unless the node changes.
    },
    [threshold]
  );

  return { ...state, scrollRef };
}
