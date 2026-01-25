import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MessageCircle, X, Send, MessageSquare } from 'lucide-react';
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
                        className="flex flex-col items-end gap-4"
                    >
                        {/* WhatsApp Link */}
                        <motion.a
                            href={whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            className="group flex items-center gap-4 bg-white/10 backdrop-blur-2xl border border-white/20 p-2 pl-6 rounded-full hover:bg-white hover:border-white transition-all duration-500"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white group-hover:text-dark-950">Broadcast WhatsApp</span>
                            <div className="h-10 w-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/20">
                                <MessageCircle className="h-5 w-5 text-white" />
                            </div>
                        </motion.a>

                        {/* Messenger Link */}
                        <motion.a
                            href={messenger}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={itemVariants}
                            className="group flex items-center gap-4 bg-white/10 backdrop-blur-2xl border border-white/20 p-2 pl-6 rounded-full hover:bg-white hover:border-white transition-all duration-500"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white group-hover:text-dark-950">Start Messenger</span>
                            <div className="h-10 w-10 bg-[#00B2FF] rounded-full flex items-center justify-center shadow-lg shadow-[#00B2FF]/20">
                                <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                        </motion.a>

                        {/* Status Indicator */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-primary-500/10 border border-primary-500/20 px-4 py-2 rounded-full backdrop-blur-md mb-2"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 bg-primary-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary-500">Studios Online</span>
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
