import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false);
    const [links, setLinks] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContactLinks() {
            try {
                const { data } = await supabase.from('footer_content').select('*');
                const map: Record<string, string> = {};
                data?.forEach((item: any) => map[item.key_name] = item.value);
                setLinks(map);
            } catch (e) {
                console.error('Error fetching contact links:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchContactLinks();
    }, []);

    const whatsapp = links.whatsapp_url || '#';
    const messenger = links.messenger_url || '#';
    const customIcon = links.fab_icon_url;

    const menuVariants: Variants = {
        closed: {
            scale: 0,
            opacity: 0,
            y: 20,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 25,
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        closed: { x: 20, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    if (loading) return null;

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-6">

            {/* Contact Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="flex flex-col items-end gap-5"
                    >
                        {/* WhatsApp Link */}
                        <motion.a
                            href={whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            className="group relative flex items-center justify-center h-16 w-16 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full hover:scale-110 hover:bg-white transition-all duration-500 shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-[#25D366] rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <svg className="h-8 w-8 text-[#25D366] group-hover:scale-90 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.031 6.172c-2.32 0-4.518.953-6.19 2.684-1.644 1.699-2.546 3.962-2.546 6.37 0 2.326.861 4.54 2.424 6.225 1.666 1.79 3.9 2.779 6.29 2.779 2.32 0 4.518-.953 6.19-2.684 1.644-1.699 2.546-3.962 2.546-6.37 0-2.326-.861-4.540-2.424-6.225-1.666-1.79-3.9-2.779-6.29-2.779zm0 16.591c-1.926 0-3.73-.787-5.078-2.215-1.288-1.363-1.996-3.171-1.996-5.093 0-1.967.753-3.812 2.12-5.215 1.348-1.383 3.14-2.144 5.048-2.144 1.926 0 3.73.787 5.078 2.215 1.288 1.363 1.996 3.171 1.996 5.093 0 1.967-.753 3.812-2.12 5.215-1.348 1.383-3.14 2.144-5.048 2.144zM16.193 14.28c-.283-.146-1.67-.824-1.928-.918-.258-.094-.446-.14-.634.14-.188.28-.728.915-.892 1.102-.164.187-.328.21-.611.069-.283-.146-1.194-.44-2.274-1.405-.841-.75-1.408-1.676-1.573-1.956-.164-.28-.018-.432.124-.571.127-.126.283-.328.424-.492.141-.164.188-.28.282-.468.094-.188.047-.352-.023-.492-.07-.14-.634-1.526-.868-2.09-.228-.55-.453-.472-.634-.48-.164-.008-.352-.008-.54-.008-.188 0-.493.07-.752.348-.258.28-.986.963-.986 2.345 0 1.382 1.008 2.716 1.148 2.903.14.187 1.984 3.029 4.806 4.242.671.289 1.195.461 1.604.59.674.214 1.287.184 1.771.111.54-.08 1.67-.682 1.905-1.34.235-.658.235-1.221.164-1.34-.071-.118-.258-.187-.54-.333z" />
                            </svg>
                        </motion.a>

                        {/* Messenger Link */}
                        <motion.a
                            href={messenger}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            className="group relative flex items-center justify-center h-16 w-16 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full hover:scale-110 hover:bg-white transition-all duration-500 shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-[#00B2FF] rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <svg className="h-8 w-8 text-[#00B2FF] group-hover:scale-90 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 3.22 1.44 6.08 3.69 7.9-.1.2-.23.6-.5 1.5l-.33 1c-.1.32.16.63.48.55l1.08-.28c1-.26 1.6-.42 2-.5.8.23 1.66.36 2.58.36 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1 12.5l-2.5-2.67L5.5 14.5l5.5-5.83 2.5 2.67 5-2.67-5.5 5.83z" />
                            </svg>
                        </motion.a>

                        {/* Status Indicator */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-primary-500/10 border border-primary-500/20 px-4 py-2 rounded-full backdrop-blur-md mb-2"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 bg-primary-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary-500">Live</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Switch */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative h-20 w-20 rounded-full shadow-2xl shadow-primary-500/20 group"
            >
                {/* Particle Glow Effect */}
                <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                {/* Glass Container */}
                <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!isOpen ? (
                            <motion.div
                                key="chat-icon"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                className="relative h-full w-full flex items-center justify-center"
                            >
                                {customIcon ? (
                                    <img
                                        src={customIcon}
                                        alt="Contact"
                                        className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                    />
                                ) : (
                                    <Send className="h-8 w-8 text-primary-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                )}
                                {/* Visual Accent */}
                                <div className="absolute top-4 right-4 h-3 w-3 bg-primary-500 rounded-full border-2 border-dark-900 shadow-sm" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="close-icon"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                            >
                                <X className="h-8 w-8 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>

        </div>
    );
}
