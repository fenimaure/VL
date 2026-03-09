import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search, MessageCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order_index: number;
    is_published: boolean;
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [openId, setOpenId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchFAQs() {
            try {
                const { data, error } = await supabase
                    .from('faqs')
                    .select('*')
                    .eq('is_published', true)
                    .order('order_index', { ascending: true })
                    .order('created_at', { ascending: true });

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

    // Extract unique categories
    const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category).filter(Boolean)))];

    // Filter by category and search
    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        const matchesSearch = !searchQuery ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFAQ = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="bg-white dark:bg-dark-950 min-h-screen transition-colors duration-500">
            <Navbar />

            <main className="pt-32 pb-20 px-6 lg:px-8 max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/10 dark:bg-white/10 text-primary-500 dark:text-white">
                            <HelpCircle className="w-4 h-4" />
                        </span>
                        <span className="text-primary-500 dark:text-white font-bold tracking-[0.3em] text-xs uppercase">
                            Got Questions?
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-display tracking-tight text-black dark:text-white"
                    >
                        Frequently Asked <span className="text-primary-500">Questions</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-light"
                    >
                        Everything you need to know about our services, process, and how we work. Can't find what you're looking for? Feel free to reach out.
                    </motion.p>
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="relative max-w-xl mx-auto mb-10"
                >
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 text-black dark:text-white text-lg focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    />
                </motion.div>

                {/* Category Tabs */}
                {categories.length > 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-nowrap overflow-x-auto pb-4 md:pb-0 md:justify-center gap-2 mb-12 scrollbar-hide px-2"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${activeCategory === cat
                                    ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg scale-105'
                                    : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* FAQ Accordion */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredFAQs.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="space-y-4"
                    >
                        {filteredFAQs.map((faq, index) => {
                            const isOpen = openId === faq.id;
                            return (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className={`border rounded-2xl transition-all duration-500 overflow-hidden ${isOpen
                                        ? 'border-primary-500/30 bg-primary-500/5 dark:bg-primary-500/5 shadow-lg shadow-primary-500/5'
                                        : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/20 hover:shadow-md'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(faq.id)}
                                        className="w-full flex items-center justify-between gap-4 p-6 md:p-8 text-left cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isOpen
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-primary-500/10 group-hover:text-primary-500'
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
                                            ? 'bg-primary-500 text-white rotate-180 shadow-lg shadow-primary-500/30'
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
                                                    <div className="w-12 h-[2px] bg-primary-500/30 rounded-full mb-4"></div>
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
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-gray-50/50 dark:bg-white/5"
                    >
                        <HelpCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            {searchQuery ? 'No results found for your search.' : 'No FAQs available yet.'}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Please check back later or contact us directly.</p>
                    </motion.div>
                )}

                {/* Still Have Questions CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/[0.02] border border-gray-200 dark:border-white/10 p-10 md:p-14"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                                <MessageCircle className="w-10 h-10 text-primary-500" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-3">Still have questions?</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-lg text-lg font-light">
                                Can't find the answer you're looking for? Our team is here to help you with any questions or concerns.
                            </p>
                        </div>
                        <a
                            href="/contact"
                            className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                        >
                            Contact Us
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
