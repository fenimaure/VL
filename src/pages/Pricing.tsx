import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface PricingPackage {
    id: string;
    category: string;
    title: string;
    price: string;
    description: string;
    features: string[];
    is_popular: boolean;
    cta_text: string;
    cta_link: string;
}

export default function Pricing() {
    const [packages, setPackages] = useState<PricingPackage[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch services to build dynamic categories
                const { data: services } = await supabase
                    .from('services')
                    .select('title')
                    .order('created_at', { ascending: true });

                const serviceCategories = services?.map(s => s.title) || [];
                setCategories(serviceCategories);
                if (serviceCategories.length > 0 && !activeCategory) {
                    setActiveCategory(serviceCategories[0]);
                }

                // Fetch pricing packages
                const { data, error } = await supabase
                    .from('pricing_packages')
                    .select('*')
                    .order('order_index', { ascending: true })
                    .order('created_at', { ascending: true });

                if (error) throw error;
                setPackages(data || []);
            } catch (error) {
                console.error('Error fetching pricing data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredPackages = packages.filter(p => p.category === activeCategory);

    return (
        <div className="bg-white dark:bg-dark-950 min-h-screen transition-colors duration-500">
            <Navbar />

            <main className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/10 dark:bg-white/10 text-primary-500 dark:text-white">
                            <Zap className="w-4 h-4 fill-current" />
                        </span>
                        <span className="text-primary-500 dark:text-white font-bold tracking-[0.3em] text-xs uppercase">
                            Flexible Plans
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-display tracking-tight text-black dark:text-white"
                    >
                        Pricing & <span className="text-primary-500">Packages</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-light"
                    >
                        Choose the perfect plan to elevate your business. Transparent pricing, no hidden fees.
                    </motion.p>
                </div>

                {/* Category Tabs - Mobile Scrollable */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-nowrap overflow-x-auto pb-4 md:pb-0 md:justify-center gap-2 mb-12 scrollbar-hide px-2"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${activeCategory === cat
                                ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg scale-105'
                                : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Pricing Cards */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredPackages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPackages.map((pkg, index) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className={`relative group p-8 rounded-3xl border transition-all duration-500 ${pkg.is_popular
                                    ? 'bg-dark-900 border-primary-500/50 shadow-2xl shadow-primary-500/10 scale-105 z-10'
                                    : 'bg-white dark:bg-dark-900 border-gray-100 dark:border-white/10 hover:border-primary-500/30 hover:shadow-xl'
                                    }`}
                            >
                                {pkg.is_popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" /> Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className={`text-xl font-bold mb-2 ${pkg.is_popular ? 'text-white' : 'text-black dark:text-white'}`}>{pkg.title}</h3>
                                    <div className="flex items-baseline gap-1 my-4">
                                        <span className={`text-4xl font-bold tracking-tight ${pkg.is_popular ? 'text-primary-400' : 'text-primary-600 dark:text-primary-400'}`}>{pkg.price}</span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${pkg.is_popular ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {pkg.description}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {pkg.features?.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${pkg.is_popular ? 'bg-primary-500/20 text-primary-400' : 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                                }`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className={pkg.is_popular ? 'text-gray-200' : 'text-gray-600 dark:text-gray-300'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={pkg.cta_link || '/contact'}
                                    className={`block w-full py-4 rounded-xl text-center font-bold tracking-wide transition-all duration-300 ${pkg.is_popular
                                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg hover:brightness-110'
                                        : 'bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {pkg.cta_text || 'Get Started'}
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-gray-50/50 dark:bg-white/5"
                    >
                        <p className="text-lg text-gray-500 dark:text-gray-400">No pricing packages available for {activeCategory} yet.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Please check back later or contact us for a custom quote.</p>
                        <a href="/contact" className="inline-block mt-6 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm">Contact Us</a>
                    </motion.div>
                )}

                {/* Custom Quote Section */}
                <div className="mt-24 text-center">
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Need a custom solution?</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                        We understand that every business is unique. Contact us to discuss your specific requirements and we'll create a tailored package just for you.
                    </p>
                    <a href="/contact" className="inline-flex items-center gap-2 px-8 py-3 border border-gray-200 dark:border-white/20 rounded-full font-bold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        Get a Custom Quote <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
