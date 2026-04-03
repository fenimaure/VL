import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

/* ═══════════════════════════════════════
   W-19: Before/After Comparison Slider
   Draggable divider between two images
   ═══════════════════════════════════════ */
interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export default function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeLabel = 'Before',
    afterLabel = 'After',
    className = ''
}: BeforeAfterSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState(50); // percentage 0-100
    const [isDragging, setIsDragging] = useState(false);

    const updatePosition = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
        setPosition(pct);
    }, []);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updatePosition(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    return (
        <ScrollReveal variant="scaleReveal">
            <div
                ref={containerRef}
                className={`relative select-none overflow-hidden rounded-2xl premium-image-treatment cursor-ew-resize ${className}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ touchAction: 'none' }}
            >
                {/* After Image (full background) */}
                <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                        src={afterImage}
                        alt={afterLabel}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />

                    {/* Before Image (clipped to divider position) */}
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${position}%` }}
                    >
                        <img
                            src={beforeImage}
                            alt={beforeLabel}
                            className="w-full h-full object-cover"
                            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw', maxWidth: 'none' }}
                            draggable={false}
                        />
                    </div>

                    {/* Divider Line */}
                    <div
                        className="absolute top-0 bottom-0 z-20"
                        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="w-[2px] h-full bg-white/90 shadow-lg" />

                        {/* Grabber Handle */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="flex items-center gap-1">
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="text-black">
                                    <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="text-black">
                                    <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </motion.div>
                    </div>

                    {/* Labels */}
                    <div className="absolute bottom-4 left-4 z-10">
                        <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white/80">
                            {beforeLabel}
                        </span>
                    </div>
                    <div className="absolute bottom-4 right-4 z-10">
                        <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white/80">
                            {afterLabel}
                        </span>
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}
