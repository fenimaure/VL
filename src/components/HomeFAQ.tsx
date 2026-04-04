import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order_index: number;
    is_published: boolean;
}

export default function HomeFAQ() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFAQs() {
            try {
                const { data, error } = await supabase
                    .from('faqs')
                    .select('*')
                    .eq('is_published', true)
                    .order('order_index', { ascending: true })
                    .order('created_at', { ascending: true })
                    .limit(8);

                if (error) throw error;
                setFaqs(data || []);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFAQs();
    }, []);

    const toggleFAQ = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    if (loading) {
        return (
            <section className="py-20 px-6 lg:px-8">
            </section>
        );
    }

    if (faqs.length === 0) return null;

    return (
        <section className="py-24 md:py-32 px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-black dark:text-white">
                            <HelpCircle className="w-4 h-4" />
                        </span>
                        <span className="text-black dark:text-white font-bold tracking-[0.3em] text-xs uppercase">
                            FAQ
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold font-display tracking-tight text-black dark:text-white"
                    >
                        Questions? <span className="text-black/20 dark:text-white/20 italic font-light">Answered.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-light"
                    >
                        Everything you need to know about working with us.
                    </motion.p>
                </div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    {faqs.map((faq, index) => {
                        const isOpen = openId === faq.id;
                        return (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.05 * index }}
                                className={`border rounded-2xl transition-all duration-500 overflow-hidden ${isOpen
                                    ? 'border-black/20 dark:border-white/20 bg-black/[0.02] dark:bg-white/[0.04] shadow-lg'
                                    : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/20 hover:shadow-md'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(faq.id)}
                                    className="w-full flex items-center justify-between gap-4 p-6 md:p-8 text-left cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isOpen
                                            ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                                            : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-black/10 dark:group-hover:bg-white/20 group-hover:text-black dark:group-hover:text-white'
                                            }`}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen
                                            ? 'text-black dark:text-white'
                                            : 'text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'
                                            }`}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen
                                        ? 'bg-black dark:bg-white text-white dark:text-black rotate-180 shadow-lg'
                                        : 'bg-gray-100 dark:bg-white/10 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-white/20'
                                        }`}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            <div className="px-6 md:px-8 pb-8 pl-[4.5rem] md:pl-[5.5rem]">
                                                <div className="w-12 h-[2px] bg-black/10 dark:bg-white/10 rounded-full mb-4"></div>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg font-light whitespace-pre-line">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
