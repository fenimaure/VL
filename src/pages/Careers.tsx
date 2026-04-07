import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import MagneticHover from '../components/MagneticHover';
import { Briefcase, ArrowUpRight, ArrowRight, MapPin, Clock } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Career {
    id: string;
    title: string;
    slug: string;
    department: string;
    location: string;
    type: string;
    description: string;
    created_at?: string;
}

export default function Careers() {
    const [careers, setCareers] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDept, setActiveDept] = useState('All');
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

    useEffect(() => {
        async function fetchCareers() {
            try {
                const { data, error } = await supabase
                    .from('careers')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setCareers(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCareers();
    }, []);

    // Extract unique departments
    const departments = ['All', ...new Set(careers.map(c => c.department).filter(Boolean))];
    const filtered = activeDept === 'All' ? careers : careers.filter(c => c.department === activeDept);

    // Group by department for editorial sections
    const grouped = filtered.reduce<Record<string, Career[]>>((acc, career) => {
        const dept = career.department || 'General';
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(career);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
            <SEO title="Careers" description="Join our studio. Explore open positions and shape the future of digital craft." url="/careers" />
            <Navbar />

            {/* ═══ EDITORIAL HERO ═══ */}
            <section ref={heroRef} className="relative min-h-[85vh] flex items-end overflow-hidden">
                {/* Subtle grain texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
                />

                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="max-w-7xl mx-auto px-6 lg:px-8 w-full pb-24 pt-48 relative z-10"
                >
                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-4 mb-16"
                    >
                        <span className="w-16 h-[1px] bg-primary-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Careers</span>
                    </motion.div>

                    {/* Massive editorial headline */}
                    <div className="mb-16">
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[clamp(3.5rem,10vw,9rem)] font-bold font-display leading-[0.85] tracking-tighter"
                            >
                                Shape the
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[clamp(3.5rem,10vw,9rem)] text-stroke-light dark:text-stroke-white italic font-light font-serif leading-[0.85]"
                            >
                                Future.
                            </motion.h1>
                        </div>
                    </div>

                    {/* Subtitle + Stats row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-5 text-lg md:text-xl text-black/50 dark:text-white/40 font-light leading-relaxed"
                        >
                            We're a collective of designers, engineers, and visionaries redefining the boundaries of digital craft.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-7 flex items-center gap-12 lg:justify-end"
                        >
                            <div>
                                <div className="text-4xl md:text-5xl font-bold font-display">{careers.length}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/25 mt-1">Open Roles</div>
                            </div>
                            <div className="w-[1px] h-12 bg-black/10 dark:bg-white/10" />
                            <div>
                                <div className="text-4xl md:text-5xl font-bold font-display">{departments.length - 1}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/25 mt-1">Departments</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/10 dark:bg-white/10" />
            </section>

            {/* ═══ DEPARTMENT FILTER — Minimal tab bar ═══ */}
            {departments.length > 2 && (
                <section className="sticky top-20 z-40 backdrop-blur-2xl bg-white/80 dark:bg-black/80 border-b border-black/5 dark:border-white/5 transition-colors duration-500">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-4">
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setActiveDept(dept)}
                                    className={`relative px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap ${
                                        activeDept === dept
                                            ? 'bg-black dark:bg-white text-white dark:text-black'
                                            : 'text-black/35 dark:text-white/30 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    {dept}
                                    {dept !== 'All' && (
                                        <span className={`ml-1.5 ${activeDept === dept ? 'text-white/50 dark:text-black/50' : 'text-black/15 dark:text-white/15'}`}>
                                            {careers.filter(c => c.department === dept).length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ EDITORIAL ROLE LISTINGS ═══ */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {loading ? null : filtered.length > 0 ? (
                        Object.entries(grouped).map(([dept, roles], deptIdx) => (
                            <div key={dept} className={deptIdx > 0 ? 'mt-24' : ''}>
                                {/* Department chapter header */}
                                {activeDept === 'All' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex items-center gap-6 mb-12"
                                    >
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30 dark:text-white/25">
                                            {dept}
                                        </h3>
                                        <span className="flex-1 h-[1px] bg-black/8 dark:bg-white/8" />
                                        <span className="text-[10px] font-bold text-black/20 dark:text-white/15 tracking-wider">
                                            {roles.length} {roles.length === 1 ? 'role' : 'roles'}
                                        </span>
                                    </motion.div>
                                )}

                                {/* Role items */}
                                <div className="border-t border-black/10 dark:border-white/10">
                                    {roles.map((job, i) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-30px" }}
                                            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <Link
                                                to={`/careers/${job.slug}`}
                                                className="group block border-b border-black/8 dark:border-white/8"
                                            >
                                                <div className="py-10 md:py-16 grid grid-cols-12 gap-4 md:gap-8 items-start md:items-center">
                                                    {/* Index number */}
                                                    <div className="col-span-1 hidden md:block">
                                                        <span className="text-[11px] font-bold text-black/15 dark:text-white/10 tracking-wider select-none">
                                                            {String(i + 1).padStart(2, '0')}
                                                        </span>
                                                    </div>

                                                    {/* Title + Description (editorial content) */}
                                                    <div className="col-span-12 md:col-span-6">
                                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-black dark:text-white group-hover:text-primary-500 transition-colors duration-500 leading-[1.05] tracking-tight mb-3">
                                                            {job.title}
                                                        </h3>
                                                        <p className="text-sm md:text-base text-black/40 dark:text-white/30 font-light leading-relaxed line-clamp-2 max-w-xl">
                                                            {job.description}
                                                        </p>
                                                    </div>

                                                    {/* Meta — location, type */}
                                                    <div className="col-span-10 md:col-span-4 flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 md:mt-0">
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/25">
                                                            <MapPin className="h-3 w-3" />
                                                            {job.location}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/25">
                                                            <Clock className="h-3 w-3" />
                                                            {job.type}
                                                        </span>
                                                    </div>

                                                    {/* Arrow CTA */}
                                                    <div className="col-span-2 md:col-span-1 flex justify-end items-center">
                                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:border-black dark:group-hover:bg-white dark:group-hover:border-white transition-all duration-500">
                                                            <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-black/25 dark:text-white/25 group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        /* Empty state */
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center py-32"
                        >
                            <Briefcase className="h-10 w-10 text-black/15 dark:text-white/10 mx-auto mb-8" />
                            <h3 className="text-3xl font-bold font-display mb-4">
                                The studio is at full capacity.
                            </h3>
                            <p className="text-black/40 dark:text-white/30 font-light text-lg max-w-md mx-auto mb-10">
                                We're not currently hiring, but great talent is always welcome. Follow us for future openings.
                            </p>
                            <MagneticHover strength={0.2}>
                                <Link
                                    to="/contact"
                                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.2em] hover:shadow-xl transition-all duration-500"
                                >
                                    Get In Touch
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </MagneticHover>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ═══ EDITORIAL CTA BAND ═══ */}
            {!loading && careers.length > 0 && (
                <section className="py-24 md:py-32 border-t border-black/8 dark:border-white/8">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
                        >
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold font-display mb-3">
                                    Don't see your role?
                                </h3>
                                <p className="text-black/40 dark:text-white/30 font-light text-lg">
                                    We're always interested in meeting exceptional people.
                                </p>
                            </div>
                            <MagneticHover strength={0.2}>
                                <Link
                                    to="/contact"
                                    className="group relative px-10 py-5 rounded-full border border-black/15 dark:border-white/15 text-[10px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-all duration-700 hover:border-black/30 dark:hover:border-white/30 hover:shadow-xl"
                                >
                                    <span className="absolute inset-0 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                    <span className="relative z-10 flex items-center gap-3 group-hover:text-white dark:group-hover:text-black transition-colors duration-500">
                                        Send Open Application
                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                </Link>
                            </MagneticHover>
                        </motion.div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
