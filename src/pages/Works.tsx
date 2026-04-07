import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, Filter, Search, X, ChevronRight, LayoutGrid, List, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import MagneticHover from '../components/MagneticHover';

interface Work {
    id: string;
    title: string;
    category: string;
    description: string;
    challenge?: string;
    content?: string;
    client?: string;
    role?: string;
    duration?: string;
    live_url?: string;
    contact_email?: string;
    image_url: string;
    tags: string[];
    slug: string;
    is_featured?: boolean;
    video_url?: string;
    gallery_images?: string[];
    color_accent?: string;
    created_at?: string;
}

/* ═══════════════════════════════════════
   Animated Counter — counts from 0 → end
   ═══════════════════════════════════════ */
function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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

    return <div ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{count}{suffix}</div>;
}

/* ═══════════════════════════════════════
   W-5: Horizontal Scroll Showcase
   Scroll-jacked featured strip
   W-33: Touch-optimized with scroll-snap
   ═══════════════════════════════════════ */
function HorizontalShowcase({ works }: { works: Work[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });
    const x = useTransform(scrollYProgress, [0, 1], ['5%', `-${(works.length - 1) * 80}%`]);
    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    if (works.length === 0) return null;

    return (
        <section ref={containerRef} className="relative" style={{ height: `${works.length * 100}vh` }}>
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
                {/* Section label */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Featured Selection</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/30 hidden sm:block">
                            ← Scroll to Explore →
                        </span>
                    </motion.div>
                </div>

                {/* Horizontal sliding track */}
                <motion.div
                    className="flex gap-8 px-6 lg:px-8"
                    style={{ x }}
                >
                    {works.map((work, i) => (
                        <Link
                            key={work.id}
                            to={`/works/${work.slug}`}
                            className="group block flex-shrink-0"
                            style={{ width: '75vw', maxWidth: '1000px' }}
                            data-cursor="view"
                            data-cursor-text="View"
                        >
                            <div className="relative h-[55vh] rounded-2xl overflow-hidden premium-image-treatment works-image-overlay">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                                <img
                                    src={work.image_url}
                                    alt={work.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                                    loading={i < 2 ? 'eager' : 'lazy'}
                                />
                                {/* Content overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="w-8 h-[1px] bg-white/50" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">{work.category}</span>
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-bold text-white font-display leading-tight mb-4 tracking-tight">
                                        {work.title}
                                    </h3>
                                    <p className="text-white/60 text-sm max-w-lg line-clamp-2 font-light">{work.description}</p>
                                </div>
                                {/* Index */}
                                <div className="absolute top-6 right-8 z-20 text-[10rem] font-black text-white/[0.04] leading-none font-display select-none">
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>

                {/* Progress bar */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mt-8">
                    <div className="relative h-[2px] bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-primary-500 rounded-full"
                            style={{ width: progressWidth }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   W-9: Featured Work of the Month Spotlight
   Highlighted banner at the very top
   ═══════════════════════════════════════ */
function FeaturedSpotlight({ work }: { work: Work }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start']
    });
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity: bgOpacity }}
            className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-16"
        >
            {/* Background */}
            <motion.div className="absolute inset-0 z-0" style={{ scale: bgScale }}>
                <img
                    src={work.image_url}
                    alt={work.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">Featured Work of the Month</span>
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold font-display text-white leading-[0.9] tracking-tighter mb-6">
                        {work.title}
                    </h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 font-light">{work.description}</p>
                    <MagneticHover strength={0.2}>
                        <Link
                            to={`/works/${work.slug}`}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all duration-500"
                            data-cursor="view"
                            data-cursor-text="View"
                        >
                            Explore Case Study
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </MagneticHover>
                </motion.div>
            </div>
        </motion.section>
    );
}

/* ═══════════════════════════════════════
   W-8: List View Row Component
   Dribbble/Behance-style table rows
   ═══════════════════════════════════════ */
function WorkListRow({ work, index }: { work: Work; index: number }) {
    return (
        <Link to={`/works/${work.slug}`} className="block group" data-cursor="view" data-cursor-text="View">
            <div className="list-view-row relative px-6 py-6 md:py-8">
                {/* Hover image reveal */}
                <div className="list-row-image">
                    <img src={work.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>

                {/* Row content */}
                <div className="relative z-10 grid grid-cols-12 items-center gap-4">
                    {/* Number */}
                    <div className="col-span-1 text-2xl md:text-3xl font-black text-black/10 dark:text-white/10 font-display">
                        {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Title */}
                    <div className="col-span-5 md:col-span-5">
                        <h3 className="text-lg md:text-2xl font-bold text-black dark:text-white font-display group-hover:text-primary-500 transition-colors duration-500 leading-tight">
                            {work.title}
                        </h3>
                    </div>

                    {/* Category */}
                    <div className="col-span-3 md:col-span-3 hidden sm:block">
                        <span className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">{work.category}</span>
                    </div>

                    {/* Year */}
                    <div className="col-span-2 hidden md:block">
                        <span className="text-xs font-bold text-black/30 dark:text-white/30">{work.duration || '2024'}</span>
                    </div>

                    {/* Arrow */}
                    <div className="col-span-1 flex justify-end">
                        <div className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:border-black dark:group-hover:bg-white dark:group-hover:border-white transition-all duration-500">
                            <ArrowUpRight className="h-3 w-3 text-black/30 dark:text-white/30 group-hover:text-white dark:group-hover:text-black transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}


/* ═══════════════════════════════════════
   Works Archive Page
   W-8: Grid/List toggle
   W-9: Featured spotlight
   W-26: Magnetic hover on everything
   W-31: Mobile-first cards
   W-35: Enhanced SEO
   ═══════════════════════════════════════ */
export default function Works() {
    const [works, setWorks] = useState<Work[]>([]);
    const [filteredWorks, setFilteredWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<string[]>([]);

    // W-7: Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // W-6: Load More state
    const INITIAL_COUNT = 9;
    const LOAD_INCREMENT = 6;
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    // W-8: View mode state
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        async function fetchWorks() {
            try {
                const { data, error } = await supabase
                    .from('works')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setWorks(data || []);
                setFilteredWorks(data || []);
                const unique = ['All', ...new Set(data?.map(p => p.category) || [])];
                setCategories(unique);
            } catch (error) {
                console.error('Error fetching works:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchWorks();
    }, []);

    // W-7: Debounced search + category filter
    useEffect(() => {
        const timer = setTimeout(() => {
            let result = works;
            if (selectedCategory !== 'All') {
                result = result.filter(p => p.category === selectedCategory);
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                result = result.filter(w =>
                    w.title.toLowerCase().includes(q) ||
                    w.description?.toLowerCase().includes(q) ||
                    w.tags?.some(t => t.toLowerCase().includes(q)) ||
                    w.category?.toLowerCase().includes(q)
                );
            }
            setFilteredWorks(result);
            setVisibleCount(INITIAL_COUNT); // Reset on filter change
        }, 300);
        return () => clearTimeout(timer);
    }, [selectedCategory, works, searchQuery]);

    const getCatCount = (cat: string) => cat === 'All' ? works.length : works.filter(w => w.category === cat).length;

    // W-5: Featured works for horizontal showcase
    const featuredWorks = useMemo(() => works.filter(w => w.is_featured), [works]);

    // W-9: Most recent featured work for spotlight
    const spotlightWork = useMemo(() => featuredWorks[0] || null, [featuredWorks]);

    // W-6: Paginated visible works
    const visibleWorks = useMemo(() => filteredWorks.slice(0, visibleCount), [filteredWorks, visibleCount]);
    const hasMore = visibleCount < filteredWorks.length;
    const remainingCount = filteredWorks.length - visibleCount;

    // Split into two columns for masonry stagger
    const leftCol = visibleWorks.filter((_, i) => i % 2 === 0);
    const rightCol = visibleWorks.filter((_, i) => i % 2 !== 0);

    const handleLoadMore = useCallback(() => {
        setVisibleCount(prev => prev + LOAD_INCREMENT);
    }, []);

    // W-35: JSON-LD structured data for Works archive
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Our Works | Lovelli",
        "description": "Explore our portfolio of transformative digital works and creative solutions.",
        "url": `${window.location.origin}/works`,
        "numberOfItems": works.length,
        "itemListElement": works.slice(0, 10).map((w, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
                "@type": "CreativeWork",
                "name": w.title,
                "description": w.description,
                "url": `${window.location.origin}/works/${w.slug}`,
                "image": w.image_url
            }
        }))
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-500 relative overflow-hidden works-gradient-mesh">
            <SEO title="Our Works" description="Explore our portfolio of transformative digital works and creative solutions." url="/works" />

            {/* W-35: JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Ambient gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/15 dark:bg-primary-500/8 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/15 dark:bg-primary-500/8 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            <Navbar />

            {/* ═══ W-1: IMMERSIVE HERO ═══ */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.04),transparent_60%)]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-40 pb-32">
                    <div className="text-center max-w-5xl mx-auto">
                        {/* Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-3 mb-12"
                        >
                            <span className="w-12 h-[1px] bg-primary-500 dark:bg-white" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500 dark:text-white">Portfolio · 2024—2026</span>
                            <span className="w-12 h-[1px] bg-primary-500 dark:bg-white" />
                        </motion.div>

                        {/* Title — word-level reveal */}
                        <div className="mb-16">
                            <h1 className="flex flex-col items-center leading-[0.85]">
                                <div className="overflow-hidden">
                                    <motion.span
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="block text-[clamp(4rem,12vw,10rem)] font-black tracking-tighter text-black dark:text-white font-display"
                                    >
                                        Selected
                                    </motion.span>
                                </div>
                                <div className="overflow-hidden">
                                    <motion.span
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                        className="block text-[clamp(4rem,12vw,10rem)] text-stroke-light dark:text-stroke-white italic font-light font-serif"
                                    >
                                        Works.
                                    </motion.span>
                                </div>
                            </h1>
                        </div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="text-xl sm:text-2xl text-black/60 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-20 font-light"
                        >
                            A curated collection of <span className="text-primary-500 dark:text-white font-semibold">transformative</span> digital experiences where strategy meets craft.
                        </motion.p>

                        {/* Animated counters */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                        >
                            <div className="text-center">
                                <div className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-2 font-display">
                                    <CountUp end={works.length || 48} suffix="+" />
                                </div>
                                <div className="text-[10px] text-black/40 dark:text-gray-500 uppercase tracking-[0.3em] font-bold">Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-2 font-display">
                                    <CountUp end={Math.max(categories.length - 1, 12)} />
                                </div>
                                <div className="text-[10px] text-black/40 dark:text-gray-500 uppercase tracking-[0.3em] font-bold">Industries</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-2 font-display">
                                    <CountUp end={100} suffix="%" />
                                </div>
                                <div className="text-[10px] text-black/40 dark:text-gray-500 uppercase tracking-[0.3em] font-bold">Satisfaction</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-black/30 dark:text-white/30 font-bold">Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-[1px] h-12 bg-gradient-to-b from-black/30 to-transparent dark:from-white/30"
                    />
                </motion.div>
            </section>

            {/* ═══ W-9: FEATURED SPOTLIGHT ═══ */}
            {!loading && spotlightWork && (
                <FeaturedSpotlight work={spotlightWork} />
            )}

            {/* ═══ W-5: HORIZONTAL SCROLL SHOWCASE ═══ */}
            {!loading && featuredWorks.length > 1 && (
                <HorizontalShowcase works={featuredWorks} />
            )}

            {/* ═══ FILTER BAR WITH COUNTS + W-7 SEARCH + W-8 VIEW TOGGLE ═══ */}
            <section className="py-6 sticky top-24 z-40 backdrop-blur-2xl bg-white/80 dark:bg-dark-950/80 border-y border-black/5 dark:border-white/5 shadow-sm transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Filter icon */}
                        <div className="flex items-center gap-3 text-black/40 dark:text-gray-500 flex-shrink-0" data-cursor="pointer">
                            <Filter className="h-4 w-4" />
                            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">Filter</span>
                        </div>

                        {/* Category pills — W-26: MagneticHover on all */}
                        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1">
                            {categories.map((cat) => (
                                <MagneticHover key={cat} strength={0.15}>
                                    <button
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`relative px-5 py-2.5 rounded-full font-bold transition-all duration-500 whitespace-nowrap text-xs uppercase tracking-wider ${
                                            selectedCategory === cat
                                                ? 'bg-black dark:bg-white text-white dark:text-dark-950 shadow-lg'
                                                : 'bg-transparent text-black/50 hover:text-black border border-black/10 dark:text-gray-500 dark:hover:text-white dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                                        }`}
                                        data-cursor="pointer"
                                    >
                                        <span className="flex items-center gap-2">
                                            {cat}
                                            <span className={`text-[9px] ${selectedCategory === cat ? 'text-white/60 dark:text-dark-950/60' : 'text-black/30 dark:text-white/30'}`}>
                                                {getCatCount(cat)}
                                            </span>
                                        </span>
                                    </button>
                                </MagneticHover>
                            ))}
                        </div>

                        {/* W-8: Grid / List toggle */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <MagneticHover strength={0.15}>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white' : 'text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white'}`}
                                    data-cursor="pointer"
                                    aria-label="Grid view"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                            </MagneticHover>
                            <MagneticHover strength={0.15}>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white' : 'text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white'}`}
                                    data-cursor="pointer"
                                    aria-label="List view"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </MagneticHover>
                        </div>

                        {/* W-7: Search input */}
                        <div className={`relative flex items-center transition-all duration-500 ${isSearchFocused ? 'w-64' : 'w-44'}`}>
                            <Search className="absolute left-3 h-3.5 w-3.5 text-black/30 dark:text-white/30 pointer-events-none z-10" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder="Search works..."
                                className="w-full pl-9 pr-8 py-2.5 bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-full text-xs font-medium text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:border-primary-500/50 focus:bg-black/[0.05] dark:focus:bg-white/[0.05] transition-all duration-300 outline-none"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                                    className="absolute right-3 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                >
                                    <X className="h-3 w-3 text-black/40 dark:text-white/40" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ W-2: MASONRY GRID / W-8: LIST VIEW ═══ */}
            <section className="py-24 md:py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-40">
                        </div>
                    ) : filteredWorks.length === 0 ? (
                        <div className="text-center py-40">
                            {searchQuery ? (
                                <>
                                    <p className="text-xl text-black/30 dark:text-gray-600 mb-3">No results for "{searchQuery}"</p>
                                    <p className="text-sm text-black/20 dark:text-gray-700 mb-6">Try a different search term or browse all works</p>
                                    <MagneticHover strength={0.2}>
                                        <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="text-primary-500 font-bold text-sm uppercase tracking-wider underline underline-offset-4">
                                            Clear search & view all
                                        </button>
                                    </MagneticHover>
                                </>
                            ) : (
                                <>
                                    <p className="text-xl text-black/30 dark:text-gray-600 mb-6">No works found in this category</p>
                                    <MagneticHover strength={0.2}>
                                        <button onClick={() => setSelectedCategory('All')} className="text-primary-500 font-bold text-sm uppercase tracking-wider underline underline-offset-4">
                                            View all works
                                        </button>
                                    </MagneticHover>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-16">
                                <div className="text-black/30 dark:text-gray-600 text-sm">
                                    Showing <span className="text-black dark:text-white font-bold">{visibleWorks.length}</span> of <span className="text-black dark:text-white font-bold">{filteredWorks.length}</span> {filteredWorks.length === 1 ? 'work' : 'works'}
                                </div>
                            </div>

                            {/* W-8: Conditional rendering — Grid or List view */}
                            <AnimatePresence mode="wait">
                                {viewMode === 'list' ? (
                                    /* ═══ LIST VIEW ═══ */
                                    <motion.div
                                        key="list-view"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="border-t border-black/6 dark:border-white/6"
                                    >
                                        {visibleWorks.map((work, i) => (
                                            <motion.div
                                                key={work.id}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <WorkListRow work={work} index={i} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    /* ═══ GRID VIEW (Masonry) ═══ */
                                    <motion.div
                                        key="grid-view"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        {/* Two-column masonry with stagger offset */}
                                        {/* W-31: Mobile single col, tablet 2-col, desktop masonry */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 works-grid-tablet">
                                            <div className="space-y-6 lg:space-y-8">
                                                <AnimatePresence mode="popLayout">
                                                    {leftCol.map((work, i) => (
                                                        <motion.div key={work.id} layout
                                                            initial={{ opacity: 0, y: 60 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                                        >
                                                            <WorkCard work={work} index={i * 2} isLarge={i === 0 || !!work.is_featured} />
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                            <div className="space-y-6 lg:space-y-8 lg:mt-24">
                                                <AnimatePresence mode="popLayout">
                                                    {rightCol.map((work, i) => (
                                                        <motion.div key={work.id} layout
                                                            initial={{ opacity: 0, y: 60 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            transition={{ duration: 0.6, delay: i * 0.1 + 0.15, ease: [0.16, 1, 0.3, 1] }}
                                                        >
                                                            <WorkCard work={work} index={i * 2 + 1} isLarge={!!work.is_featured} />
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ═══ W-6: LOAD MORE BUTTON ═══ */}
                            {/* W-26: MagneticHover applied */}
                            {hasMore && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="flex justify-center mt-20"
                                >
                                    <MagneticHover strength={0.25}>
                                        <button
                                            onClick={handleLoadMore}
                                            className="group relative px-10 py-5 rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white font-bold text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-700 hover:border-black/30 dark:hover:border-white/30 hover:shadow-xl"
                                            data-cursor="pointer"
                                        >
                                            {/* Fill effect on hover */}
                                            <span className="absolute inset-0 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                            <span className="relative z-10 flex items-center gap-3 group-hover:text-white dark:group-hover:text-dark-950 transition-colors duration-700">
                                                Load {Math.min(remainingCount, LOAD_INCREMENT)} more of {filteredWorks.length} works
                                                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                                            </span>
                                        </button>
                                    </MagneticHover>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

/* ═══════════════════════════════════════
   W-3: Premium Work Card
   3D tilt · Video-on-hover · Reveal CTA
   W-24: data-cursor attributes
   W-25: layoutId for shared element transitions
   W-28: Premium image treatment
   W-31: Mobile card aspect ratio (3:4)
   W-36: Video preloading strategy
   ═══════════════════════════════════════ */
function WorkCard({ work, index, isLarge = false }: { work: Work; index: number; isLarge?: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [videoReady, setVideoReady] = useState(false);

    // W-36: Preload video metadata via IntersectionObserver
    useEffect(() => {
        if (!work.video_url || !videoRef.current) return;
        const video = videoRef.current;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                video.preload = 'metadata';
                obs.disconnect();
            }
        }, { rootMargin: '200px' });
        obs.observe(video);
        return () => obs.disconnect();
    }, [work.video_url]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        // W-31: Disable 3D tilt on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = (y - rect.height / 2) / 25;
        const ry = (rect.width / 2 - x) / 25;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.01,1.01,1.01)`;
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (work.video_url && videoRef.current) {
            videoRef.current.play().then(() => setVideoReady(true)).catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        setIsHovered(false);
        setVideoReady(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    };

    return (
        <Link to={`/works/${work.slug}`} className="block group" data-cursor="view" data-cursor-text="View">
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative rounded-2xl overflow-hidden premium-image-treatment works-card-border works-image-overlay"
                style={{ transition: 'border-color 0.5s, transform 0.15s ease-out' }}
            >
                {/* Featured badge */}
                {work.is_featured && (
                    <div className="absolute top-4 right-4 z-30 px-3 py-1.5 text-[10px] font-bold text-white bg-primary-500 rounded-full uppercase tracking-wider">
                        Featured
                    </div>
                )}

                {/* Image / Video container */}
                {/* W-31: 3:4 aspect ratio on mobile, 4:3 / 4:5 on desktop */}
                <div className={`relative overflow-hidden works-card-mobile ${isLarge ? 'aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4]' : 'aspect-[3/4] md:aspect-[4/3]'}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

                    {/* W-25: layoutId for shared element transition */}
                    <motion.img
                        layoutId={`work-image-${work.slug}`}
                        src={work.image_url}
                        alt={work.title}
                        className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-[2s] ease-out ${isHovered && videoReady ? 'opacity-0' : 'opacity-100'}`}
                        loading="lazy"
                    />

                    {/* W-36: Video with preload="none", upgraded to metadata on viewport entry */}
                    {work.video_url && (
                        <video ref={videoRef} src={work.video_url} muted loop playsInline preload="none"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered && videoReady ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}

                    {/* Tags */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                        {work.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-3 py-1 text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-md rounded-full border border-white/10 uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Hover CTA */}
                    <div className="absolute bottom-5 right-5 z-20">
                        <div className="w-11 h-11 bg-white dark:bg-dark-950 rounded-full flex items-center justify-center transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
                            <ArrowUpRight className="h-4 w-4 text-black dark:text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="w-6 h-[1px] bg-primary-500 dark:bg-white" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-500 dark:text-white">{work.category}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-3 font-display group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-500 leading-tight">
                        {work.title}
                    </h3>
                    <p className="text-black/50 dark:text-gray-500 mb-5 leading-relaxed line-clamp-2 text-sm font-light">
                        {work.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/30 group-hover:text-primary-500 group-hover:gap-4 transition-all duration-500">
                        View Case Study
                        <ArrowUpRight className="h-3 w-3 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
