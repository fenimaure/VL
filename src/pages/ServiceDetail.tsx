import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ArrowRight, Sparkles, Zap, Shield, Target, Package, FileText, Palette, Code2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import MagneticHover from '../components/MagneticHover';
import SEO from '../components/SEO';
import ServiceFAQ from '../components/ServiceFAQ';
import ServicePricing from '../components/ServicePricing';
import ServiceScope from '../components/ServiceScope';

/* ═══════════════════════════════════════════════════════════════
   S-16: Metrics Strip Counter
   ═══════════════════════════════════════════════════════════════ */
function MetricCounter({ value, label }: { value: string; label: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const numericMatch = value.match(/^(\d+)/);
    const [count, setCount] = useState(0);
    const suffix = numericMatch ? value.slice(numericMatch[1].length) : '';

    useEffect(() => {
        if (!isInView || !numericMatch) return;
        const end = parseInt(numericMatch[1]);
        let t0: number | null = null;
        const step = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / 1800, 1);
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, numericMatch]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-display text-black dark:text-white tracking-tight transition-colors" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {numericMatch ? `${count}${suffix}` : value}
            </div>
            <div className="service-meta-label text-black/30 dark:text-white/30 mt-1 transition-colors">{label}</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-20: Deliverables Grid — "What You Receive"
   ═══════════════════════════════════════════════════════════════ */
const DELIVERABLE_ICONS: Record<string, any> = {
    pdf: FileText, guide: FileText, document: FileText, report: FileText,
    figma: Palette, design: Palette, style: Palette, brand: Palette,
    react: Code2, code: Code2, codebase: Code2, github: Code2, component: Code2,
    default: Package,
};

function getDeliverableIcon(item: string) {
    const lower = item.toLowerCase();
    for (const [key, Icon] of Object.entries(DELIVERABLE_ICONS)) {
        if (key !== 'default' && lower.includes(key)) return Icon;
    }
    return DELIVERABLE_ICONS.default;
}

function DeliverablesGrid({ deliverables }: { deliverables: { item: string; format?: string }[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10%' });

    if (!deliverables || deliverables.length === 0) return null;

    return (
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {deliverables.map((d, i) => {
                const Icon = getDeliverableIcon(d.item);
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative p-6 md:p-8 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-dark-950 hover:border-[var(--service-accent)]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 text-center"
                    >
                        <Icon className="w-8 h-8 mx-auto mb-4 service-accent-text opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                        <h4 className="text-sm font-bold text-black dark:text-white mb-1 font-display transition-colors">{d.item}</h4>
                        {d.format && (
                            <span className="service-meta-label text-black/30 dark:text-white/30">{d.format}</span>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   S-27: Floating TOC Sidebar (reuses WorkDetail W-18 pattern)
   ═══════════════════════════════════════════════════════════════ */
const SERVICE_TOC_SECTIONS = [
    { id: 'svc-scope', label: 'Scope' },
    { id: 'svc-features', label: 'Features' },
    { id: 'svc-deliverables', label: 'Deliverables' },
    { id: 'svc-process', label: 'Process' },
    { id: 'svc-tools', label: 'Tools' },
    { id: 'svc-pricing', label: 'Pricing' },
    { id: 'svc-works', label: 'Works' },
    { id: 'svc-faq', label: 'FAQ' },
    { id: 'svc-testimonials', label: 'Voices' },
    { id: 'svc-next', label: 'Next' },
];

function ServiceFloatingTOC() {
    const [activeSection, setActiveSection] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '-20% 0px -60% 0px' }
        );

        SERVICE_TOC_SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const scrollHandler = () => {
            setIsVisible(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', scrollHandler);
        };
    }, []);

    const scrollToSection = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const availableSections = SERVICE_TOC_SECTIONS.filter(({ id }) => document.getElementById(id));
    if (availableSections.length === 0) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="toc-sidebar hidden xl:flex flex-col items-start gap-4"
                    aria-label="Service sections"
                >
                    <div className="absolute left-[3px] top-0 bottom-0 w-[2px] bg-black/5 dark:bg-white/5 rounded-full" />
                    {availableSections.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => scrollToSection(id)}
                            className="toc-item flex items-center gap-3 relative group"
                            aria-label={`Jump to ${label}`}
                        >
                            <div className={`toc-dot ${activeSection === id ? 'active' : ''}`}
                                style={activeSection === id ? { background: 'var(--service-accent, #6366f1)', borderColor: 'var(--service-accent, #6366f1)' } : {}}
                            />
                            <span className={`toc-label text-[10px] font-bold uppercase tracking-widest ${activeSection === id ? 'service-accent-text opacity-100 translate-x-0' : 'text-black/40 dark:text-white/40'}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN: ServiceDetail Page
   ═══════════════════════════════════════════════════════════════ */
export default function ServiceDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [relatedWorks, setRelatedWorks] = useState<any[]>([]);
    const [nextService, setNextService] = useState<any>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    // S-38: Scroll progress bar
    const { scrollYProgress } = useScroll();

    // S-15: Hero parallax
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(heroProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        async function fetchData() {
            if (!slug) return;
            try {
                // Fetch current service
                const { data: serviceData, error } = await supabase.from('services').select('*').eq('slug', slug).single();
                if (error) throw error;
                setService(serviceData);

                // S-35: Set accent color
                if (serviceData?.color_accent) {
                    document.documentElement.style.setProperty('--service-accent', serviceData.color_accent);
                }

                // Fetch all services for next nav
                const { data: allData } = await supabase.from('services').select('*').order('created_at', { ascending: true });

                // S-26: Find next service
                if (allData && allData.length > 1) {
                    const idx = allData.findIndex((s: any) => s.slug === slug);
                    const nextIdx = (idx + 1) % allData.length;
                    setNextService(allData[nextIdx]);
                }

                // S-23: Fetch related works
                const { data: works } = await supabase.from('works').select('id, title, slug, image_url, category').limit(6);
                setRelatedWorks(works || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        window.scrollTo(0, 0);

        return () => {
            document.documentElement.style.setProperty('--service-accent', '#6366f1');
        };
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center">
        </div>
    );

    if (!service) return (
        <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-display text-black dark:text-white mb-4">Service Not Found</h1>
                <Link to="/services" className="text-primary-500 hover:underline">Back to Services</Link>
            </div>
        </div>
    );

    const featureIcons = [Sparkles, Zap, Shield, Target];
    const features = service.features || ['Premium Integration', 'Strategic Thinking', 'Technical Excellence', 'Measured Results'];
    const deliverables = service.deliverables || [];
    const processSteps = service.process_steps || [];
    const faqs = service.faqs || [];
    const pricingTiers = service.pricing_tiers || [];
    const testimonials = service.testimonials || [];
    const tools = service.tools_used || [];
    const stats = service.stats || [
        { value: '300%', label: 'Average ROI' },
        { value: '48hr', label: 'Response Time' },
        { value: '98%', label: 'Satisfaction' },
        { value: '50+', label: 'Delivered' },
    ];

    // Default scope items from features
    const scopeItems = service.deliverables?.length > 0
        ? service.deliverables.map((d: any) => ({ title: d.item, description: d.format, items: [] }))
        : [
            { title: 'Strategy & Research', description: 'Market research, competitor analysis, user personas, brand positioning.', items: ['Market Research', 'Competitor Audit', 'User Personas', 'Brand Positioning'] },
            { title: 'Design & Prototyping', description: 'High-fidelity design and interactive prototyping.', items: ['UI/UX Design', 'Figma Prototypes', 'Design System', 'Responsive Layouts'] },
            { title: 'Development & QA', description: 'Clean code, rigorous testing, performance optimization.', items: ['Frontend Development', 'Backend Integration', 'QA Testing', 'Performance Audit'] },
            { title: 'Launch & Training', description: 'Deployment, onboarding, and handover documentation.', items: ['Deployment', 'Client Training', 'Documentation', 'Post-Launch Support'] },
        ];

    // S-28: JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.description,
        provider: { '@type': 'Organization', name: 'Lovelli Digital Boutique' },
        areaServed: { '@type': 'Country', name: 'Philippines' },
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 overflow-x-hidden transition-colors duration-500">
            <SEO
                title={`${service.title} | Lovelli`}
                description={service.description?.slice(0, 160)}
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* S-38: Scroll Progress Bar */}
            <motion.div
                className="scroll-progress-bar"
                style={{ scaleX: scrollYProgress }}
            />

            <Navbar />

            {/* S-27: Floating TOC Sidebar (desktop only) */}
            <ServiceFloatingTOC />

            {/* ═══════════════════════════════════════════════════════
                S-15: CINEMATIC HERO
            ═══════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-end pt-40 pb-20 overflow-hidden">
                {/* Background media */}
                {/* S-42: eager load hero media for LCP */}
                <div className="absolute inset-0 z-0">
                    {service.video_url ? (
                        <video
                            src={service.video_url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="absolute inset-0 w-full h-full object-cover scale-110 opacity-30"
                        />
                    ) : service.image_url ? (
                        <img
                            src={service.image_url}
                            alt=""
                            loading="eager"
                            className="absolute inset-0 w-full h-full object-cover scale-110 opacity-30 blur-sm"
                        />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-dark-950 dark:via-dark-950/80 dark:to-dark-950/40 transition-colors duration-500" />
                    {/* Accent color gradient overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{ background: `linear-gradient(135deg, ${service.color_accent || '#6366f1'} 0%, transparent 60%)` }}
                    />
                </div>

                <div className="noise-overlay" />

                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                    {/* Back link */}
                    <MagneticHover strength={0.15}>
                        <Link to="/services" className="inline-flex items-center gap-4 service-meta-label text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white mb-12 transition-all group" data-cursor="pointer">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
                            All Services
                        </Link>
                    </MagneticHover>

                    <div className="space-y-4 mb-20 max-w-4xl">
                        {/* Label */}
                        <ScrollReveal>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-12 h-[1px] service-accent-bg" />
                                <span className="service-accent-text font-bold tracking-[0.3em] text-[10px] uppercase">Service Excellence</span>
                            </div>
                        </ScrollReveal>

                        {/* Title — word split */}
                        <ScrollReveal delay={0.1}>
                            <h1 className="service-hero-title font-display text-black dark:text-white transition-colors">
                                {service.title.split(' ').map((word: string, i: number) => (
                                    <span key={i} className={`block ${i % 2 !== 0 ? 'text-stroke-light dark:text-stroke-white italic font-light' : ''}`}>
                                        {word}{i === service.title.split(' ').length - 1 ? '.' : ''}
                                    </span>
                                ))}
                            </h1>
                        </ScrollReveal>

                        {/* Subtitle */}
                        {service.subtitle && (
                            <ScrollReveal delay={0.3}>
                                <p className="text-xl text-black/60 dark:text-gray-400 font-light max-w-2xl mt-6 transition-colors">
                                    {service.subtitle}
                                </p>
                            </ScrollReveal>
                        )}
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-10 z-10">
                    <div className="h-20 w-[1px] bg-gradient-to-b from-[var(--service-accent)] to-transparent" />
                    <span className="service-meta-label text-black/20 dark:text-white/20 [writing-mode:vertical-rl] transition-colors">Infinite Craft</span>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                S-16: METRICS STRIP
            ═══════════════════════════════════════════════════════ */}
            {/* S-41: Mobile 2×2 grid for metrics */}
            <section className="py-10 border-y border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] transition-colors">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat: any, i: number) => (
                            <MetricCounter key={i} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                S-17: INTERACTIVE SCOPE
            ═══════════════════════════════════════════════════════ */}
            <section id="svc-scope" className="py-24 md:py-32 bg-white dark:bg-dark-950 transition-colors">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <ScrollReveal className="mb-16">
                        <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Scope</span>
                        <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                            What's <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Included</span>
                        </h2>
                    </ScrollReveal>
                    <ServiceScope scope={scopeItems} />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                S-18: BENTO FEATURES GRID
            ═══════════════════════════════════════════════════════ */}
            <section id="svc-features" className="py-24 md:py-32 bg-black/[0.01] dark:bg-white/[0.01] border-y border-black/5 dark:border-white/5 relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 p-20 opacity-[0.02] text-[20vw] font-black font-display leading-[0.8] select-none pointer-events-none text-black dark:text-white transition-colors">
                    CRAFT.
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <ScrollReveal className="mb-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                            <div className="max-w-2xl">
                                <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Capabilities</span>
                                <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                                    Defining <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Excellence</span>
                                </h2>
                            </div>
                            <p className="service-body-text text-black/60 dark:text-gray-400 max-w-md transition-colors">
                                Core pillars refined over years to deliver unparalleled value.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* S-18: Bento Grid — S-41: single col on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden transition-colors">
                        {(Array.isArray(features) ? features : [features]).map((feature: any, idx: number) => {
                            const Icon = featureIcons[idx % featureIcons.length];
                            const title = typeof feature === 'string' ? feature : feature?.title || '';
                            const desc = typeof feature === 'string'
                                ? 'Implementing world-class standards through rigorous testing and human-centered design.'
                                : feature?.description || '';
                            return (
                                <ScrollReveal key={idx} delay={idx * 0.1}>
                                    <div className="group bg-white dark:bg-dark-950 p-8 md:p-16 hover:bg-gray-50 dark:hover:bg-white transition-all duration-700">
                                        <Icon className="h-8 w-8 md:h-10 md:w-10 service-accent-text mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500" />
                                        <h3 className="text-xl md:text-3xl font-bold text-black dark:text-white group-hover:text-black dark:group-hover:text-dark-950 transition-colors mb-3 md:mb-4 font-display">
                                            {title}
                                        </h3>
                                        <p className="text-sm md:text-base text-black/60 dark:text-gray-400 group-hover:text-black/80 dark:group-hover:text-dark-950/60 transition-colors leading-relaxed">
                                            {desc}
                                        </p>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                S-20: DELIVERABLES GRID — "What You Receive"
            ═══════════════════════════════════════════════════════ */}
            {deliverables.length > 0 && (
                <section id="svc-deliverables" className="py-24 md:py-32 bg-white dark:bg-dark-950 transition-colors">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <ScrollReveal className="mb-16">
                            <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Deliverables</span>
                            <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                                What You <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Receive</span>
                            </h2>
                        </ScrollReveal>
                        <DeliverablesGrid deliverables={deliverables} />
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                S-19: PROCESS TIMELINE
            ═══════════════════════════════════════════════════════ */}
            {processSteps.length > 0 && (
                <section id="svc-process" className="py-24 md:py-32 bg-white dark:bg-dark-950 transition-colors">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <ScrollReveal className="mb-20">
                            <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Methodology</span>
                            <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                                Our <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Process</span>
                            </h2>
                        </ScrollReveal>

                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-black/5 dark:bg-white/5 transition-colors" />
                            {processSteps.map((step: any, idx: number) => (
                                <ScrollReveal key={idx} delay={idx * 0.1}>
                                    <div className="flex gap-8 md:gap-12 mb-16 last:mb-0 relative">
                                        <div className="flex-shrink-0 relative z-10">
                                            <div className="w-16 h-16 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-dark-950 flex items-center justify-center transition-colors">
                                                <span className="service-meta-label service-accent-text">{step.phase || String(idx + 1).padStart(2, '0')}</span>
                                            </div>
                                        </div>
                                        <div className="pt-3">
                                            <h3 className="text-2xl font-bold font-display text-black dark:text-white mb-2 transition-colors">{step.title}</h3>
                                            {step.duration && (
                                                <span className="inline-block px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.03] service-meta-label text-black/40 dark:text-white/40 mb-4 transition-colors">
                                                    ⏱ {step.duration}
                                                </span>
                                            )}
                                            <p className="service-body-text text-black/60 dark:text-gray-400 max-w-xl transition-colors">{step.description}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                S-21: TOOLS & TECHNOLOGIES
            ═══════════════════════════════════════════════════════ */}
            {tools.length > 0 && (
                <section id="svc-tools" className="py-20 border-y border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] transition-colors">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <ScrollReveal>
                            <span className="service-meta-label text-black/40 dark:text-white/40 mb-6 block">Tools & Technologies</span>
                            <div className="flex flex-wrap gap-3">
                                {tools.map((tool: string, i: number) => (
                                    <MagneticHover key={i} strength={0.1}>
                                        <span className="px-5 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-medium text-black/70 dark:text-white/70 hover:service-accent-border hover:service-accent-text transition-all duration-300 cursor-default">
                                            {tool}
                                        </span>
                                    </MagneticHover>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                S-22: PRICING SECTION
            ═══════════════════════════════════════════════════════ */}
            {/* S-41: horizontal scroll pricing on mobile */}
            {pricingTiers.length > 0 && (
                <section id="svc-pricing" className="py-24 md:py-32 bg-white dark:bg-dark-950 transition-colors">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <ScrollReveal className="mb-16">
                            <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Investment</span>
                            <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                                Transparent <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Pricing</span>
                            </h2>
                        </ScrollReveal>
                        <ServicePricing tiers={pricingTiers} onContact={(tier) => navigate(`/contact?service=${service.title}&tier=${tier}`)} />
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                S-23: RELATED CASE STUDIES
            ═══════════════════════════════════════════════════════ */}
            {/* S-42: lazy loading on all related work images */}
            {relatedWorks.length > 0 && (
                <section id="svc-works" className="py-24 md:py-32 bg-black/[0.01] dark:bg-white/[0.01] border-y border-black/5 dark:border-white/5 transition-colors">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <ScrollReveal className="mb-16">
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Case Studies</span>
                                    <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                                        Related <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Works</span>
                                    </h2>
                                </div>
                                <MagneticHover strength={0.15}>
                                    <Link to="/works" className="hidden md:flex items-center gap-2 service-meta-label text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors group" data-cursor="pointer">
                                        View All
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </MagneticHover>
                            </div>
                        </ScrollReveal>

                        {/* Horizontal scroll carousel */}
                        <div className="flex gap-6 overflow-x-auto scrollbar-hide horizontal-scroll-touch pb-4">
                            {relatedWorks.map((work, i) => (
                                <Link
                                    key={work.id}
                                    to={`/works/${work.slug}`}
                                    className="group flex-shrink-0 block"
                                    style={{ width: 'min(80vw, 400px)' }}
                                    data-cursor="view"
                                    data-cursor-text="View"
                                >
                                    <ScrollReveal delay={i * 0.1}>
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 premium-image-treatment">
                                            <img
                                                src={work.image_url}
                                                alt={work.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-4 h-[1px] service-accent-bg" />
                                            <span className="service-meta-label service-accent-text">{work.category}</span>
                                        </div>
                                        <h3 className="text-lg font-bold font-display text-black dark:text-white group-hover:text-primary-500 transition-colors">
                                            {work.title}
                                        </h3>
                                    </ScrollReveal>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                S-24: FAQ SECTION
            ═══════════════════════════════════════════════════════ */}
            {faqs.length > 0 && (
                <section id="svc-faq" className="py-24 md:py-32 bg-white dark:bg-dark-950 transition-colors">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8">
                        <ScrollReveal className="mb-16">
                            <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">FAQ</span>
                            <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                                Frequently <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Asked</span>
                            </h2>
                        </ScrollReveal>
                        <ServiceFAQ faqs={faqs} />
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                S-25: TESTIMONIALS
            ═══════════════════════════════════════════════════════ */}
            {testimonials.length > 0 && (
                <section id="svc-testimonials" className="py-24 md:py-32 bg-black/[0.01] dark:bg-white/[0.01] border-y border-black/5 dark:border-white/5 relative overflow-hidden transition-colors">
                    <div className="absolute top-10 left-10 text-[15rem] font-black font-display text-black/[0.015] dark:text-white/[0.02] leading-none pointer-events-none select-none">"</div>
                    <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
                        <ScrollReveal className="mb-16">
                            <span className="service-meta-label text-black/40 dark:text-white/40 mb-4 block">Testimonials</span>
                            <h2 className="service-section-heading font-display text-black dark:text-white transition-colors">
                                Client <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Voices</span>
                            </h2>
                        </ScrollReveal>

                        <div className="space-y-8">
                            {testimonials.map((t: any, i: number) => (
                                <ScrollReveal key={i} delay={i * 0.15} variant="scaleReveal">
                                    <div className="testimonial-card">
                                        <p className="text-xl md:text-2xl font-light text-black dark:text-white leading-relaxed mb-6 italic font-display transition-colors">
                                            "{t.quote}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            {t.avatar_url && (
                                                <img src={t.avatar_url} alt={t.author} className="w-12 h-12 rounded-full object-cover service-accent-ring" />
                                            )}
                                            <div>
                                                <div className="font-bold text-black dark:text-white text-sm transition-colors">{t.author}</div>
                                                <div className="service-meta-label text-black/40 dark:text-white/40 mt-0.5">{t.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                S-26: NEXT SERVICE NAVIGATION
            ═══════════════════════════════════════════════════════ */}
            {nextService && (
                <section id="svc-next" className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-black dark:bg-dark-950 transition-colors">
                    {/* Background */}
                    {nextService.image_url && (
                        <div className="absolute inset-0">
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-20 scale-110"
                                style={{ backgroundImage: `url(${nextService.image_url})` }}
                            />
                            <div className="absolute inset-0 bg-black/60" />
                        </div>
                    )}

                    <div className="relative z-10 text-center px-6">
                        <ScrollReveal>
                            <span className="service-meta-label text-white/30 mb-6 block">Next Service</span>
                            <h2 className="text-5xl md:text-8xl font-bold font-display text-white tracking-tighter leading-[0.9] mb-8">
                                {nextService.title.split(' ').map((word: string, i: number) => (
                                    <span key={i} className={i % 2 !== 0 ? 'italic font-light opacity-50' : ''}>
                                        {word}{' '}
                                    </span>
                                ))}
                            </h2>
                            <MagneticHover strength={0.2}>
                                <Link
                                    to={`/services/${nextService.slug}`}
                                    className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-500"
                                    data-cursor="pointer"
                                >
                                    View Service
                                    <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </MagneticHover>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════════
                AESTHETIC CTA
            ═══════════════════════════════════════════════════════ */}
            <section className="py-40 relative overflow-hidden bg-white dark:bg-dark-950 transition-colors">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <ScrollReveal>
                        <h2 className="text-5xl md:text-8xl font-bold font-display text-black dark:text-white mb-16 tracking-tighter leading-none transition-colors">
                            Ready to <span className="text-stroke-light dark:text-stroke-white italic font-light">Evolve</span> your vision?
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                            <MagneticHover strength={0.2}>
                                <Link
                                    to="/contact"
                                    className="group relative px-12 py-6 bg-black text-white dark:bg-white dark:text-dark-950 rounded-full font-bold text-xl hover:scale-105 transition-all duration-500 flex items-center gap-4"
                                    data-cursor="pointer"
                                >
                                    Start a Dialogue
                                    <ArrowUpRight className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </MagneticHover>

                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-950 bg-gray-200 dark:bg-gray-800 transition-colors" />
                                    ))}
                                </div>
                                <span className="service-meta-label text-black/30 dark:text-white/30 transition-colors">Join 50+ Global Brands</span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none">
                    <div className="text-huge opacity-[0.02] font-display text-center text-black dark:text-white transition-colors">
                        LOVELLI.
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
