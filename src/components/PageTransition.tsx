import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();

    // Scroll to top automatically entirely bypassing browser's jumpy behavior
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                className="relative"
            >
                {/* 
                  The Dentsu-style brutalist wipe curtain.
                  It uses scaleY with changing transform origins for a continuous "swipe up" feel
                  that is extremely performant on mobile (uses hardware accelerated transforms).
                */}
                <motion.div
                    className="fixed left-0 top-0 w-full h-[110svh] z-[9999] bg-black dark:bg-white pointer-events-none"
                    style={{ willChange: 'transform' }}
                    initial={{ scaleY: 1, transformOrigin: 'top' }}
                    animate={{ scaleY: 0, transformOrigin: 'top' }}
                    exit={{ scaleY: 1, transformOrigin: 'bottom' }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                />
                <motion.div
                    className="fixed left-0 top-0 w-full h-[110svh] z-[9998] bg-primary-500 pointer-events-none"
                    style={{ willChange: 'transform' }}
                    initial={{ scaleY: 1, transformOrigin: 'top' }}
                    animate={{ scaleY: 0, transformOrigin: 'top' }}
                    exit={{ scaleY: 1, transformOrigin: 'bottom' }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.08 }} // Staggered wipe
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.25, // Wait for curtain to mostly clear
                        ease: [0.33, 1, 0.68, 1] // Apple Expo out
                    }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
