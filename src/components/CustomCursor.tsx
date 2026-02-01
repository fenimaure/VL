import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
    const [cursorText, setCursorText] = useState('');
    const [cursorVariant, setCursorVariant] = useState('default');
    const [isClicked, setIsClicked] = useState(false);

    // Mouse position
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth physics for the follower
    const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for interactive elements
            const isLink = target.closest('a');
            const isButton = target.closest('button');
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
            const cursorData = target.closest('[data-cursor]');
            const cursorTextData = target.closest('[data-cursor-text]');

            if (cursorTextData) {
                const text = cursorTextData.getAttribute('data-cursor-text');
                setCursorText(text || '');
                setCursorVariant('text-view');
            } else if (cursorData) {
                const variant = cursorData.getAttribute('data-cursor');
                setCursorVariant(variant || 'hover');
                setCursorText('');
            } else if (isLink || isButton) {
                setCursorVariant('hover');
                setCursorText('');
            } else if (isInput) {
                setCursorVariant('text');
                setCursorText('');
            } else {
                setCursorVariant('default');
                setCursorText('');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    // Variants for the cursor animations
    const variants = {
        default: {
            height: 16,
            width: 16,
            backgroundColor: "rgba(255, 255, 255, 0)",
            border: "1px solid rgba(125, 125, 125, 0.5)",
            mixBlendMode: "difference" as const
        },
        hover: {
            height: 60,
            width: 60,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            mixBlendMode: "difference" as const
        },
        'text-view': {
            height: 100,
            width: 100,
            backgroundColor: "rgba(255, 255, 255, 1)",
            border: "none",
            mixBlendMode: "difference" as const,
            color: "black"
        },
        text: {
            height: 32,
            width: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 1)",
            border: "none",
            mixBlendMode: "difference" as const
        }
    };

    if (typeof window === 'undefined') return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
            {/* Main Cursor Follower */}
            <motion.div
                className="fixed top-0 left-0 rounded-full flex items-center justify-center pointer-events-none backdrop-blur-[1px]"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                variants={variants}
                animate={cursorVariant}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {/* Text View Content */}
                <AnimatePresence>
                    {cursorText && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-[10px] font-bold uppercase tracking-widest text-black"
                        >
                            {cursorText}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Center Dot (Always precise) */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full mix-blend-difference pointer-events-none"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isClicked ? 0.8 : 1,
                    opacity: cursorVariant === 'text-view' ? 0 : 1
                }}
            />
        </div>
    );
}
