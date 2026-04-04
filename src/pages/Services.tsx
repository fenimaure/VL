import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useVelocity, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ClientLogos from '../components/ClientLogos';
import ScrollReveal from '../components/ScrollReveal';
import MagneticHover from '../components/MagneticHover';
import SEO from '../components/SEO';
import ServiceComparison from '../components/ServiceComparison';
import {
    ArrowRight, ArrowUpRight, Sparkles, Zap,
    Target, Eye, Layers, Rocket, CheckCircle2,
    BarChart3, Users, Award, Heart, Search
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
    video_url?: string;
    color_accent?: string;
    testimonials?: any[];
    stats?: any[];
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

/* ═══════════════════════════════════════════════════════════════
   S-4: Animated Counter
   ═══════════════════════════════════════════════════════════════ */
function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10%' });

    useEffect(() => {
        if (!isInView) return;
        let t0: number | null = null;
        const step = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / 2000, 1);
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, end]);

    return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{count}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   S-1: Character-Level Reveal Animation
   ═══════════════════════════════════════════════════════════════ */
function CharacterReveal({ text, className = '', delay = 0, stroked = false }: {
    text: string; className?: string; delay?: number; stroked?: boolean;
}) {
    return (
        <span className={`inline-block overflow-hidden ${className}`}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ y: '120%', rotateX: -80, opacity: 0 }}
                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                    transition={{
                        duration: 1.2,
                        delay: delay + 0.03 * i,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ display: 'inline-block', transformOrigin: 'bottom' }}
                    className={stroked ? 'text-stroke-light dark:text-stroke-white' : ''}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-2: Velocity-Reactive Marquee
   ═══════════════════════════════════════════════════════════════ */
function VelocityMarquee() {
    const { scrollY } = useScroll();
    const velocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(velocity, { stiffness: 100, damping: 40 });
    const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [3, 1, 3]);
    const x = useRef(0);
    const [tickerX, setTickerX] = useState(0);

    useEffect(() => {
        let animId: number;
        const tick = () => {
            const currentVelocity = velocityFactor.get();
            // Reduced base speed from 0.5 to 0.08
            x.current -= 0.08 * currentVelocity;
            if (x.current <= -50) x.current = 0;
            setTickerX(x.current);
            animId = requestAnimationFrame(tick);
        };
        animId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animId);
    }, [velocityFactor]);

    const tripled = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];

    return (
        <section className="py-6 border-y border-black/5 dark:border-white/5 overflow-hidden bg-black dark:bg-white transition-colors duration-500">
            <div className="relative flex overflow-hidden">
                <div
                    className="velocity-marquee flex shrink-0"
                    style={{ transform: `translateX(${tickerX}%)` }}
                >
                    {tripled.map((word, i) => (
                        <span
                            key={i}
                            className={`marquee-word text-sm md:text-base font-bold tracking-[0.3em] uppercase whitespace-nowrap mx-8 md:mx-12 cursor-default ${
                                i % 3 === 0
                                    ? 'marquee-word-outlined text-white/60 dark:text-black/60'
                                    : 'text-white/60 dark:text-black/60'
                            }`}
                        >
                            {word}
                            <span className="ml-8 md:ml-12 text-white/20 dark:text-black/20">·</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-3: Immersive Service Card with Glassmorphism
   ═══════════════════════════════════════════════════════════════ */
function ServiceCard({ service, index, onClick }: {
    service: Service; index: number; onClick: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const tags = parseTags(service);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // S-3: Play video on hover
    useEffect(() => {
        if (!service.video_url || !videoRef.current) return;
        if (isHovered) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, [isHovered, service.video_url]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="service-card-glass group cursor-pointer"
            style={{ '--service-accent': service.color_accent || '#6366f1' } as React.CSSProperties}
            data-cursor="pointer"
            data-cursor-text="Explore"
        >
            {/* S-3: Video background on hover */}
            {service.video_url && (
                <video
                    ref={videoRef}
                    src={service.video_url}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="service-card-video-bg"
                />
            )}

            <div className="relative z-10 p-8 md:p-12">
                {/* Index line */}
                <div className="flex items-center gap-3 mb-8">
                    <span className="font-mono service-meta-label text-black/15 dark:text-white/15">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5 transition-colors" />
                    {/* Accent glow dot */}
                    <div
                        className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ backgroundColor: service.color_accent || '#6366f1' }}
                    />
                </div>

                {/* Title */}
                <h3 className="service-card-title font-display text-black dark:text-white mb-6 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {service.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 rounded-full border border-black/8 dark:border-white/8 text-xs font-medium text-black/50 dark:text-white/50 bg-black/[0.02] dark:bg-white/[0.02] group-hover:border-black/15 dark:group-hover:border-white/15 transition-all duration-300"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <p className="service-body-text text-black/50 dark:text-gray-400 mb-8 line-clamp-3">
                    {stripMarkdown(service.description)}
                </p>

                {/* Bottom bar: CTA + stats */}
                <div className="flex items-center justify-between gap-4 pt-6 border-t border-black/5 dark:border-white/5 transition-colors">
                    <div className="flex items-center gap-3 text-sm font-bold text-black dark:text-white group-hover:gap-4 transition-all duration-300">
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    {/* S-4: Inline stats */}
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-black/25 dark:text-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span>Premium</span>
                        <span>·</span>
                        <span>End-to-End</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-7: Full-Viewport Process Section
   ═══════════════════════════════════════════════════════════════ */
function ProcessSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const steps = [
        { icon: Eye, step: '01', title: 'Discovery', desc: 'Deep-dive into your brand, audience, competitors, and goals to uncover the right strategic direction.', duration: '1-2 weeks', deliverables: 'Research Report, Personas, Audit' },
        { icon: Layers, step: '02', title: 'Strategy', desc: 'We craft a data-driven roadmap that aligns your business objectives with creative execution.', duration: '1 week', deliverables: 'Strategy Deck, IA, Wireframes' },
        { icon: Zap, step: '03', title: 'Execution', desc: 'Our team brings the strategy to life with precision engineering, premium design, and meticulous QA.', duration: '2-6 weeks', deliverables: 'Design System, Code, Content' },
        { icon: Rocket, step: '04', title: 'Launch & Growth', desc: 'We deploy, optimise, and iterate — ensuring continuous performance improvement and scale.', duration: 'Ongoing', deliverables: 'Deployment, Analytics, Reports' },
    ];

    return (
        <section className="relative bg-white dark:bg-dark-950 transition-colors duration-500" ref={containerRef}>
            {/* Section Header */}
            <div className="sticky top-0 z-10 pt-32 pb-16 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xl transition-colors">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <ScrollReveal>
                        <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Our Process</span>
                        <h2 className="service-section-heading font-display text-black dark:text-white">
                            How We <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Work</span>
                        </h2>
                    </ScrollReveal>
                </div>
            </div>

            {/* Steps */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
                <div className="relative">
                    {/* Progress line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-black/5 dark:bg-white/5 md:-translate-x-px transition-colors" />
                    <motion.div
                        className="absolute left-8 md:left-1/2 top-0 w-[1px] md:-translate-x-px origin-top"
                        style={{
                            scaleY: scrollYProgress,
                            height: '100%',
                            backgroundColor: 'var(--service-accent, #6366f1)',
                        }}
                    />

                    {steps.map((item, idx) => (
                        <ScrollReveal key={idx} delay={idx * 0.1}>
                            <div className={`flex flex-col md:flex-row gap-8 md:gap-20 items-start md:items-center py-16 md:py-24 relative ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                                {/* Dot */}
                                <div className="absolute left-8 md:left-1/2 top-20 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="process-dot" />
                                </div>

                                {/* Icon Block */}
                                <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'md:text-right md:pr-20' : 'md:text-left md:pl-20'} pl-20 md:pl-0`}>
                                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-dark-950 mb-6 transition-colors ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}>
                                        <item.icon className="w-8 h-8 text-black dark:text-white" />
                                    </div>
                                    <div className="font-mono service-meta-label text-black/20 dark:text-white/20 mb-2">{item.step}</div>
                                    <h3 className="text-3xl md:text-4xl font-bold font-display text-black dark:text-white mb-4 transition-colors">{item.title}</h3>
                                </div>

                                {/* Content Block */}
                                <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'md:pl-20' : 'md:pr-20'} pl-20 md:pl-0`}>
                                    <p className="service-body-text text-black/60 dark:text-gray-400 mb-6 transition-colors">{item.desc}</p>
                                    <div className="flex flex-wrap gap-4">
                                        <span className="px-4 py-2 rounded-full bg-black/[0.03] dark:bg-white/[0.03] text-xs font-bold text-black/50 dark:text-white/50 border border-black/5 dark:border-white/5 transition-colors">
                                            ⏱ {item.duration}
                                        </span>
                                        <span className="px-4 py-2 rounded-full bg-black/[0.03] dark:bg-white/[0.03] text-xs font-bold text-black/50 dark:text-white/50 border border-black/5 dark:border-white/5 transition-colors">
                                            📦 {item.deliverables}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-8: Stats with Orbital Layout
   ═══════════════════════════════════════════════════════════════ */
function StatsSection() {
    const stats = [
        { number: 150, suffix: '+', label: 'Works Delivered', icon: Target },
        { number: 98, suffix: '%', label: 'Client Satisfaction', icon: Heart },
        { number: 50, suffix: '+', label: 'Global Brands', icon: Users },
        { number: 10, suffix: '+', label: 'Years Experience', icon: Award },
    ];

    return (
        <section className="py-28 border-y border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-dark-900/30 transition-colors duration-500 relative overflow-hidden">
            {/* Background decorative number */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-[25vw] font-black font-display text-black/[0.015] dark:text-white/[0.03] leading-none transition-colors">∞</span>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-20">
                        <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block transition-colors">Why Choose Us</span>
                        <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                            Results That <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Speak</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, idx) => (
                        <ScrollReveal key={idx} delay={idx * 0.1}>
                            <div className="text-center group">
                                <stat.icon className="h-7 w-7 mx-auto mb-4 text-black dark:text-white group-hover:scale-110 transition-transform" />
                                <div className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-2 font-display tracking-tight transition-colors">
                                    <CountUp end={stat.number} suffix={stat.suffix} />
                                </div>
                                <div className="service-meta-label text-black/40 dark:text-white/40 transition-colors">
                                    {stat.label}
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-9: Split Feature Highlights
   ═══════════════════════════════════════════════════════════════ */
function FeatureHighlights() {
    const highlights = [
        {
            label: 'Approach',
            title: 'Strategy-First',
            titleAccent: 'Thinking',
            desc: "We don't just design and build — we start with deep strategic analysis. Every pixel, every interaction, every line of code is backed by data and aligned with your business objectives.",
            badges: ['Data-Driven', 'ROI-Focused', 'Measurable Impact'],
            icons: [BarChart3, Target, CheckCircle2, Zap],
            num: '01',
        },
        {
            label: 'Craftsmanship',
            title: 'Built with',
            titleAccent: 'Precision',
            desc: 'We obsess over details. From typography to transitions, from load times to accessibility — we hold ourselves to the highest standards of quality.',
            badges: ['Pixel-Perfect', 'Performance-Optimised', 'Accessible'],
            icons: [Layers, Eye, Sparkles, Rocket],
            num: '02',
        },
    ];

    return (
        <section className="bg-black dark:bg-white transition-colors duration-500">
            {highlights.map((h, idx) => (
                <div key={idx} className={`grid grid-cols-1 lg:grid-cols-2 min-h-[600px] ${idx > 0 ? 'border-t border-white/5 dark:border-black/5' : ''}`}>
                    {/* Text side */}
                    <ScrollReveal className={`flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 ${idx % 2 !== 0 ? 'order-1 lg:order-2' : ''}`}>
                        <span className="service-meta-label text-white/30 dark:text-black/30 mb-6">{h.label}</span>
                        <h2 className="text-4xl md:text-6xl font-bold font-display text-white dark:text-black tracking-tighter leading-[0.9] mb-8 transition-colors">
                            {h.title}<br />
                            <span className="font-light italic opacity-40">{h.titleAccent}</span>
                        </h2>
                        <p className="service-body-text text-white/60 dark:text-black/60 max-w-lg mb-10">{h.desc}</p>
                        <div className="flex flex-wrap gap-3">
                            {h.badges.map(badge => (
                                <span key={badge} className="px-4 py-2 rounded-full border border-white/10 dark:border-black/10 text-xs font-bold uppercase tracking-wider text-white/70 dark:text-black/70">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* Visual side */}
                    <div className={`relative overflow-hidden min-h-[400px] lg:min-h-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 flex items-center justify-center ${idx % 2 !== 0 ? 'order-2 lg:order-1' : ''}`}>
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                            <span className="text-[20vw] font-black font-display leading-none select-none text-white dark:text-black">{h.num}</span>
                        </div>
                        <div className="relative grid grid-cols-2 gap-4 p-12">
                            {h.icons.map((Icon, i) => (
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
            ))}
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-12: Testimonials Carousel
   ═══════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
    const testimonials = [
        { quote: "Lovelli transformed our entire digital presence. The attention to detail and strategic thinking was beyond our expectations.", author: "Client Partner", role: "Brand Director" },
        { quote: "Working with this team felt like having an in-house creative studio. They understood our vision from day one.", author: "Tech Startup", role: "Founder & CEO" },
        { quote: "The results speak for themselves — 300% increase in engagement and a brand identity we're truly proud of.", author: "E-Commerce Brand", role: "Marketing Lead" },
    ];
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <section className="py-32 bg-white dark:bg-dark-950 transition-colors duration-500 relative overflow-hidden">
            <div className="absolute top-20 left-20 text-[20rem] font-black font-display text-black/[0.015] dark:text-white/[0.02] leading-none pointer-events-none select-none">"</div>

            <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Testimonials</span>
                        <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                            Client <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Voices</span>
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="relative min-h-[250px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="testimonial-card text-center"
                        >
                            <p className="text-2xl md:text-3xl font-light text-black dark:text-white leading-relaxed mb-8 font-display italic transition-colors">
                                "{testimonials[active].quote}"
                            </p>
                            <div>
                                <div className="font-bold text-black dark:text-white text-sm transition-colors">{testimonials[active].author}</div>
                                <div className="service-meta-label text-black/40 dark:text-white/40 mt-1">{testimonials[active].role}</div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination dots */}
                <div className="flex items-center justify-center gap-3 mt-10">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-black dark:bg-white' : 'bg-black/15 dark:bg-white/15 hover:bg-black/30 dark:hover:bg-white/30'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-13: CTA Section with Inline Form
   ═══════════════════════════════════════════════════════════════ */
function CTASection({ services }: { services: Service[] }) {
    const [formData, setFormData] = useState({ name: '', email: '', service: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await supabase.from('inquiries').insert({
                name: formData.name,
                email: formData.email,
                message: `Service Interest: ${formData.service || 'General'}`,
                source: 'services-page',
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-40 md:py-60 relative overflow-hidden bg-black dark:bg-dark-950 transition-colors duration-500">
            <div className="noise-overlay" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <ScrollReveal>
                    <h2 className="text-5xl md:text-8xl font-bold font-display text-white mb-8 tracking-tighter leading-[0.9]">
                        Ready to{' '}
                        <span className="italic font-light" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', WebkitTextFillColor: 'transparent' }}>Elevate</span>
                        <br />your brand?
                    </h2>
                    <p className="text-lg text-white/40 max-w-xl mx-auto mb-14 font-light leading-relaxed">
                        Let's create something extraordinary together. Whether you need a complete digital overhaul or a targeted solution — we're ready.
                    </p>
                </ScrollReveal>

                {/* Inline Form */}
                <ScrollReveal delay={0.2}>
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">We'll be in touch!</h3>
                            <p className="text-white/50">Expect a reply within 24 hours.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    className="service-form-input"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    required
                                    className="service-form-input"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <select
                                className="service-form-input"
                                value={formData.service}
                                onChange={e => setFormData(prev => ({ ...prev, service: e.target.value }))}
                            >
                                <option value="">Select a service (optional)</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.title}>{s.title}</option>
                                ))}
                            </select>
                            <MagneticHover strength={0.2}>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {submitting ? 'Sending...' : 'Start a Dialogue'}
                                    <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </MagneticHover>
                        </form>
                    )}
                </ScrollReveal>

                {/* Trust indicator */}
                <div className="mt-16 flex items-center justify-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-700" />
                        ))}
                    </div>
                    <span className="service-meta-label text-white/30">
                        Join our growing portfolio
                    </span>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE — S-1 to S-14
   ═══════════════════════════════════════════════════════════════ */
export default function Services() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const heroBlur = useTransform(scrollYProgress, [0.5, 1], ['blur(0px)', 'blur(10px)']);

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

    // S-5: Extract unique categories
    const categories = [...new Set(services.map(s => {
        const tags = parseTags(s);
        return tags[0] || 'General';
    }))];

    // S-5 + S-6: Filtered services
    const filteredServices = services.filter(s => {
        const matchesFilter = filter === 'all' || parseTags(s).some(t => t.toLowerCase() === filter.toLowerCase());
        const matchesSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // S-14: JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Services | Lovelli Digital Boutique',
        description: 'Premium digital services for world-class brands.',
        itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Service',
                name: s.title,
                description: stripMarkdown(s.description),
                url: `https://lovelli.ph/services/${s.slug}`,
            },
        })),
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 transition-colors duration-500">
            <SEO
                title="Our Services | Lovelli Digital Boutique"
                description="Premium digital services: strategy, design, development, branding, social media management, and growth solutions for world-class brands."
            />

            {/* S-14: JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <Navbar />

            {/* ═══════════════════════════════════════════════════════
                S-1: KINETIC HERO
            ═══════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden service-hero-gradient">
                {/* S-1: Noise texture */}
                <div className="noise-overlay" />

                {/* Floating geometric shapes */}
                <div className="absolute top-1/4 left-[15%] w-16 h-16 border border-black/5 dark:border-white/5 rounded-2xl floating-shape hidden md:block" />
                <div className="absolute top-1/3 right-[20%] w-10 h-10 border border-black/5 dark:border-white/5 rounded-full floating-shape-reverse hidden md:block" />
                <div className="absolute bottom-1/3 left-[25%] w-8 h-8 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl floating-shape hidden md:block" />
                <div className="absolute bottom-1/4 right-[15%] w-14 h-14 border border-black/3 dark:border-white/3 rounded-full floating-shape-reverse hidden md:block" />

                {/* Grid line overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                    }}
                />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity, filter: heroBlur }}
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
                        <span className="service-meta-label text-black dark:text-white">Our Services</span>
                    </motion.div>

                    {/* S-1: Character-level reveal headline */}
                    <h1 className="service-hero-title font-display text-black dark:text-white mb-4 transition-colors">
                        <span className="block">
                            <CharacterReveal text="Crafting" delay={0.2} />
                        </span>
                        <span className="block mt-2">
                            <CharacterReveal text="Digital Excellence" delay={0.5} stroked />
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="text-lg md:text-xl text-black/50 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-14 font-light"
                    >
                        We architect end-to-end digital ecosystems — from high-performance platforms to
                        brand-defining experiences — that drive measurable growth.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <MagneticHover strength={0.2}>
                            <a
                                href="#services-grid"
                                className="group px-8 py-4 bg-black dark:bg-white text-white dark:text-dark-950 rounded-full font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Explore Services
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </MagneticHover>
                        <MagneticHover strength={0.15}>
                            <a
                                href="/contact"
                                className="group px-8 py-4 bg-transparent backdrop-blur-sm text-black dark:text-white rounded-full font-bold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                            >
                                Start a Work
                            </a>
                        </MagneticHover>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <div className="flex flex-col items-center gap-2">
                        <span className="service-meta-label text-black/30 dark:text-white/30">Scroll</span>
                        <div className="w-[2px] h-12 bg-gradient-to-b from-black/20 to-transparent dark:from-white/20" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                S-2: VELOCITY MARQUEE
            ═══════════════════════════════════════════════════════ */}
            <VelocityMarquee />

            {/* ═══════════════════════════════════════════════════════
                S-3/S-4/S-5/S-6: SERVICES GRID
            ═══════════════════════════════════════════════════════ */}
            <section id="services-grid" className="py-32 md:py-40 bg-white dark:bg-dark-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Section Header */}
                    <ScrollReveal className="mb-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-black dark:text-white">
                                        <Zap className="w-4 h-4 fill-current" />
                                    </span>
                                    <span className="service-meta-label text-black dark:text-white">What We Do</span>
                                </div>
                                <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                                    Expert <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Solutions</span>
                                </h2>
                            </div>
                            <p className="service-body-text text-black/50 dark:text-gray-400 max-w-md transition-colors">
                                Every service is architected for measurable impact — combining strategic thinking with relentless craft.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* S-4: Stats bar */}
                    <ScrollReveal className="mb-16">
                        <div className="flex items-center gap-8 md:gap-12 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-black dark:text-white font-display">
                                    <CountUp end={services.length} />
                                </span>
                                <span className="service-meta-label text-black/30 dark:text-white/30">Services</span>
                            </div>
                            <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-black dark:text-white font-display">
                                    <CountUp end={categories.length} />
                                </span>
                                <span className="service-meta-label text-black/30 dark:text-white/30">Categories</span>
                            </div>
                            <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-black dark:text-white font-display">
                                    <CountUp end={150} suffix="+" />
                                </span>
                                <span className="service-meta-label text-black/30 dark:text-white/30">Projects</span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* S-5: Filter tabs + S-6: Search */}
                    <ScrollReveal className="mb-12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <MagneticHover strength={0.1}>
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                            filter === 'all'
                                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                                : 'border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                                        }`}
                                    >
                                        All <span className="ml-1 opacity-50">{services.length}</span>
                                    </button>
                                </MagneticHover>
                                {categories.map(cat => (
                                    <MagneticHover key={cat} strength={0.1}>
                                        <button
                                            onClick={() => setFilter(cat)}
                                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                                filter === cat
                                                    ? 'bg-black text-white dark:bg-white dark:text-black'
                                                    : 'border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    </MagneticHover>
                                ))}
                            </div>

                            {/* S-6: Search */}
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full sm:w-64 pl-11 pr-4 py-3 rounded-full border border-black/10 dark:border-white/10 bg-transparent text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors"
                                />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* S-3: Cards Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                        </div>
                    ) : (
                        <>
                            <AnimatePresence mode="popLayout">
                                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredServices.map((service, index) => (
                                        <motion.div
                                            key={service.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <ServiceCard
                                                service={service}
                                                index={index}
                                                onClick={() => navigate(`/services/${service.slug}`)}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {filteredServices.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-black/40 dark:text-white/40 text-lg">No services match your search.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                S-8: STATS SECTION
            ═══════════════════════════════════════════════════════ */}
            <StatsSection />

            {/* ═══════════════════════════════════════════════════════
                S-7: PROCESS SECTION
            ═══════════════════════════════════════════════════════ */}
            <ProcessSection />

            {/* ═══════════════════════════════════════════════════════
                S-9: FEATURE HIGHLIGHTS
            ═══════════════════════════════════════════════════════ */}
            <FeatureHighlights />

            {/* ═══════════════════════════════════════════════════════
                S-10: CLIENT LOGOS
            ═══════════════════════════════════════════════════════ */}
            <section className="py-24 bg-gray-50 dark:bg-dark-900/30 border-y border-black/5 dark:border-white/5 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <ScrollReveal className="text-center mb-16">
                        <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Trusted By</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-display text-black dark:text-white tracking-tighter transition-colors">
                            50+ Global Brands
                        </h2>
                    </ScrollReveal>
                    <ClientLogos />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                S-11: COMPARISON MATRIX
            ═══════════════════════════════════════════════════════ */}
            <section className="py-32 bg-white dark:bg-dark-950 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <ScrollReveal className="mb-16">
                        <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Compare</span>
                        <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                            Service <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Matrix</span>
                        </h2>
                    </ScrollReveal>
                    <ServiceComparison services={services} />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                S-12: TESTIMONIALS
            ═══════════════════════════════════════════════════════ */}
            <TestimonialsSection />

            {/* ═══════════════════════════════════════════════════════
                S-13: CTA WITH FORM
            ═══════════════════════════════════════════════════════ */}
            <CTASection services={services} />

            <Footer />
        </div>
    );
}
