import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface ScopeItem {
    title: string;
    description?: string;
    items?: string[];
}

export default function ServiceScope({ scope }: { scope: ScopeItem[] }) {
    const [openIndex, setOpenIndex] = useState<number>(0); // First item open by default

    if (!scope || scope.length === 0) return null;

    return (
        <div className="space-y-0 border-t border-black/6 dark:border-white/6">
            {scope.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                    <div
                        key={i}
                        className={`border-b border-black/6 dark:border-white/6 transition-colors ${isOpen ? 'bg-black/[0.01] dark:bg-white/[0.01]' : ''}`}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? -1 : i)}
                            className="w-full flex items-center justify-between py-6 md:py-8 px-2 text-left group"
                            data-cursor="pointer"
                        >
                            <div className="flex items-center gap-4 md:gap-6">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/10 service-meta-label text-black/30 dark:text-white/30 transition-colors">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="text-xl md:text-2xl font-bold text-black dark:text-white font-display group-hover:text-primary-500 transition-colors">
                                    {item.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-4 h-4 service-accent-text opacity-50" />
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-black/30 dark:text-white/30" />
                                </motion.div>
                            </div>
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-8 px-2 pl-14 md:pl-[4.5rem]">
                                        {item.description && (
                                            <p className="service-body-text text-black/60 dark:text-gray-400 mb-6 max-w-2xl">
                                                {item.description}
                                            </p>
                                        )}
                                        {item.items && item.items.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {item.items.map((subItem, j) => (
                                                    <motion.div
                                                        key={j}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: j * 0.05, duration: 0.3 }}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <Check className="w-3.5 h-3.5 service-accent-text flex-shrink-0" />
                                                        <span className="text-sm text-black/70 dark:text-white/70">{subItem}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
