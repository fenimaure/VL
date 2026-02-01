import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowUpRight, Sparkles } from 'lucide-react';

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
                // Fetch only the latest 3 active careers
                const { data, error } = await supabase
                    .from('careers')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(3);

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

    // Intersection Observer for animations
    useEffect(() => {
        if (loading || careers.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.05 });

        const items = document.querySelectorAll('#careers .stagger-item');
        items.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, [loading, careers]);


    return (
        <section id="careers" className="py-24 relative overflow-hidden bg-white dark:bg-dark-950 transition-colors duration-500">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-500/5 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 stagger-item">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/10 text-primary-500">
                                <Sparkles className="w-4 h-4 fill-current" />
                            </span>
                            <span className="text-primary-500 font-bold tracking-[0.3em] text-[10px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500">
                                Join Our Vision
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold font-display text-black dark:text-white transition-colors duration-500 leading-tight">
                            Build the <span className="italic font-light text-black/50 dark:text-white/40">Future</span> With Us.
                        </h2>
                    </div>

                    <Link
                        to="/careers"
                        className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            View All Openings
                            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {careers.length > 0 ? (
                        careers.map((job) => (
                            <Link
                                to={`/careers/${job.slug}`}
                                key={job.id}
                                className="group stagger-item relative block"
                            >
                                <div className="relative overflow-hidden bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border border-black/5 dark:border-white/5 p-8 md:p-10 rounded-[2rem] transition-all duration-500 hover:border-black/10 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/50">
                                    {/* Animated Gradient Border Effect */}
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                                                <span className="px-3 py-1 rounded-full border border-primary-500/20 text-primary-500 bg-primary-500/5">
                                                    {job.department}
                                                </span>
                                                <span className="text-black/30 dark:text-white/30">•</span>
                                                <span className="text-black/60 dark:text-white/60">
                                                    {job.location}
                                                </span>
                                            </div>

                                            <h3 className="text-3xl md:text-4xl font-bold font-display text-black dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300 mb-2">
                                                {job.title}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-10 min-w-[200px]">
                                            <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                                {job.type}
                                            </span>

                                            <div className="relative w-14 h-14">
                                                <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/10 group-hover:border-primary-500 dark:group-hover:border-primary-400 transition-colors duration-500"></div>
                                                <div className="absolute inset-0 rounded-full bg-black dark:bg-white scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ArrowUpRight className="h-6 w-6 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300 group-hover:rotate-45" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-24 rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 stagger-item bg-white/30 dark:bg-white/5 backdrop-blur-sm">
                            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="h-6 w-6 text-black/40 dark:text-white/40" />
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2">No Open Roles</h3>
                            <p className="text-black/40 dark:text-white/40 text-sm font-bold uppercase tracking-widest">
                                Check back soon for new opportunities
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
