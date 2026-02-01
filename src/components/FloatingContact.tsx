import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa';
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
                            <FaWhatsapp className="h-8 w-8 text-[#25D366] group-hover:scale-110 transition-transform" />
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
                            <FaFacebookMessenger className="h-8 w-8 text-[#00B2FF] group-hover:scale-110 transition-transform" />
                        </motion.a>

                        {/* Status Indicator REMOVED as per request */}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Switch */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative h-[3.6rem] w-[3.6rem] md:h-20 md:w-20 rounded-full shadow-2xl shadow-primary-500/20 group z-[110]"
            >
                {/* Particle Glow Effect */}
                <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                {/* Glass Container */}
                <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center overflow-hidden z-[120]">
                    <AnimatePresence mode="wait">
                        {!isOpen ? (
                            <motion.div
                                key="chat-icon"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                className="relative h-full w-full flex items-center justify-center p-1"
                            >
                                {customIcon ? (
                                    <div className="w-full h-full rounded-full overflow-hidden relative z-[130]">
                                        <img
                                            src={customIcon}
                                            alt="Contact"
                                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                        />
                                    </div>
                                ) : (
                                    <Send className="h-6 w-6 md:h-8 md:w-8 text-primary-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform relative z-[130]" />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="close-icon"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                className="relative z-[130]"
                            >
                                <X className="h-6 w-6 md:h-8 md:w-8 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>

        </div>
    );
}
