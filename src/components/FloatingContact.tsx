import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const MessengerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.259L19.752 8.2l-6.561 6.763z" />
  </svg>
);

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

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > window.innerHeight - 100) {
                setVisible(true);
            } else {
                setVisible(false);
                setIsOpen(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    if (loading) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-6"
                >

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
                                    className="group relative flex items-center justify-center h-16 w-16 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-full hover:scale-110 transition-all duration-500 shadow-xl"
                                >
                                    <div className="absolute inset-0 bg-black dark:bg-white rounded-full blur-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <WhatsAppIcon className="h-8 w-8 text-black dark:text-white group-hover:scale-110 transition-transform" />
                                </motion.a>

                                {/* Messenger Link */}
                                <motion.a
                                    href={messenger}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variants={itemVariants}
                                    className="group relative flex items-center justify-center h-16 w-16 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-full hover:scale-110 transition-all duration-500 shadow-xl"
                                >
                                    <div className="absolute inset-0 bg-black dark:bg-white rounded-full blur-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <MessengerIcon className="h-8 w-8 text-black dark:text-white group-hover:scale-110 transition-transform" />
                                </motion.a>
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
                        <div className="absolute inset-0 bg-black dark:bg-white rounded-full blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-700" />

                        {/* Glass Container */}
                        <div className="absolute inset-0 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center overflow-hidden z-[120]">
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
                                            <Send className="h-6 w-6 md:h-8 md:w-8 text-black dark:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform relative z-[130]" />
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
                                        <X className="h-6 w-6 md:h-8 md:w-8 text-black dark:text-white" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.button>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
