import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import MagneticHover from './MagneticHover';

interface Work {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  tags: string[];
  slug: string;
  video_url?: string;
  color_accent?: string;
}

/* ═══════════════════════════════════════
   W-21: Stats Bar — "Our Expertise in Numbers"
   Horizontal strip with animated counters
   ═══════════════════════════════════════ */
function StatsCountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
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

function ExpertiseStatsBar() {
    const stats = [
        { value: 48, suffix: '+', label: 'Projects' },
        { value: 12, suffix: '', label: 'Industries' },
        { value: 6, suffix: '', label: 'Countries' },
        { value: 100, suffix: '%', label: 'Retention' },
    ];

    return (
        <ScrollReveal>
            <div className="relative my-16 py-8 border-y border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-8 flex-wrap">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex items-center gap-3 text-center">
                                <span className="text-2xl md:text-3xl font-bold text-black dark:text-white font-display">
                                    <StatsCountUp end={stat.value} suffix={stat.suffix} />
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/30">
                                    {stat.label}
                                </span>
                                {i < stats.length - 1 && (
                                    <span className="text-black/10 dark:text-white/10 ml-6 hidden sm:block">·</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}

/* ═══════════════════════════════════════
   W-20: Video-on-scroll for featured items
   Plays video_url when item enters center viewport
   ═══════════════════════════════════════ */
function FeaturedWorkItem({ work, index }: { work: Work; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(ref, { margin: '-30% 0px -30% 0px' });
    const [videoReady, setVideoReady] = useState(false);

    // W-20: Auto-play video when centered in viewport
    useEffect(() => {
        if (!work.video_url || !videoRef.current) return;
        if (isInView) {
            videoRef.current.play().then(() => setVideoReady(true)).catch(() => {});
        } else {
            videoRef.current.pause();
            setVideoReady(false);
        }
    }, [isInView, work.video_url]);

    // W-20: Per-project accent color for glow
    const accentColor = work.color_accent || '#6366f1';

    return (
        <div ref={ref} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center relative transition-all duration-1000`}>

            {/* Massive Parallax Backdrop Number */}
            <ScrollReveal useParallax yOffset={150} delay={0} className={`absolute -top-20 ${index % 2 === 0 ? 'right-0' : 'left-0'} project-number opacity-[0.03] dark:opacity-[0.05] select-none z-0 hidden lg:block text-black dark:text-white transition-colors duration-500 text-[12rem] font-black leading-none`}>
                {String(index + 1).padStart(2, '0')}
            </ScrollReveal>

            {/* W-20: Per-project accent glow blob */}
            <div
                className="absolute inset-0 rounded-full blur-[150px] opacity-10 pointer-events-none -z-10 hidden md:block"
                style={{ background: accentColor }}
            />

            {/* Image/Video Card with Velocity Parallax */}
            <ScrollReveal useParallax scaleEffect delay={0.2} className="w-full md:w-7/12 aspect-[4/5] md:aspect-[16/10] relative z-10 rounded-3xl project-card-premium shadow-2xl shadow-black/10 dark:shadow-black/50 group block">
                <Link to={`/works/${work.slug}`} className="w-full h-full block relative overflow-hidden rounded-3xl" data-cursor="view" data-cursor-text="View">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary-500/30 z-10 transition-all duration-500 pointer-events-none" />
                    <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                        <span className="px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">View Work</span>
                    </div>

                    {/* Static image */}
                    <img
                        src={work.image_url}
                        alt={work.title}
                        className={`w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
                    />

                    {/* W-20: Video overlay — auto-plays on scroll center */}
                    {work.video_url && (
                        <video
                            ref={videoRef}
                            src={work.video_url}
                            muted
                            loop
                            playsInline
                            preload="none"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </Link>
            </ScrollReveal>

            {/* Text Reveal */}
            <ScrollReveal delay={0.4} className="w-full md:w-5/12 relative z-10">
                <div className="space-y-6">
                    {/* W-20: Line-draw category label */}
                    <div className="flex items-center gap-4 text-primary-500 dark:text-white font-bold text-xs uppercase tracking-[0.2em]">
                        <span>{work.category}</span>
                        <motion.span
                            initial={{ width: 0 }}
                            whileInView={{ width: '2rem' }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="h-[1px] bg-black/30 dark:bg-white/20 inline-block transition-colors duration-300"
                        />
                        <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white font-display leading-[1.1] transition-colors duration-300">
                        <Link to={`/works/${work.slug}`} className="hover:text-primary-500 transition-colors">{work.title}</Link>
                    </h3>
                    <p className="text-lg text-black/70 dark:text-gray-400 leading-relaxed font-light transition-colors duration-300">{work.description}</p>
                    <div className="flex flex-wrap gap-3 pt-4">
                        {work.tags?.map((tag, i) => (
                            <span key={i} className="px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-black/80 dark:text-white/70 border border-black/20 dark:border-white/20 rounded-full transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent cursor-default">{tag}</span>
                        ))}
                    </div>
                    <div className="pt-8">
                        <MagneticHover strength={0.3}>
                            <Link to={`/works/${work.slug}`} className="inline-flex items-center gap-3 text-black dark:text-white font-bold tracking-[0.2em] text-xs uppercase group transition-colors duration-300 p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" data-cursor="pointer">
                                <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary-500 after:transform after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left">View Discovery</span>
                                <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-primary-500 dark:text-white" />
                            </Link>
                        </MagneticHover>
                    </div>
                </div>
            </ScrollReveal>

            <div className="absolute inset-0 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10 md:hidden"></div>
        </div>
    );
}

/* ═══════════════════════════════════════
   W-22: Drag-to-Explore Carousel Mode
   Horizontal draggable carousel alternative
   ═══════════════════════════════════════ */
function DragCarousel({ works }: { works: Work[] }) {
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Calculate active dot from scroll
    const handleDragEnd = () => {
        if (!constraintsRef.current) return;
        const container = constraintsRef.current;
        const scrollLeft = container.scrollLeft;
        const slideWidth = container.offsetWidth * 0.8;
        const newIndex = Math.round(scrollLeft / slideWidth);
        setActiveIndex(Math.min(newIndex, works.length - 1));
    };

    return (
        <div className="relative">
            <div
                ref={constraintsRef}
                className="flex gap-8 overflow-x-auto scrollbar-hide horizontal-scroll-touch px-6 lg:px-8 pb-6"
                onScroll={handleDragEnd}
            >
                {works.map((work, i) => (
                    <Link
                        key={work.id}
                        to={`/works/${work.slug}`}
                        className="group flex-shrink-0 block snap-item"
                        style={{ width: 'min(80vw, 800px)', scrollSnapAlign: 'center' }}
                        data-cursor="view"
                        data-cursor-text="View"
                    >
                        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden premium-image-treatment mb-6">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img
                                src={work.image_url}
                                alt={work.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                loading={i < 2 ? 'eager' : 'lazy'}
                            />
                            <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <span className="px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                                    View Work
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-6 h-[1px] bg-primary-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-500">{work.category}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white font-display group-hover:text-primary-500 transition-colors leading-tight">
                            {work.title}
                        </h3>
                    </Link>
                ))}
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
                {works.map((_, i) => (
                    <div
                        key={i}
                        className={`scroll-pagination-dot ${i === activeIndex ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   Featured Works Homepage Section
   W-20: Cinematic scroll-driven showcase
   W-21: Expertise stats bar
   W-22: Drag carousel mode
   ═══════════════════════════════════════ */
export default function FeaturedWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    async function fetchWorks() {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setWorks(data || []);
      } catch (error) {
        console.error('Error fetching works:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWorks();
  }, []);

  if (loading && works.length === 0) return null;

  return (
    <section id="works" className="py-40 bg-white dark:bg-dark-950 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <ScrollReveal delay={0.1} className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-primary-500"></span>
              <span className="text-primary-500 dark:text-white font-bold tracking-[0.3em] text-xs uppercase">Portfolio</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold font-display mb-8 leading-none transition-colors duration-300">
              <span className="text-black dark:text-white">Selected </span>
              <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Works</span>
            </h2>
            <p className="text-xl text-black/70 dark:text-gray-400 leading-relaxed font-light max-w-lg transition-colors duration-300">
              A curated collection of digital transformations where strategy meets art.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="z-20 flex items-center gap-4">
            {/* W-22: Toggle between vertical and carousel modes */}
            <MagneticHover strength={0.15}>
              <button
                onClick={() => setShowCarousel(!showCarousel)}
                className="px-6 py-3 rounded-full border border-black/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-all duration-300"
                data-cursor="pointer"
              >
                {showCarousel ? 'Vertical' : 'Carousel'}
              </button>
            </MagneticHover>

            <MagneticHover strength={0.2}>
              <Link to="/works" className="group flex items-center gap-4 px-8 py-4 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white text-black dark:text-white dark:hover:text-dark-950 transition-all duration-500 font-bold uppercase tracking-widest text-xs" data-cursor="pointer">
                Explore Selection
                <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </MagneticHover>
          </ScrollReveal>
        </div>

        {/* W-21: Expertise Stats Bar */}
        <ExpertiseStatsBar />

        {/* W-22: Carousel Mode */}
        {showCarousel ? (
          <DragCarousel works={works} />
        ) : (
          /* W-20: Cinematic vertical scroll with video-on-scroll */
          <div className="space-y-32 md:space-y-64">
            {works.map((work, index) => (
              <FeaturedWorkItem key={work.id} work={work} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
