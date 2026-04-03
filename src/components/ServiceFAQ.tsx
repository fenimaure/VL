import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

export default function ServiceFAQ({ faqs }: { faqs: FAQItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (!faqs || faqs.length === 0) return null;

    return (
        <div className="space-y-0">
            {faqs.map((faq, i) => (
                <div
                    key={i}
                    className={`faq-item ${openIndex === i ? 'active' : ''}`}
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between py-7 text-left group"
                        data-cursor="pointer"
                    >
                        <span className="flex items-center gap-4">
                            <span className="service-meta-label text-black/20 dark:text-white/20 font-mono">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-lg md:text-xl font-bold text-black dark:text-white group-hover:text-primary-500 transition-colors font-display">
                                {faq.question}
                            </span>
                        </span>
                        <span className="faq-toggle-icon flex-shrink-0 ml-4">
                            <Plus className="w-5 h-5 text-black/30 dark:text-white/30" />
                        </span>
                    </button>
                    <AnimatePresence>
                        {openIndex === i && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="pb-7 pl-12 md:pl-14 pr-12">
                                    <p className="service-body-text text-black/60 dark:text-gray-400 max-w-2xl">
                                        {faq.answer}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
