import { motion } from 'framer-motion';

export default function Preloader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Subtle grid pattern background */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Radial glow behind logo */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[100px]"
            />

            <div className="relative z-10 flex flex-col items-center gap-16 text-center px-6">
                {/* Logo with reveal animation */}
                <div className="relative">
                    {/* Rotating ring */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="absolute -inset-8 md:-inset-12"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            className="w-full h-full rounded-full border border-white/[0.06]"
                            style={{
                                borderTopColor: 'rgba(255,255,255,0.2)',
                            }}
                        />
                    </motion.div>

                    {/* Logo image */}
                    <div className="overflow-hidden">
                        <motion.div
                            initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                            className="flex items-center justify-center"
                        >
                            <img
                                src="/logo.png"
                                alt="Lovelli"
                                className="h-12 md:h-16 w-auto invert"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Minimal progress line */}
                <div className="relative w-48 md:w-64">
                    <div className="h-[1px] w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                                duration: 1.8,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className="h-full w-full bg-gradient-to-r from-white/20 via-white/60 to-white/20"
                        />
                    </div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-8 text-[9px] font-semibold uppercase tracking-[0.5em] text-white/20"
                    >
                        Loading
                    </motion.p>
                </div>
            </div>

            {/* Corner accents */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 40 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-10 left-10 w-[1px] bg-gradient-to-t from-white/20 to-transparent"
            />
            <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 40 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-10 left-10 h-[1px] bg-gradient-to-r from-white/20 to-transparent"
            />
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 40 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="absolute top-10 right-10 w-[1px] bg-gradient-to-b from-white/20 to-transparent"
            />
            <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 40 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="absolute top-10 right-10 h-[1px] bg-gradient-to-l from-white/20 to-transparent"
            />
        </motion.div>
    );
}
