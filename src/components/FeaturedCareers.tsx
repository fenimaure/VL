import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ArrowUpRight } from 'lucide-react';

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

                console.log('FeaturedCareers - Fetched data:', data);
                console.log('FeaturedCareers - Error:', error);

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

        console.log('FeaturedCareers - Setting up observer for', careers.length, 'items');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                console.log('FeaturedCareers - Observer entry:', entry.target, 'isIntersecting:', entry.isIntersecting);
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.05 }); // Lowered threshold

        const items = document.querySelectorAll('.stagger-item');
        console.log('FeaturedCareers - Found items to observe:', items.length);
        items.forEach(item => observer.observe(item));

        // Fallback: add visible class after a short delay
        const fallbackTimer = setTimeout(() => {
            items.forEach(item => item.classList.add('visible'));
        }, 100);

        return () => {
            observer.disconnect();
            clearTimeout(fallbackTimer);
        };
    }, [loading, careers]);

    // if (!loading && careers.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 dark:bg-black/20 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 stagger-item">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-[1px] bg-primary-500"></span>
                            <span className="text-primary-500 font-bold tracking-[0.3em] text-[10px] uppercase">Join Our Team</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold font-display text-black dark:text-white transition-colors duration-500">
                            Career <span className="italic text-black/50 dark:text-white/50">Opportunities</span>
                        </h2>
                    </div>
                    <Link
                        to="/careers"
                        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-black dark:text-white hover:text-primary-500 dark:hover:text-primary-500 transition-colors"
                    >
                        View All Roles <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {careers.length > 0 ? (
                        careers.map((job) => (
                            <Link
                                to={`/careers/${job.slug}`}
                                key={job.id}
                                className="block group stagger-item"
                            >
                                <div className="relative overflow-hidden bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 p-8 md:p-10 rounded-2xl hover:border-black/20 dark:hover:border-white/20 transition-all duration-500">
                                    {/* Hover background effect */}
                                    <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/[0.02] transition-colors duration-500"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-primary-500 uppercase mb-3">
                                                <span>{job.department}</span>
                                                <span className="w-1 h-1 rounded-full bg-primary-500"></span>
                                                <span>{job.location}</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold font-display text-black dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-500 transition-colors duration-300">
                                                {job.title}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-8 min-w-[200px]">
                                            <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">
                                                {job.type}
                                            </span>

                                            <div className="h-12 w-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:border-white dark:group-hover:text-dark-950 transition-all duration-500">
                                                <ArrowUpRight className="h-5 w-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 rounded-2xl border border-dashed border-black/10 dark:border-white/10 stagger-item">
                            <Briefcase className="h-8 w-8 text-black/20 dark:text-white/20 mx-auto mb-4" />
                            <p className="text-black/40 dark:text-white/40 text-sm font-bold uppercase tracking-widest">No active openings at the moment</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
