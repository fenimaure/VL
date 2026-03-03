import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ClientLogos from '../components/ClientLogos';
import {
    ArrowRight, ArrowUpRight, Sparkles, Zap,
    Target, Eye, Layers, Rocket, CheckCircle2,
    BarChart3, Users, Award, Heart
} from 'lucide-react';

interface Service {
    id: string;
    title: string;
    description: string;
    icon_name: string;
    icon_url?: string;
    color_theme: string;
    slug: string;
    tags?: string[];
}

// ─── Utility ────────────────────────────────────────────────────────
function stripMarkdown(text: string): string {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();
}

function parseTags(service: Service): string[] {
    if (service.icon_name?.startsWith('tags:')) {
        return service.icon_name.slice(5).split(',').map(t => t.trim()).filter(Boolean).slice(0, 5);
    }
    const name = (service.icon_name || service.title).toLowerCase();
    const map: Record<string, string[]> = {
        web: ['Web Design', 'Development', 'Responsive'],
        design: ['UI/UX Design', 'Branding', 'Visual Identity'],
        seo: ['SEO', 'Analytics', 'Growth'],
        mobile: ['iOS', 'Android', 'React Native'],
        marketing: ['Social Media', 'Content', 'Strategy'],
        brand: ['Brand Strategy', 'Identity', 'Tone of voice'],
        ecommerce: ['E-Commerce', 'Shopify', 'Conversion'],
    };
    for (const [key, tags] of Object.entries(map)) {
        if (name.includes(key)) return tags;
    }
    return [service.title, 'Strategy', 'Execution'];
}

const MARQUEE_WORDS = [
    'STRATEGY', 'DESIGN', 'DEVELOPMENT', 'BRANDING', 'GROWTH',
    'INNOVATION', 'DIGITAL', 'EXPERIENCE', 'PERFORMANCE', 'IDENTITY',
];

// ─── Animated Section Wrapper ───────────────────────────────────────
function AnimatedSection({ children, className = '', delay = 0 }: {
    children: React.ReactNode; className?: string; delay?: number;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── Stat Counter ───────────────────────────────────────────────────
function StatCounter({ number, suffix, label, icon: Icon, index }: {
    number: number; suffix: string; label: string; icon: any; index: number;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 2000;
        const increment = number / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= number) { setCount(number); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, number]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center group"
        >
            <Icon className="h-7 w-7 mx-auto mb-4 text-black dark:text-white group-hover:scale-110 transition-transform" />
            <div className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-2 font-display tracking-tight">
                {count}{suffix}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-black/50 dark:text-white/50 font-semibold">
                {label}
            </div>
        </motion.div>
    );
}

// ═════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════
export default function Services() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        async function fetchServices() {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .order('created_at', { ascending: true });
                if (error) throw error;
                setServices(data || []);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 transition-colors duration-500">
            <Navbar />

            {/* ═══════════════════════════════════════════════════════
                SECTION 1 — CINEMATIC HERO
            ═══════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Gradient backdrop */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-950 dark:via-dark-950 dark:to-dark-900 transition-colors duration-500" />
                    {/* Decorative blurred circles */}
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-black/[0.03] dark:bg-white/[0.03] rounded-full blur-3xl" />
                </div>

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center"
                >
                    {/* Floating Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-full mb-10 border border-black/10 dark:border-white/10"
                    >
                        <Sparkles className="h-4 w-4 text-black dark:text-white animate-pulse" />
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-black dark:text-white">
                            Our Services
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl lg:text-9xl font-bold font-display text-black dark:text-white tracking-tighter leading-[0.85] mb-8"
                    >
                        <span className="block">Crafting</span>
                        <span className="block text-stroke-light dark:text-stroke-white italic font-light mt-2">
                            Digital Excellence
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg md:text-xl text-black/50 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-14 font-light"
                    >
                        We architect end-to-end digital ecosystems — from high-performance platforms to
                        brand-defining experiences — that drive measurable growth and lasting impressions.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="#services-grid"
                            className="group px-8 py-4 bg-black dark:bg-white text-white dark:text-dark-950 rounded-full font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Explore Services
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="/contact"
                            className="group px-8 py-4 bg-transparent backdrop-blur-sm text-black dark:text-white rounded-full font-bold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                        >
                            Start a Project
                        </a>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-black/30 dark:text-white/30 font-bold">Scroll</span>
                        <div className="w-[2px] h-12 bg-gradient-to-b from-black/20 to-transparent dark:from-white/20" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTION 2 — MARQUEE TICKER
            ═══════════════════════════════════════════════════════ */}
            <section className="py-8 border-y border-black/5 dark:border-white/5 overflow-hidden bg-black dark:bg-white transition-colors duration-500">
                <div className="relative flex overflow-hidden">
                    <div className="animate-scroll flex shrink-0">
                        {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
                            <span
                                key={i}
                                className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-white/60 dark:text-black/60 whitespace-nowrap mx-8 md:mx-12"
                            >
                                {word}
                                <span className="ml-8 md:ml-12 text-white/20 dark:text-black/20">•</span>
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTION 3 — SERVICES GRID
            ═══════════════════════════════════════════════════════ */}
            <section id="services-grid" className="py-32 md:py-40 bg-white dark:bg-dark-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Section Header */}
                    <AnimatedSection className="mb-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-black dark:text-white">
                                        <Zap className="w-4 h-4 fill-current" />
                                    </span>
                                    <span className="text-black dark:text-white font-bold tracking-[0.3em] text-xs uppercase">
                                        What We Do
                                    </span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-bold font-display text-black dark:text-white tracking-tighter leading-[0.9]">
                                    Expert <span className="text-stroke-light dark:text-stroke-white italic font-light">Solutions</span>
                                </h2>
                            </div>
                            <p className="text-base text-black/50 dark:text-gray-400 max-w-md font-light leading-relaxed">
                                Every service is architected for measurable impact — combining strategic thinking with relentless craft to elevate your brand.
                            </p>
                        </div>
                    </AnimatedSection>

                    {/* Cards Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((service, index) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    index={index}
                                    onClick={() => navigate(`/services/${service.slug}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTION 4 — VALUE PROPOSITIONS / STATS
            ═══════════════════════════════════════════════════════ */}
            <section className="py-28 border-y border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-dark-900/30 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-20">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">Why Choose Us</span>
                        <h2 className="text-5xl md:text-7xl font-bold font-display text-black dark:text-white tracking-tighter">
                            Results That <span className="text-stroke-light dark:text-stroke-white italic font-light">Speak</span>
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { number: 150, suffix: '+', label: 'Projects Delivered', icon: Target },
                            { number: 98, suffix: '%', label: 'Client Satisfaction', icon: Heart },
                            { number: 50, suffix: '+', label: 'Global Brands', icon: Users },
                            { number: 10, suffix: '+', label: 'Years Experience', icon: Award },
                        ].map((stat, idx) => (
                            <StatCounter key={idx} {...stat} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTION 5 — PROCESS / HOW WE WORK
            ═══════════════════════════════════════════════════════ */}
            <section className="py-32 md:py-40 bg-white dark:bg-dark-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-24">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">Our Process</span>
                        <h2 className="text-5xl md:text-7xl font-bold font-display text-black dark:text-white tracking-tighter">
                            How We <span className="text-stroke-light dark:text-stroke-white italic font-light">Work</span>
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connector line (desktop) */}
                        <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent z-0" />

                        {[
                            { icon: Eye, step: '01', title: 'Discovery', desc: 'Deep-dive into your brand, audience, competitors, and goals to uncover the right strategic direction.' },
                            { icon: Layers, step: '02', title: 'Strategy', desc: 'We craft a data-driven roadmap that aligns your business objectives with creative execution.' },
                            { icon: Zap, step: '03', title: 'Execution', desc: 'Our team brings the strategy to life with precision engineering, premium design, and meticulous QA.' },
                            { icon: Rocket, step: '04', title: 'Launch & Growth', desc: 'We deploy, optimise, and iterate — ensuring continuous performance improvement and scale.' },
                        ].map((item, idx) => (
                            <AnimatedSection key={idx} delay={idx * 0.15} className="relative z-10">
                                <div className="flex flex-col items-center text-center group">
                                    {/* Step circle */}
                                    <div className="w-32 h-32 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-dark-950 flex items-center justify-center mb-8 group-hover:border-black/30 dark:group-hover:border-white/30 group-hover:scale-105 transition-all duration-500">
                                        <item.icon className="w-10 h-10 text-black dark:text-white" />
                                    </div>
                                    {/* Step number */}
                                    <span className="font-mono text-[10px] font-bold tracking-[0.4em] text-black/20 dark:text-white/20 mb-3">{item.step}</span>
                                    <h3 className="text-xl font-bold font-display text-black dark:text-white mb-3">{item.title}</h3>
                                    <p className="text-sm text-black/50 dark:text-gray-400 leading-relaxed max-w-[240px] font-light">{item.desc}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTION 6 — FEATURE HIGHLIGHTS (Split Sections)
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-black dark:bg-white transition-colors duration-500">
                {/* Highlight 1 — Strategy-First */}
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                    {/* Text */}
                    <AnimatedSection className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 dark:text-black/30 mb-6">Approach</span>
                        <h2 className="text-4xl md:text-6xl font-bold font-display text-white dark:text-black tracking-tighter leading-[0.9] mb-8">
                            Strategy-First<br />
                            <span className="font-light italic opacity-40">Thinking</span>
                        </h2>
                        <p className="text-white/60 dark:text-black/60 text-base md:text-lg leading-relaxed max-w-lg font-light mb-10">
                            We don't just design and build — we start with deep strategic analysis. Every pixel, every interaction, every line of code is backed by data and aligned with your business objectives. The result? Measurable, repeatable growth.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['Data-Driven', 'ROI-Focused', 'Measurable Impact'].map(badge => (
                                <span key={badge} className="px-4 py-2 rounded-full border border-white/10 dark:border-black/10 text-xs font-bold uppercase tracking-wider text-white/70 dark:text-black/70">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </AnimatedSection>
                    {/* Visual */}
                    <div className="relative overflow-hidden min-h-[400px] lg:min-h-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                            <span className="text-[20vw] font-black font-display leading-none select-none text-white dark:text-black">01</span>
                        </div>
                        <div className="relative grid grid-cols-2 gap-4 p-12">
                            {[BarChart3, Target, CheckCircle2, Zap].map((Icon, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/10 dark:border-black/10 flex items-center justify-center hover:scale-105 transition-transform duration-500"
                                >
                                    <Icon className="w-10 h-10 text-white/60 dark:text-black/60" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Highlight 2 — Crafted with Precision */}
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] border-t border-white/5 dark:border-black/5">
                    {/* Visual (left on desktop) */}
                    <div className="relative overflow-hidden min-h-[400px] lg:min-h-0 bg-gradient-to-bl from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 flex items-center justify-center order-2 lg:order-1">
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                            <span className="text-[20vw] font-black font-display leading-none select-none text-white dark:text-black">02</span>
                        </div>
                        {/* Decorative grid of dots */}
                        <div className="relative grid grid-cols-5 grid-rows-5 gap-4 p-12">
                            {Array.from({ length: 25 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.02 * i, duration: 0.4 }}
                                    viewport={{ once: true }}
                                    className={`w-4 h-4 rounded-full ${i % 3 === 0 ? 'bg-white/30 dark:bg-black/30' : 'bg-white/10 dark:bg-black/10'} hover:bg-white/50 dark:hover:bg-black/50 transition-colors duration-300`}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Text (right on desktop) */}
                    <AnimatedSection className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 order-1 lg:order-2">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 dark:text-black/30 mb-6">Craftsmanship</span>
                        <h2 className="text-4xl md:text-6xl font-bold font-display text-white dark:text-black tracking-tighter leading-[0.9] mb-8">
                            Built with<br />
                            <span className="font-light italic opacity-40">Precision</span>
                        </h2>
                        <p className="text-white/60 dark:text-black/60 text-base md:text-lg leading-relaxed max-w-lg font-light mb-10">
                            We obsess over details. From typography to transitions, from load times to accessibility — we hold ourselves to the highest standards of quality. Nothing ships until it's world-class.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {['Pixel-Perfect', 'Performance-Optimised', 'Accessible'].map(badge => (
                                <span key={badge} className="px-4 py-2 rounded-full border border-white/10 dark:border-black/10 text-xs font-bold uppercase tracking-wider text-white/70 dark:text-black/70">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTION 7 — SOCIAL PROOF / CLIENT LOGOS
            ═══════════════════════════════════════════════════════ */}
            <section className="py-24 bg-gray-50 dark:bg-dark-900/30 border-y border-black/5 dark:border-white/5 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">Trusted By</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-display text-black dark:text-white tracking-tighter">
                            50+ Global Brands
                        </h2>
                    </AnimatedSection>
                    <ClientLogos />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTION 8 — FINAL CTA
            ═══════════════════════════════════════════════════════ */}
            <section className="py-40 md:py-60 relative overflow-hidden bg-white dark:bg-dark-950 transition-colors duration-500">
                <AnimatedSection className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-8xl font-bold font-display text-black dark:text-white mb-8 tracking-tighter leading-[0.9]">
                        Ready to{' '}
                        <span className="text-stroke-light dark:text-stroke-white italic font-light">Elevate</span>
                        <br />your brand?
                    </h2>
                    <p className="text-lg text-black/50 dark:text-gray-400 max-w-xl mx-auto mb-14 font-light leading-relaxed">
                        Let's create something extraordinary together. Whether you need a complete digital overhaul or a targeted solution — we're ready.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a
                            href="/contact"
                            className="group relative px-10 py-5 bg-black text-white dark:bg-white dark:text-dark-950 rounded-full font-bold text-lg hover:scale-105 transition-all duration-500 flex items-center gap-3"
                        >
                            Start a Project
                            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                        <a
                            href="/pricing"
                            className="px-10 py-5 rounded-full font-bold text-lg border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                        >
                            View Pricing
                        </a>
                    </div>

                    {/* Trust indicator */}
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-950 bg-gray-200 dark:bg-gray-800 transition-colors duration-500" />
                            ))}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-black/30 dark:text-white/30">
                            Join our growing portfolio
                        </span>
                    </div>
                </AnimatedSection>

                {/* Background branding watermark */}
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none">
                    <div className="text-huge opacity-[0.02] font-display text-center text-black dark:text-white">
                        LOVELLI.
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// ─── Service Card Component ─────────────────────────────────────────
function ServiceCard({ service, index, onClick }: {
    service: Service; index: number; onClick: () => void;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const tags = parseTags(service);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClick}
            className="group relative p-8 md:p-12 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white dark:bg-dark-950 hover:bg-gray-50 dark:hover:bg-dark-900 cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-1"
        >
            {/* Index */}
            <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-xs font-bold tracking-[0.4em] text-black/15 dark:text-white/15">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5" />
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-bold font-display text-black dark:text-white tracking-tighter leading-[1] mb-6 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {service.title}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="px-3 py-1 rounded-full border border-black/8 dark:border-white/8 text-xs font-medium text-black/50 dark:text-white/50 bg-black/[0.02] dark:bg-white/[0.02]"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Description */}
            <p className="text-base text-black/50 dark:text-gray-400 leading-relaxed font-light mb-8 line-clamp-3">
                {stripMarkdown(service.description)}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-3 text-sm font-bold text-black dark:text-white group-hover:gap-4 transition-all duration-300">
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    );
}
