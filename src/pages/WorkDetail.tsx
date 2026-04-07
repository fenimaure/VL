import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowUpRight, ArrowRight, Globe, User, Calendar, Layers, Code2, Hash } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import SocialShare from '../components/SocialShare';
import ComponentRenderer from '../components/ComponentRenderer';
import ScrollReveal from '../components/ScrollReveal';
import MagneticHover from '../components/MagneticHover';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

/* ═══════════════════════════════════════
   CountUp — animate 0 → end on scroll
   ═══════════════════════════════════════ */
function CountUp({ end, suffix = '', prefix = '', duration = 2500 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        let t0: number | null = null;
        const step = (ts: number) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / duration, 1);
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [started, end, duration]);

    return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{prefix}{count}{suffix}</span>;
}

/* ═══════════════════════════════════════
   W-15: Technology Stack Display
   Animated pill grid with hover effects
   ═══════════════════════════════════════ */
function TechStackDisplay({ tags }: { tags: string[] }) {
    if (!tags || tags.length === 0) return null;

    // Technology icon mapping
    const getTagIcon = (tag: string) => {
        const lower = tag.toLowerCase();
        if (lower.includes('react') || lower.includes('next')) return '⚛️';
        if (lower.includes('typescript') || lower.includes('ts')) return '🔷';
        if (lower.includes('javascript') || lower.includes('js')) return '🟨';
        if (lower.includes('figma')) return '🎨';
        if (lower.includes('node')) return '🟢';
        if (lower.includes('python')) return '🐍';
        if (lower.includes('css') || lower.includes('tailwind')) return '🎭';
        if (lower.includes('firebase') || lower.includes('supabase')) return '🔥';
        if (lower.includes('aws') || lower.includes('cloud')) return '☁️';
        if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) return '✨';
        if (lower.includes('brand')) return '🏷️';
        if (lower.includes('seo')) return '📈';
        if (lower.includes('wordpress') || lower.includes('cms')) return '📝';
        if (lower.includes('ecommerce') || lower.includes('shop')) return '🛒';
        return null;
    };

    return (
        <section className="py-20 md:py-32 relative" id="toc-tech">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <ScrollReveal>
                    <div className="flex items-center gap-4 mb-12">
                        <span className="w-12 h-[1px] accent-bg" />
                        <h2 className="text-xs uppercase tracking-[0.5em] accent-text font-bold flex items-center gap-2">
                            <Code2 className="h-3.5 w-3.5" />
                            Technologies Used
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="flex flex-wrap gap-3 md:gap-4">
                    {tags.map((tag, i) => {
                        const icon = getTagIcon(tag);
                        return (
                            <ScrollReveal key={i} delay={i * 0.05}>
                                <MagneticHover strength={0.2}>
                                    <div className="relative px-5 py-3 md:px-6 md:py-3.5 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] group hover:accent-border hover:bg-[var(--project-accent,#6366f1)]/5 transition-all duration-500 cursor-default">
                                        <span className="flex items-center gap-2.5">
                                            {icon && <span className="text-sm">{icon}</span>}
                                            {!icon && <Hash className="h-3 w-3 text-[var(--project-accent,#6366f1)]/40 group-hover:accent-text transition-colors" />}
                                            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
                                                {tag}
                                            </span>
                                        </span>
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-full bg-[var(--project-accent,#6366f1)]/0 group-hover:bg-[var(--project-accent,#6366f1)]/5 blur-xl transition-all duration-700 pointer-events-none" />
                                    </div>
                                </MagneticHover>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   W-17: Related Works Carousel
   Swipeable horizontal cards
   ═══════════════════════════════════════ */
function RelatedWorks({ currentWork }: { currentWork: any }) {
    const [relatedWorks, setRelatedWorks] = useState<any[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchRelated() {
            try {
                const { data } = await supabase
                    .from('works')
                    .select('id, title, slug, image_url, category, description')
                    .eq('category', currentWork.category)
                    .neq('id', currentWork.id)
                    .limit(4);
                setRelatedWorks(data || []);
            } catch (err) {
                console.error('Error fetching related works:', err);
            }
        }
        if (currentWork?.category && currentWork?.id) {
            fetchRelated();
        }
    }, [currentWork?.category, currentWork?.id]);

    if (relatedWorks.length === 0) return null;

    return (
        <section className="py-20 md:py-32 relative overflow-hidden" id="toc-related">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
                <ScrollReveal>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] accent-bg" />
                            <h2 className="text-xs uppercase tracking-[0.5em] accent-text font-bold">Related Works</h2>
                        </div>
                        <MagneticHover strength={0.15}>
                            <Link
                                to="/works"
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/30 hover:accent-text transition-colors flex items-center gap-2"
                                data-cursor="pointer"
                            >
                                View All <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </MagneticHover>
                    </div>
                </ScrollReveal>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-6 px-6 lg:px-8 overflow-x-auto scrollbar-hide pb-4 horizontal-scroll-touch"
            >
                {relatedWorks.map((work, i) => (
                    <ScrollReveal key={work.id} delay={i * 0.1}>
                        <Link
                            to={`/works/${work.slug}`}
                            className="group flex-shrink-0 block"
                            style={{ width: 'min(350px, 75vw)', scrollSnapAlign: 'start' }}
                            data-cursor="view"
                            data-cursor-text="View"
                        >
                            <div className="premium-image-treatment rounded-2xl overflow-hidden mb-5 works-image-overlay">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src={work.image_url}
                                        alt={work.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-4 h-[1px] accent-bg" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] accent-text">{work.category}</span>
                            </div>
                            <h3 className="text-lg font-bold text-black dark:text-white font-display group-hover:accent-text transition-colors duration-300 leading-tight mb-2">
                                {work.title}
                            </h3>
                            <p className="text-xs text-black/40 dark:text-gray-600 line-clamp-2 font-light">{work.description}</p>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   W-18: Floating Table of Contents Sidebar
   Minimalist vertical nav for case studies (desktop only)
   ═══════════════════════════════════════ */
const TOC_SECTIONS = [
    { id: 'toc-challenge', label: 'Challenge' },
    { id: 'toc-tech', label: 'Technology' },
    { id: 'toc-gallery', label: 'Gallery' },
    { id: 'toc-results', label: 'Results' },
    { id: 'toc-testimonial', label: 'Testimonial' },
    { id: 'toc-related', label: 'Related' },
    { id: 'toc-next', label: 'Next' },
];

function FloatingTOC() {
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
            { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }
        );

        // Observe all TOC target sections
        TOC_SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // Show TOC after scrolling past the hero
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
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    // Only render existing sections
    const availableSections = TOC_SECTIONS.filter(({ id }) => document.getElementById(id));

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
                    aria-label="Table of contents"
                >
                    {/* Vertical line */}
                    <div className="absolute left-[3px] top-0 bottom-0 w-[2px] bg-black/5 dark:bg-white/5 rounded-full" />

                    {availableSections.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => scrollToSection(id)}
                            className="toc-item flex items-center gap-3 relative group"
                            aria-label={`Jump to ${label}`}
                        >
                            <div className={`toc-dot ${activeSection === id ? 'active' : ''}`} />
                            <span className={`toc-label text-[10px] font-bold uppercase tracking-widest ${activeSection === id ? 'accent-text opacity-100 translate-x-0' : 'text-black/40 dark:text-white/40'}`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

/* ═══════════════════════════════════════
   Work Detail / Case Study Page
   W-10: Parallax Hero
   W-11: Image Gallery
   W-12: Results Counters
   W-13: Client Testimonial
   W-14: Process Timeline
   W-15: Technology Stack
   W-16: Next Case Study Nav
   W-17: Related Works
   W-18: Floating TOC Sidebar
   W-19: Before/After Slider
   W-25: Shared Element layoutId
   W-26: Magnetic Hover everywhere
   W-27: Per-Project Color Theming
   W-29: Case Study Typography
   W-30: Dark Mode Polish
   W-32: Mobile Optimizations
   W-34: Image Loading Strategy
   W-35: JSON-LD Structured Data
   ═══════════════════════════════════════ */
export default function WorkDetail() {
    const { slug } = useParams();
    const [work, setWork] = useState<any>(null);
    const [nextWork, setNextWork] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);

    // W-10: Parallax transforms for hero
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    useEffect(() => {
        async function fetchWork() {
            if (!slug) return;
            try {
                const { data, error } = await supabase.from('works').select('*').eq('slug', slug).single();
                if (error) throw error;
                setWork(data);

                // W-27: Set per-project accent color
                if (data?.color_accent) {
                    document.documentElement.style.setProperty('--project-accent', data.color_accent);
                }

                // Fetch next work for W-16 navigation
                if (data) {
                    const { data: nextData } = await supabase
                        .from('works')
                        .select('title, slug, image_url, category')
                        .lt('created_at', data.created_at)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (nextData) {
                        setNextWork(nextData);
                    } else {
                        // Wrap to first
                        const { data: firstData } = await supabase
                            .from('works')
                            .select('title, slug, image_url, category')
                            .neq('slug', slug)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .single();
                        setNextWork(firstData);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchWork();
        window.scrollTo(0, 0);

        // W-27: Cleanup accent color on unmount
        return () => {
            document.documentElement.style.removeProperty('--project-accent');
        };
    }, [slug]);

    // Intersection Observer for stagger reveals
    useEffect(() => {
        if (loading || !work) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.stagger-item').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [loading, work]);

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center transition-colors duration-500">
        </div>
    );

    if (!work) return (
        <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center text-black dark:text-white transition-colors duration-500">
            <div className="text-center px-6">
                <h1 className="text-4xl font-bold mb-4 font-display">Work Not Found</h1>
                <Link to="/works" className="accent-text hover:tracking-widest transition-all duration-300 uppercase text-xs font-bold">Return to Portfolio</Link>
            </div>
        </div>
    );

    // Parse results (may be JSON string or array)
    let results: any[] | null = null;
    try {
        results = work.results
            ? (typeof work.results === 'string' ? JSON.parse(work.results) : work.results)
            : null;
        if (results && !Array.isArray(results)) results = null;
    } catch { results = null; }

    // W-19: Check if content has before-after tag
    const hasBeforeAfter = work.content?.includes('[before-after]') && work.gallery_images?.length >= 2;

    // W-35: JSON-LD structured data for individual case study
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": work.title,
        "description": work.description,
        "url": `${window.location.origin}/works/${work.slug}`,
        "image": work.image_url,
        "creator": {
            "@type": "Organization",
            "name": "Lovelli",
            "url": window.location.origin
        },
        "dateCreated": work.created_at,
        ...(work.client && { "about": { "@type": "Organization", "name": work.client } }),
        ...(work.tags && { "keywords": work.tags.join(', ') }),
        ...(work.testimonial_quote && {
            "review": {
                "@type": "Review",
                "reviewBody": work.testimonial_quote,
                "author": { "@type": "Person", "name": work.testimonial_author || 'Client' }
            }
        })
    };

    return (
        <div className="case-study min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-300 selection:bg-[var(--project-accent,#6366f1)]/30 overflow-x-hidden transition-colors duration-500 works-gradient-mesh">
            <SEO title={work.title} description={work.description} image={work.image_url} url={`/works/${work.slug}`} type="article" />

            {/* W-35: JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <Navbar />

            {/* W-18: Floating Table of Contents Sidebar (desktop only) */}
            <FloatingTOC />

            {/* W-27: Accent gradient overlay */}
            <div className="fixed inset-0 pointer-events-none accent-gradient-overlay opacity-30 z-0" />

            {/* ═══ W-10: PARALLAX HERO ═══ */}
            {/* W-32: Mobile-responsive title sizing */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-end pt-40 pb-20 overflow-hidden">
                {/* Background with parallax depth */}
                <motion.div className="absolute inset-0 z-0" style={{ y: heroImageY }}>
                    <div
                        className="absolute inset-0 -top-[20%] -bottom-[20%] bg-cover bg-center"
                        style={{ backgroundImage: `url(${work.hero_image_url || work.image_url})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-white/20 dark:from-dark-950 dark:via-dark-950/50 dark:to-dark-950/20 transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent dark:from-dark-950/40 dark:to-transparent transition-colors duration-500" />
                </motion.div>

                {/* Text with slower parallax */}
                <motion.div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full mb-10" style={{ y: heroTextY, opacity: heroOpacity }}>
                    <MagneticHover strength={0.1}>
                        <Link to="/works" className="stagger-item inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white mb-12 transition-all group" data-cursor="pointer">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
                            Back to Portfolio
                        </Link>
                    </MagneticHover>

                    <div className="space-y-4">
                        <div className="stagger-item flex items-center gap-4 mb-8">
                            <span className="w-12 h-[1px] accent-bg" />
                            <span className="accent-text font-bold tracking-[0.4em] text-[10px] uppercase">
                                Case Study · {work.category}
                            </span>
                        </div>

                        {/* W-25: layoutId for shared element transition from card */}
                        {/* W-32: Responsive title — text-5xl on mobile, 10rem on desktop */}
                        <h1 className="stagger-item text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-bold font-display text-black dark:text-white leading-[0.8] tracking-tighter mb-16 transition-colors duration-500">
                            {work.title.split(' ').map((word: string, i: number) => (
                                <span key={i} className={i % 2 !== 0 ? 'text-stroke-light dark:text-stroke-white italic font-light block transition-colors duration-500' : 'block'}>
                                    {word}{i === work.title.split(' ').length - 1 ? '.' : ''}
                                </span>
                            ))}
                        </h1>
                    </div>
                </motion.div>

                <div className="absolute bottom-20 right-10 flex-col items-end gap-10 stagger-item hidden md:flex">
                    <div className="h-32 w-[1px] bg-gradient-to-b from-[var(--project-accent,#6366f1)] to-transparent" />
                    <span className="text-[10px] uppercase tracking-[0.5em] text-black/20 dark:text-white/20 font-bold vertical-text transition-colors duration-500">Explore</span>
                </div>
            </section>

            {/* ═══ STATS BAR ═══ */}
            {/* W-32: 2x2 grid on mobile */}
            <section className="relative z-20 -mt-10 border-y border-black/5 dark:border-white/5 bg-white/80 dark:bg-dark-950/80 backdrop-blur-2xl transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-8 md:py-10">
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 font-bold mb-3 flex items-center gap-2"><User className="h-3 w-3" /> Client</div>
                            <div className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">{work.client || 'Confidential'}</div>
                        </div>
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 font-bold mb-3 flex items-center gap-2"><Layers className="h-3 w-3" /> Role</div>
                            <div className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">{work.role || 'Digital Production'}</div>
                        </div>
                        <div className="stagger-item">
                            <div className="text-[10px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 font-bold mb-3 flex items-center gap-2"><Calendar className="h-3 w-3" /> Year</div>
                            <div className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">{work.duration || '2024'}</div>
                        </div>
                        <div className="stagger-item flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                {work.live_url && (
                                    <MagneticHover strength={0.15}>
                                        <a href={work.live_url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-[10px] font-bold accent-text uppercase tracking-[0.3em] hover:text-black dark:hover:text-white transition-colors" data-cursor="pointer">
                                            <Globe className="h-3 w-3" /> View Live <ArrowUpRight className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    </MagneticHover>
                                )}
                                <SocialShare title={work.title} description={work.description} hashtags={work.tags ? work.tags.slice(0, 3) : []} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PROJECT OVERVIEW ═══ */}
            <section className="py-24 md:py-40 relative" id="toc-challenge">
                <div className="absolute top-0 left-0 h-full w-20 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden select-none">
                    <span className="text-[10vw] font-black font-display vertical-text tracking-widest leading-none">OVERVIEW</span>
                </div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start mb-24">
                        {/* LEFT: THE PROBLEM */}
                        <ScrollReveal delay={0.1} className="lg:col-span-6 lg:pr-12 md:border-r border-black/10 dark:border-white/10">
                            <h2 className="text-xs uppercase tracking-[0.5em] text-black/40 dark:text-white/40 font-bold mb-8">The Problem</h2>
                            <p className="text-2xl sm:text-3xl md:text-4xl text-black dark:text-white font-light leading-snug font-display transition-colors duration-500">
                                {work.challenge || work.description}
                            </p>
                        </ScrollReveal>

                        {/* RIGHT: DETAILS */}
                        <ScrollReveal delay={0.3} className="lg:col-span-5 lg:col-start-8 flex flex-col gap-10 justify-center">
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.5em] text-black/40 dark:text-white/40 font-bold mb-3">Client</h3>
                                <p className="text-lg md:text-xl text-black dark:text-white transition-colors duration-500 font-display whitespace-pre-line leading-relaxed">
                                    {work.client_description || work.client || 'Confidential'}
                                </p>
                            </div>
                            
                            {(work.brand_requirements || work.role) && (
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.5em] text-black/40 dark:text-white/40 font-bold mb-3">Brand Requirements</h3>
                                <p className="text-lg md:text-xl text-black dark:text-white transition-colors duration-500 font-display">
                                    {work.brand_requirements || 'Brand positioning, competitive analysis, and visual identity architecture.'}
                                </p>
                            </div>
                            )}

                            {(work.what_we_did || work.tags) && (
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.5em] text-black/40 dark:text-white/40 font-bold mb-3">What We Did</h3>
                                <p className="text-lg md:text-xl text-black/80 dark:text-gray-300 transition-colors duration-500 font-display">
                                    {work.what_we_did || (work.tags ? work.tags.join(' · ') : 'Strategy, Design, and Development')}
                                </p>
                            </div>
                            )}
                        </ScrollReveal>
                    </div>

                    {/* CENTER BELOW: MARKDOWN CONTENT */}
                    {work.content && (
                    <div className="max-w-4xl mx-auto w-full pt-16 mt-16 border-t border-black/10 dark:border-white/10">
                        <ScrollReveal delay={0.4}>
                            <ComponentRenderer
                                content={work.content}
                                className="font-light leading-[1.8] text-base sm:text-lg md:text-xl text-black/80 dark:text-gray-300 works-body-text transition-colors duration-500"
                            />
                        </ScrollReveal>
                    </div>
                    )}
                </div>
            </section>

            {/* ═══ W-15: TECHNOLOGY STACK ═══ */}
            <TechStackDisplay tags={work.tags || []} />

            {/* ═══ W-19: BEFORE/AFTER SLIDER ═══ */}
            {hasBeforeAfter && (
                <section className="py-20 relative">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <ScrollReveal className="mb-12">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-12 h-[1px] accent-bg" />
                                <h2 className="text-xs uppercase tracking-[0.5em] accent-text font-bold">Before & After</h2>
                            </div>
                        </ScrollReveal>
                        <BeforeAfterSlider
                            beforeImage={work.gallery_images[0]}
                            afterImage={work.gallery_images[1]}
                        />
                    </div>
                </section>
            )}

            {/* ═══ W-11: IMAGE GALLERY ═══ */}
            {/* W-28: Premium image treatment applied */}
            {/* W-34: Lazy loading on all gallery images */}
            {work.gallery_images && work.gallery_images.length > 0 && (
                <section className="py-20 relative" id="toc-gallery">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
                        <ScrollReveal>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-12 h-[1px] accent-bg" />
                                <h2 className="text-xs uppercase tracking-[0.5em] accent-text font-bold">The Solution</h2>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                        {work.gallery_images.map((img: string, i: number) => {
                            const mod = i % 3;
                            // Full-bleed image
                            if (mod === 0) {
                                return (
                                    <ScrollReveal key={i} useParallax yOffset={50} variant="maskReveal">
                                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                                            <div className="premium-image-treatment overflow-hidden rounded-2xl works-image-overlay">
                                                <img src={img} alt={`${work.title} - ${i + 1}`} className="w-full h-auto object-cover aspect-[16/9]" loading="lazy" />
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                );
                            }
                            // Pair (first of two)
                            if (mod === 1 && i + 1 < work.gallery_images.length) {
                                return (
                                    <div key={i} className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        <ScrollReveal delay={0.1} variant="slideReveal" slideFrom="left">
                                            <div className="premium-image-treatment overflow-hidden rounded-2xl works-image-overlay">
                                                <img src={img} alt={`${work.title} - ${i + 1}`} className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" />
                                            </div>
                                        </ScrollReveal>
                                        <ScrollReveal delay={0.25} variant="slideReveal" slideFrom="right">
                                            <div className="premium-image-treatment overflow-hidden rounded-2xl works-image-overlay">
                                                <img src={work.gallery_images[i + 1]} alt={`${work.title} - ${i + 2}`} className="w-full h-auto object-cover aspect-[4/3]" loading="lazy" />
                                            </div>
                                        </ScrollReveal>
                                    </div>
                                );
                            }
                            // Skip (already rendered as second of pair)
                            if (mod === 2) return null;
                            // Orphan single image at end
                            return (
                                <ScrollReveal key={i} useParallax yOffset={40}>
                                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                                        <div className="premium-image-treatment overflow-hidden rounded-2xl works-image-overlay">
                                            <img src={img} alt={`${work.title} - ${i + 1}`} className="w-full h-auto object-cover aspect-[16/9]" loading="lazy" />
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ═══ W-12: RESULTS / IMPACT ═══ */}
            {results && results.length > 0 && (
                <section className="py-24 md:py-40 relative" id="toc-results">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <ScrollReveal className="text-center mb-20">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span className="w-12 h-[1px] accent-bg" />
                                <h2 className="text-xs uppercase tracking-[0.5em] accent-text font-bold">The Results</h2>
                                <span className="w-12 h-[1px] accent-bg" />
                            </div>
                            <p className="text-2xl md:text-3xl text-black/60 dark:text-gray-400 font-light font-display mt-6 max-w-2xl mx-auto">
                                Measurable impact that speaks for itself.
                            </p>
                        </ScrollReveal>

                        {/* W-32: 2-col on mobile */}
                        <div className={`grid grid-cols-2 ${results.length >= 4 ? 'md:grid-cols-4' : results.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-8`}>
                            {results.map((r: any, i: number) => {
                                const numMatch = r.value?.toString().match(/^([^\d]*)(\d+)(.*)$/);
                                const num = numMatch ? parseInt(numMatch[2]) : null;
                                const pfx = numMatch ? numMatch[1] : '';
                                const sfx = numMatch ? numMatch[3] : '';

                                return (
                                    <ScrollReveal key={i} delay={i * 0.15} variant="scaleReveal">
                                        <div className="relative p-6 md:p-10 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-center group hover:accent-border hover:shadow-xl hover:shadow-[var(--project-accent,#6366f1)]/5 transition-all duration-700 accent-glow-hover">
                                            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white font-display mb-3">
                                                {num !== null ? <CountUp end={num} prefix={pfx} suffix={sfx} /> : r.value}
                                            </div>
                                            <div className="text-xs sm:text-sm text-black/60 dark:text-gray-400 font-medium mb-1">{r.metric}</div>
                                            {r.change && (
                                                <div className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold mt-2">{r.change}</div>
                                            )}
                                        </div>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ W-13: CLIENT TESTIMONIAL ═══ */}
            {work.testimonial_quote && (
                <section className="py-20 md:py-32 relative" id="toc-testimonial">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <ScrollReveal variant="scaleReveal">
                            <div className="relative p-8 md:p-20 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 accent-glow">
                                <div className="absolute top-4 left-6 md:top-10 md:left-12 text-[6rem] md:text-[12rem] leading-none font-serif accent-text opacity-10 select-none pointer-events-none">
                                    &ldquo;
                                </div>
                                <div className="relative z-10">
                                    <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black dark:text-white font-light leading-snug font-display italic mb-10 transition-colors duration-500">
                                        &ldquo;{work.testimonial_quote}&rdquo;
                                    </blockquote>
                                    {work.testimonial_author && (
                                        <div className="flex items-center gap-4">
                                            <span className="w-12 h-[1px] accent-bg" />
                                            <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider">
                                                {work.testimonial_author}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* ═══ W-17: RELATED WORKS ═══ */}
            <RelatedWorks currentWork={work} />

            {/* ═══ W-16: NEXT CASE STUDY ═══ */}
            {nextWork && (
                <section className="relative overflow-hidden group" data-cursor="view" data-cursor-text="Next" id="toc-next">
                    <Link to={`/works/${nextWork.slug}`} className="block">
                        <div className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <img src={nextWork.image_url} alt={nextWork.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-700" />
                            </div>
                            <div className="relative z-10 text-center px-6">
                                <ScrollReveal>
                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        <span className="w-12 h-[1px] bg-white/30" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">Next Case Study</span>
                                        <span className="w-12 h-[1px] bg-white/30" />
                                    </div>
                                    <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white leading-[0.9] tracking-tighter mb-8">
                                        {nextWork.title}
                                    </h2>
                                    <MagneticHover strength={0.2}>
                                        <div className="inline-flex items-center gap-3 text-white/60 group-hover:text-white text-xs font-bold uppercase tracking-[0.3em] transition-colors duration-500">
                                            View Project
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-500" />
                                        </div>
                                    </MagneticHover>
                                </ScrollReveal>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            <Footer />
        </div>
    );
}
