import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 flex flex-col pt-32">
            <Navbar />

            <main className="flex-1 flex items-center justify-center relative overflow-hidden px-6">
                {/* Aesthetic Background Elements */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* Decorative Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] text-[40vw] font-black font-display leading-[1] whitespace-nowrap text-black dark:text-white z-0">
                    404.
                </div>

                {/* Corner Accents */}
                <div className="absolute top-20 left-20 w-16 h-16 border-l border-t border-black/10 dark:border-white/10 pointer-events-none hidden lg:block"></div>
                <div className="absolute bottom-20 right-20 w-16 h-16 border-r border-b border-black/10 dark:border-white/10 pointer-events-none hidden lg:block"></div>

                <div className="max-w-4xl w-full text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Tag Badge */}
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-full mb-8 border border-black/10 dark:border-white/10">
                            <Sparkles className="h-4 w-4 text-primary-500" />
                            <span className="text-sm font-bold tracking-[0.3em] uppercase text-primary-500">Transmission Lost</span>
                        </div>

                        {/* Error Code Hero */}
                        <h1 className="text-[12rem] md:text-[20rem] font-bold font-display leading-[0.8] tracking-tighter mb-10 text-black dark:text-white">
                            404<span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">.</span>
                        </h1>

                        {/* Message */}
                        <h2 className="text-2xl md:text-4xl font-bold mb-6 font-display tracking-tight text-black dark:text-white uppercase">
                            Page Not Found
                        </h2>
                        <p className="text-lg md:text-xl text-black/60 dark:text-gray-400 font-light max-w-xl mx-auto mb-12 leading-relaxed">
                            The high-end digital experience you're looking for has moved to a new dimension. Let's get you back on track.
                        </p>

                        {/* CTA */}
                        <div className="flex justify-center">
                            <Link
                                to="/"
                                className="group flex items-center gap-4 px-10 py-5 rounded-full border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 transition-all duration-300 font-bold uppercase tracking-[0.2em] text-xs shadow-2xl shadow-black/20"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
                                Return to Studio
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
