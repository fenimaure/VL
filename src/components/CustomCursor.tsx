import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = !!(
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer')
            );
            setIsHovering(isInteractive);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    if (typeof window === 'undefined') return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary-500 flex items-center justify-center mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                variants={{
                    default: { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0)' },
                    hover: { scale: 2.5, backgroundColor: 'rgba(255, 255, 255, 1)', border: 'none' }
                }}
                animate={isHovering ? 'hover' : 'default'}
            >
                <motion.div
                    className="w-1 h-1 bg-primary-500 rounded-full"
                    animate={{ opacity: isHovering ? 0 : 1 }}
                />
            </motion.div>
        </div>
    );
}
