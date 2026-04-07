import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function GlobalScrollIndicator() {
    const { scrollYProgress, scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    // Smooth circular SVG progress
    const pathLength = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 600);
        });
    }, [scrollY]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isScrolled && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-8 left-8 z-[100]"
                >
                    <button
                        onClick={scrollToTop}
                        className="relative group w-14 h-14 flex items-center justify-center outline-none"
                        aria-label="Back to Top"
                    >
                        {/* Background glass pill/circle */}
                        <div className="absolute inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-md rounded-full border border-black/5 dark:border-white/5 group-hover:bg-white/10 dark:group-hover:bg-white/10 transition-colors duration-300" />
                        
                        {/* Circular progress SVG */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="48"
                                className="fill-none stroke-black/5 dark:stroke-white/5"
                                strokeWidth="2"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="48"
                                className="fill-none stroke-black dark:stroke-white"
                                strokeWidth="2"
                                style={{ pathLength }}
                            />
                        </svg>

                        {/* Centered Arrow */}
                        <ArrowUp className="w-5 h-5 text-black dark:text-white group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
