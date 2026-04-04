import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import MagneticHover from './MagneticHover';

interface AboutData {
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  items: any[];
  media_type?: string;
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER — Counts up with easeOutCubic curve
   ═══════════════════════════════════════════════════════════════ */
function CountUp({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    if (!isInView) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 2200, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MANIFESTO WORD — Individual word with scroll-driven opacity
   ═══════════════════════════════════════════════════════════════ */
function ManifestoWord({
  word,
  index,
  total,
  scrollYProgress,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  const start = index / total;
  const end = Math.min(start + 1.8 / total, 1);
  const opacity = useTransform(scrollYProgress, [start, end], [0.08, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block will-change-[opacity] transition-none"
    >
      {word}
    </motion.span>
  );
}


/* ═══════════════════════════════════════════════════════════════
   HOME ABOUT — Premium "Who We Are" Section
   Scroll-scrubbed manifesto + Split layout + Orbital stats
   ═══════════════════════════════════════════════════════════════ */
export default function HomeAbout() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [storyData, setStoryData] = useState<AboutData | null>(null);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .in('section_key', ['story', 'manifesto', 'stats']);

        if (error) throw error;

        data?.forEach((item: any) => {
          if (item.section_key === 'story') setStoryData(item);
          if (item.section_key === 'manifesto') setAboutData(item);
          if (item.section_key === 'stats') setStatsData(item.items || []);
        });
      } catch (error) {
        console.error('Error fetching home about data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (loading) {
      return <div className="py-20 flex items-center justify-center bg-black text-white">Loading...</div>;
  }


  // ═══ FALLBACK DATA ═══
  const manifesto = aboutData?.content ||
    "We don't build websites. We engineer digital gravity — crafting every pixel, every interaction, every moment with the precision of people who believe design can change how the world feels about a brand.";

  const storyImage = storyData?.image_url || aboutData?.image_url || '';

  const stats = statsData.length > 0 ? statsData : [
    { value: '150', suffix: '+', label: 'Projects Delivered' },
    { value: '50', suffix: '+', label: 'Brands Transformed' },
    { value: '10', suffix: '+', label: 'Years of Craft' },
    { value: '98', suffix: '%', label: 'Client Retention' },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════
         PART 1: SCROLL-SCRUBBED MANIFESTO
         Giant text that reveals word-by-word
         ═══════════════════════════════════════ */}
      <ManifestoBlock text={manifesto} />

      {/* ═══════════════════════════════════════
         PART 2: EDITORIAL SPLIT — Image + Story
         ═══════════════════════════════════════ */}
      <SplitStory imageUrl={storyImage} storyData={storyData} />

      {/* ═══════════════════════════════════════
         PART 3: ORBITAL STATS BAR
         ═══════════════════════════════════════ */}
      <StatsRibbon stats={stats} />
    </>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MANIFESTO BLOCK — Scroll-scrubbed word revelation
   150vh sticky container where each word fills from dim → bright
   ═══════════════════════════════════════════════════════════════ */
function ManifestoBlock({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "end 0.3"]
  });

  const words = text.split(/\s+/).filter(Boolean);

  // Subtle background parallax
  const bgOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0.06, 0.06, 0]);

  return (
    <section
      ref={containerRef}
      className="relative bg-white dark:bg-black transition-colors duration-500"
      style={{ height: '140vh' }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-primary-500/30 blur-[200px]" />
      </motion.div>

      {/* Sticky inner */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">

          {/* Elegant section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <span className="w-12 h-[1px] bg-primary-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">
              Who We Are
            </span>
          </motion.div>

          {/* The manifesto text — each word independently animated */}
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold font-display text-black dark:text-white leading-[1.2] tracking-tight flex flex-wrap gap-x-[0.3em] gap-y-1">
            {words.map((word, i) => (
              <ManifestoWord
                key={i}
                word={word}
                index={i}
                total={words.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SPLIT STORY — Dramatic visual left, editorial text right
   Always visually stunning regardless of image availability
   ═══════════════════════════════════════════════════════════════ */
function SplitStory({ imageUrl, storyData }: { imageUrl: string; storyData: AboutData | null }) {
  const blockRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });

  // Image parallax
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imageYSpring = useSpring(imageY, { stiffness: 80, damping: 30 });

  // Text reveal line
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ['0%', '100%']);

  // Decorative rotation for the orbital ring
  const orbitalRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  const title = storyData?.title || 'Our Story';
  const description = storyData?.subtitle || 'A Manila-based digital boutique crafting award-winning experiences for global brands since 2014.';
  const content = storyData?.content?.replace(/<[^>]*>/g, '') ||
    "It started with a single laptop and an unshakeable belief that Filipino design could compete on the world stage. A decade later, we've delivered 150+ transformative projects across 6 continents — but we've never lost that hunger. Every pixel is personal. Every interaction is intentional. Every client becomes a partner.";

  return (
    <section
      ref={blockRef}
      className="relative py-32 md:py-48 bg-white dark:bg-black overflow-hidden transition-colors duration-500"
    >
      {/* Ambient gradient */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-primary-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── VISUAL SIDE ── */}
          <ScrollReveal variant="maskReveal" delay={0.1}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group">
              {imageUrl ? (
                <>
                  <motion.div
                    style={{ y: imageYSpring }}
                    className="absolute inset-0 will-change-transform"
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-[120%] object-cover transition-transform duration-[3s] group-hover:scale-105"
                      loading="lazy"
                    />
                  </motion.div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
                  {/* Border treatment */}
                  <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-3xl z-20 pointer-events-none group-hover:border-primary-500/20 transition-colors duration-700" />
                  {/* Floating badge */}
                  <div className="absolute bottom-6 left-6 z-30">
                    <div className="px-5 py-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/10 shadow-2xl">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white">
                        Est. 2014
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* ═══ DRAMATIC TYPOGRAPHIC PANEL ═══ */
                <div className="absolute inset-0 bg-black dark:bg-white rounded-3xl flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden">
                  {/* Subtle grid */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.08]"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
                      backgroundSize: '48px 48px',
                    }}
                  />

                  {/* Orbital ring decoration */}
                  <motion.div
                    style={{ rotate: orbitalRotate }}
                    className="absolute w-[70%] aspect-square border border-white/[0.07] dark:border-black/[0.07] rounded-full pointer-events-none"
                  />
                  <motion.div
                    style={{ rotate: orbitalRotate }}
                    className="absolute w-[55%] aspect-square border border-dashed border-primary-500/[0.12] rounded-full pointer-events-none"
                  />

                  {/* Center content */}
                  <div className="relative z-10 flex flex-col items-center gap-2 select-none px-8">
                    {/* Year */}
                    <span className="text-[8rem] md:text-[10rem] lg:text-[12rem] font-black font-display text-white/[0.08] dark:text-black/[0.08] leading-none tracking-tighter absolute -top-4">
                      '14
                    </span>

                    {/* Main type */}
                    <div className="relative flex flex-col items-center">
                      <span className="text-5xl md:text-7xl font-black font-display text-white dark:text-black leading-none tracking-tighter">
                        Lovelli
                      </span>
                      <span className="text-5xl md:text-7xl font-serif italic font-light text-stroke-white dark:text-stroke-black leading-none tracking-tight mt-1">
                        Studio
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mt-8 mb-4">
                      <span className="w-12 h-[1px] bg-primary-500/40" />
                      <span className="w-2 h-2 rounded-full bg-primary-500/60" />
                      <span className="w-12 h-[1px] bg-primary-500/40" />
                    </div>

                    {/* Tagline */}
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 dark:text-black/40 text-center">
                      Digital Boutique
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/25 dark:text-black/25 text-center mt-1">
                      Manila · Philippines
                    </span>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-white/10 dark:border-black/10 rounded-tl-xl" />
                  <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-white/10 dark:border-black/10 rounded-br-xl" />

                  {/* Floating stat badges */}
                  <div className="absolute top-8 right-8 px-4 py-2 bg-white/[0.05] dark:bg-black/[0.05] backdrop-blur-sm rounded-full border border-white/[0.08] dark:border-black/[0.08]">
                    <span className="text-[9px] font-bold text-white/50 dark:text-black/50 uppercase tracking-widest">Since 2014</span>
                  </div>
                  <div className="absolute bottom-8 left-8 px-4 py-2 bg-white/[0.05] dark:bg-black/[0.05] backdrop-blur-sm rounded-full border border-white/[0.08] dark:border-black/[0.08]">
                    <span className="text-[9px] font-bold text-white/50 dark:text-black/50 uppercase tracking-widest">150+ Projects</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* ── TEXT SIDE ── */}
          <ScrollReveal variant="slideReveal" slideFrom="right" delay={0.2}>
            <div className="lg:pl-4">
              {/* Chapter label */}
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="w-8 h-[1px] bg-primary-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">
                  About Us
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-black dark:text-white tracking-tight mb-4 leading-[0.95]">
                {title.split(' ').map((word, i) => (
                  <span key={i}>
                    {i % 2 !== 0 ? (
                      <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">{word} </span>
                    ) : (
                      <>{word} </>
                    )}
                  </span>
                ))}
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-primary-500 font-medium mb-8 tracking-wide leading-relaxed">
                {description}
              </p>

              {/* Animated reveal line */}
              <motion.div
                style={{ width: lineWidth }}
                className="h-[1px] bg-gradient-to-r from-primary-500/50 to-transparent mb-8"
              />

              {/* Body text */}
              <p className="text-base md:text-lg font-light leading-[1.9] text-black/60 dark:text-white/60 mb-10 transition-colors duration-500">
                {content}
              </p>

              {/* CTA */}
              <MagneticHover strength={0.25}>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white transition-all duration-500 font-bold uppercase tracking-widest text-xs"
                  data-cursor="pointer"
                >
                  <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary-500 after:transform after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left">
                    Discover More
                  </span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform text-primary-500 group-hover:text-current" />
                </Link>
              </MagneticHover>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════════════════════
   STATS RIBBON — Horizontal glass strip with animated counters
   Full-width, cinematic number reveal
   ═══════════════════════════════════════════════════════════════ */
function StatsRibbon({ stats }: { stats: any[] }) {
  const ribbonRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ribbonRef, { once: true, margin: '-10%' });

  return (
    <section
      ref={ribbonRef}
      className="relative py-1 overflow-hidden bg-black dark:bg-white transition-colors duration-500"
    >
      {/* Subtle shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] dark:via-black/[0.03] to-transparent animate-[shimmer_4s_infinite] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 py-12 md:py-16">
          {stats.map((stat: any, i: number) => {
            const numericValue = parseInt(String(stat.value).replace(/\D/g, ''), 10) || 0;
            const suffix = stat.suffix || '';
            const prefix = stat.prefix || '';

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="text-center group"
              >
                {/* Number */}
                <div className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-white dark:text-black tracking-tighter mb-3 transition-colors duration-500">
                  <CountUp end={numericValue} suffix={suffix} prefix={prefix} />
                </div>

                {/* Label */}
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/40 dark:text-black/40 transition-colors duration-500">
                  {stat.label}
                </div>

                {/* Decorative underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="w-8 h-[1px] bg-primary-500/40 mx-auto mt-4 origin-left"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
