import { useEffect, useRef, createContext, useContext, ReactNode, useCallback } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Context — exposes the Lenis instance site-wide
// ---------------------------------------------------------------------------
interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

// ---------------------------------------------------------------------------
// Provider component
// ---------------------------------------------------------------------------
interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();

  // ---- Initialize Lenis ----
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      // Core feel — silky momentum like award-winning sites
      duration: prefersReduced ? 0.01 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential easeOut
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReduced,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      infinite: false,
    });

    lenisRef.current = lenis;

    // ---- Framer Motion integration ----
    // Lenis uses its own virtual scroll position; we need to sync the
    // native scrollY so Framer Motion's useScroll() picks it up.
    // Lenis already does this by default (it scrolls the real DOM),
    // so Framer Motion's useScroll with { target } "just works".

    // ---- rAF loop ----
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // ---- Accessibility: listen for reduced-motion changes ----
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.options.duration = 0.01;
        lenis.options.smoothWheel = false;
      } else {
        lenis.options.duration = 1.2;
        lenis.options.smoothWheel = true;
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ---- Scroll to top on route change ----
  useEffect(() => {
    if (lenisRef.current) {
      // Small timeout lets the new page render before we scroll
      const t = setTimeout(() => {
        lenisRef.current?.scrollTo(0, { immediate: true });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  // ---- Exposed scrollTo helper ----
  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      options?: { offset?: number; duration?: number; immediate?: boolean }
    ) => {
      lenisRef.current?.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
      });
    },
    []
  );

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
