import { motion } from 'framer-motion';

export default function Preloader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Soft gradient glow behind logo */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute w-[400px] h-[400px] rounded-full bg-white/[0.03] blur-[80px]"
            />

            <div className="relative z-10 flex flex-col items-center gap-10 text-center px-6 mt-10">
                {/* Logo with reveal animation */}
                <div className="relative">
                    <div className="overflow-hidden p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, filter: 'blur(5px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center justify-center"
                        >
                            <img
                                src="/logo.png"
                                alt="Lovelli"
                                className="h-10 md:h-12 w-auto invert opacity-90"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Progressive reveal dots */}
                <div className="flex gap-2 items-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scaleY: 0.2, opacity: 0.2 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "mirror",
                                duration: 0.6,
                                delay: i * 0.15,
                                ease: "easeInOut"
                            }}
                            className="w-[2px] h-3 bg-white/40 rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* Very subtle Marquee line at the bottom */}
            <div className="absolute bottom-10 left-0 w-full overflow-hidden opacity-30 flex">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear"
                    }}
                    className="flex whitespace-nowrap"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white mx-10">
                        Elegant solutions. Creative strategies. Measurable results. • Elegant solutions. Creative strategies. Measurable results. • Elegant solutions. Creative strategies. Measurable results. • Elegant solutions. Creative strategies. Measurable results. • Elegant solutions. Creative strategies. Measurable results. • Elegant solutions. Creative strategies. Measurable results.
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
}
