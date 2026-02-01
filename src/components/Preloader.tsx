import { motion } from 'framer-motion';

export default function Preloader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                y: '-100%',
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
            }}
            className="fixed inset-0 z-[9999] bg-dark-950 flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Kinetic Text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
                <h2 className="text-[20vw] font-black font-display rotate-12 leading-none whitespace-nowrap">
                    LOVELLI.STUDIOS • LOVELLI.STUDIOS • LOVELLI.STUDIOS
                </h2>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-12 text-center px-6">
                {/* Main Logo Image Animation */}
                <div className="overflow-hidden">
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="flex items-center justify-center"
                    >
                        <img
                            src="/logo.png"
                            alt="Lovelli"
                            className="h-16 md:h-24 w-auto invert"
                        />
                    </motion.div>
                </div>

                {/* Progress Container */}
                <div className="relative w-64 md:w-96">
                    {/* Track */}
                    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        {/* Moving Progress Fill */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '0%' }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut"
                            }}
                            className="h-full w-full bg-gradient-to-r from-transparent via-primary-500 to-transparent"
                        />
                    </div>

                    <div className="mt-8 flex justify-between items-center text-[8px] font-bold uppercase tracking-[0.5em] text-white/30">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Architecting Digital
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            EST. 2024
                        </motion.span>
                    </div>
                </div>
            </div>

            {/* Decorative Corner Accents */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 left-12 h-20 w-[1px] bg-gradient-to-t from-primary-500/40 to-transparent"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="absolute top-12 right-12 h-20 w-[1px] bg-gradient-to-b from-primary-500/40 to-transparent"
            />
        </motion.div>
    );
}
