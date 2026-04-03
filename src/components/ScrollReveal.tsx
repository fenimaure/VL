import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    useParallax?: boolean;
    yOffset?: number;
    delay?: number;
    scaleEffect?: boolean;
    /** W-23: New reveal variants for Works pages */
    variant?: 'default' | 'maskReveal' | 'scaleReveal' | 'slideReveal';
    /** W-23: Slide direction for slideReveal variant */
    slideFrom?: 'left' | 'right';
}

export default function ScrollReveal({ 
    children, 
    className = '', 
    useParallax = false,
    yOffset = 100,
    delay = 0,
    scaleEffect = false,
    variant = 'default',
    slideFrom = 'left'
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    
    // Track scroll velocity and position against the viewport
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Spring physics wrapper for butter-smooth mobile & desktop scrolling parallax
    const springProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Gentle parallax logic
    const yTransform = useTransform(springProgress, [0, 1], [-yOffset, yOffset]);
    const scaleTransform = useTransform(springProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

    // If requested, we render a highly intensive parallax block (perfect for feature cards)
    if (useParallax) {
        return (
            <div ref={ref} className={`${className} overflow-hidden`}>
                 <motion.div 
                    style={{ 
                        y: yTransform, 
                        scale: scaleEffect ? scaleTransform : 1 
                    }} 
                    className="w-full h-full will-change-transform"
                 >
                    {children}
                 </motion.div>
            </div>
        )
    }

    // W-23: maskReveal — clipPath wipes up from bottom
    if (variant === 'maskReveal') {
        return (
            <motion.div
                ref={ref}
                className={className}
                initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ 
                    duration: 1.2, 
                    delay,
                    ease: [0.16, 1, 0.3, 1]
                }}
            >
                {children}
            </motion.div>
        );
    }

    // W-23: scaleReveal — zoom-in with blur dissolve
    if (variant === 'scaleReveal') {
        return (
            <motion.div
                ref={ref}
                className={className}
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ 
                    duration: 1.2, 
                    delay,
                    ease: [0.16, 1, 0.3, 1]
                }}
            >
                {children}
            </motion.div>
        );
    }

    // W-23: slideReveal — slides in from left or right
    if (variant === 'slideReveal') {
        const xInitial = slideFrom === 'left' ? -80 : 80;
        return (
            <motion.div
                ref={ref}
                className={className}
                initial={{ opacity: 0, x: xInitial }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ 
                    duration: 1, 
                    delay,
                    ease: [0.16, 1, 0.3, 1]
                }}
            >
                {children}
            </motion.div>
        );
    }

    // Default: Premium Awwwards Expo-Out Reveal
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ 
                duration: 1, 
                delay: delay, 
                ease: [0.16, 1, 0.3, 1] // Apple/Dentsu Expo out easing
            }}
        >
            {children}
        </motion.div>
    );
}
