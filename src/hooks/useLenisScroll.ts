import { useEffect } from 'react';
import { useSmoothScroll } from '../components/SmoothScroll';

/**
 * useScrollCallback
 * -----------------
 * Registers a callback that fires on every Lenis scroll frame.
 * Useful for scroll-direction detection, progress tracking, etc.
 *
 * @example
 * useScrollCallback(({ scroll, velocity, direction }) => {
 *   console.log(scroll, velocity, direction);
 * });
 */
export function useScrollCallback(
  callback: (args: {
    scroll: number;
    limit: number;
    velocity: number;
    direction: number;
    progress: number;
  }) => void
) {
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!lenis) return;
    lenis.on('scroll', callback);
    return () => {
      lenis.off('scroll', callback);
    };
  }, [lenis, callback]);
}

/**
 * useScrollControls
 * -----------------
 * Returns helpers to programmatically control Lenis:
 * - scrollTo(target, options)  — smooth scroll to an element / selector / number
 * - stop()   — freeze scrolling (useful during modals, transitions)
 * - start()  — resume scrolling
 */
export function useScrollControls() {
  const { lenis, scrollTo } = useSmoothScroll();

  const stop = () => lenis?.stop();
  const start = () => lenis?.start();

  return { scrollTo, stop, start, lenis };
}
