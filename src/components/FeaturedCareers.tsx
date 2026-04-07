import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import MagneticHover from './MagneticHover';

interface Career {
    id: string;
    title: string;
    slug: string;
    department: string;
    location: string;
    type: string;
    description: string;
}

export default function FeaturedCareers() {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCareers() {
            try {
                const { data, error } = await supabase
                    .from('careers')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(4);
                if (error) throw error;
                setCareers(data || []);
            } catch (error) {
                console.error('FeaturedCareers - Fetch error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCareers();
    }, []);

    return (
        <section id="careers" className="py-32 md:py-40 relative overflow-hidden bg-white dark:bg-black transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

                {/* ── Editorial Header ── */}
                <div className="mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <span className="w-16 h-[1px] bg-primary-500" />
                        <span className="text-primary-500 font-bold tracking-[0.4em] text-[10px] uppercase">
                            Open Positions
                        </span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-black dark:text-white leading-[0.9] tracking-tighter transition-colors duration-500"
                        >
                            Join the<br />
                            <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Studio.</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-md"
                        >
                            <p className="text-black/50 dark:text-white/40 text-lg font-light leading-relaxed mb-8">
                                We're always looking for exceptional people who push boundaries and challenge convention.
                            </p>
                            <MagneticHover strength={0.2}>
                                <Link
                                    to="/careers"
                                    className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white hover:text-primary-500 transition-colors duration-300"
                                >
                                    <span>View All Openings</span>
                                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </Link>
                            </MagneticHover>
                        </motion.div>
                    </div>
                </div>

                {/* ── Editorial Role Listings ── */}
                {careers.length > 0 ? (
                    <div className="border-t border-black/10 dark:border-white/10">
                        {careers.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Link
                                    to={`/careers/${job.slug}`}
                                    className="group block border-b border-black/10 dark:border-white/10 transition-colors duration-500"
                                >
                                    <div className="py-10 md:py-14 flex items-start md:items-center gap-6 md:gap-10">
                                        {/* Index */}
                                        <span className="text-[11px] font-bold text-black/20 dark:text-white/15 tracking-wider pt-2 md:pt-0 select-none min-w-[2rem]">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                                            <div className="flex-1">
                                                <h3 className="text-2xl md:text-4xl font-bold font-display text-black dark:text-white group-hover:text-primary-500 transition-colors duration-500 leading-tight tracking-tight mb-2 md:mb-0">
                                                    {job.title}
                                                </h3>
                                                {/* Description teaser — editorial intro */}
                                                <p className="text-sm text-black/40 dark:text-white/30 font-light line-clamp-1 max-w-lg md:hidden">
                                                    {job.description}
                                                </p>
                                            </div>

                                            {/* Meta pills — clean & minimal */}
                                            <div className="flex items-center gap-6 flex-shrink-0">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/25 hidden sm:block">
                                                    {job.department}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/25 hidden lg:block">
                                                    {job.location}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-black/8 dark:border-white/8 text-black/40 dark:text-white/30">
                                                    {job.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:border-black dark:group-hover:bg-white dark:group-hover:border-white transition-all duration-500">
                                            <ArrowUpRight className="h-4 w-4 text-black/30 dark:text-white/30 group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : !loading ? (
                    <div className="text-center py-24 border-t border-black/10 dark:border-white/10">
                        <Briefcase className="h-8 w-8 text-black/20 dark:text-white/15 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-black dark:text-white mb-2">No Open Roles</h3>
                        <p className="text-black/40 dark:text-white/30 text-sm font-light">
                            Check back soon for new opportunities
                        </p>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
