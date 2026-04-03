import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import MagneticHover from './MagneticHover';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  icon_url?: string;
  color_theme: string;
  slug: string;
  tags?: string[];
  stats?: { value: string; label: string }[];
}

// Rich gradient meshes per card (cycles) — used when no image
const CARD_GRADIENTS = [
  'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.35) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.2) 0%, transparent 50%)',
  'radial-gradient(ellipse at 80% 50%, rgba(244,63,94,0.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(251,146,60,0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 20%, rgba(239,68,68,0.15) 0%, transparent 50%)',
  'radial-gradient(ellipse at 30% 30%, rgba(34,211,238,0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.25) 0%, transparent 50%), radial-gradient(ellipse at 90% 20%, rgba(99,102,241,0.2) 0%, transparent 50%)',
  'radial-gradient(ellipse at 60% 60%, rgba(52,211,153,0.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 20%, rgba(16,185,129,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(34,197,94,0.15) 0%, transparent 50%)',
  'radial-gradient(ellipse at 40% 40%, rgba(251,146,60,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(245,158,11,0.25) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(234,88,12,0.15) 0%, transparent 50%)',
  'radial-gradient(ellipse at 50% 30%, rgba(236,72,153,0.3) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(168,85,247,0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(219,39,119,0.15) 0%, transparent 50%)',
];

// Accent color per card for the glow/border
const CARD_ACCENTS = [
  'rgba(139,92,246,0.5)',
  'rgba(244,63,94,0.5)',
  'rgba(59,130,246,0.5)',
  'rgba(52,211,153,0.5)',
  'rgba(251,146,60,0.5)',
  'rgba(236,72,153,0.5)',
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
  }, []);

  if (loading) {
    return (
      <section className="py-40 bg-white dark:bg-dark-950 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section id="services" className="bg-white dark:bg-dark-950 transition-colors duration-500">
      {/* Section Header — matching FeaturedWorks editorial layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <ScrollReveal delay={0.1} className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-primary-500"></span>
              <span className="text-primary-500 dark:text-white font-bold tracking-[0.3em] text-xs uppercase">
                Services
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold font-display mb-8 leading-none transition-colors duration-300">
              <span className="text-black dark:text-white">Expert </span>
              <span className="text-stroke-light dark:text-stroke-white italic font-light font-serif">Solutions</span>
            </h2>
            <p className="text-xl text-black/70 dark:text-gray-400 leading-relaxed font-light max-w-lg transition-colors duration-300">
              We architect digital ecosystems that blend strategy with breathtaking aesthetics.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="z-20">
            <MagneticHover strength={0.2}>
              <button
                onClick={() => navigate('/services')}
                className="group flex items-center gap-4 px-8 py-4 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white text-black dark:text-white dark:hover:text-dark-950 transition-all duration-500 font-bold uppercase tracking-widest text-xs"
                data-cursor="pointer"
              >
                Explore Services
                <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </MagneticHover>
          </ScrollReveal>
        </div>
      </div>

      {/* Mobile Carousel / Desktop Stacking Cards */}
      {isMobile ? (
        <div className="overflow-x-auto scrollbar-hide horizontal-scroll-touch pb-8 px-4">
          <div className="flex gap-5" style={{ width: `${services.length * 82}vw` }}>
            {services.map((service, index) => (
              <div
                key={service.id}
                className="flex-shrink-0"
                style={{ width: 'min(78vw, 360px)', scrollSnapAlign: 'start' }}
              >
                <PremiumServiceCard
                  service={service}
                  index={index}
                  onClick={() => navigate(`/services/${service.slug}`)}
                  isMobile={true}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="relative">
          {services.map((service, index) => (
            <PremiumServiceCard
              key={service.id}
              service={service}
              index={index}
              onClick={() => navigate(`/services/${service.slug}`)}
              isMobile={false}
            />
          ))}
        </div>
      )}

      {/* Floating "Explore All Services" CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 flex justify-center">
        <MagneticHover strength={0.2}>
          <button
            onClick={() => navigate('/services')}
            className="group inline-flex items-center gap-4 px-10 py-5 bg-black dark:bg-white text-white dark:text-dark-950 rounded-full font-bold text-lg hover:scale-105 transition-all duration-500"
            data-cursor="pointer"
          >
            Explore All Services
            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </MagneticHover>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   Premium Service Card
   Image-dominant · 3D Tilt · Cinematic overlay
   Matching Works card quality
   ═══════════════════════════════════════ */
function PremiumServiceCard({
  service,
  index,
  onClick,
  isMobile,
}: {
  service: Service;
  index: number;
  onClick: () => void;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start', 'end start'],
  });

  const scale = useTransform(scrollYProgress,
    [0, 0.45, 0.55, 1],
    [0.92, 1.02, 1.02, 0.92]
  );

  const opacity = useTransform(scrollYProgress,
    [0, 0.35, 0.5, 0.8, 1],
    [0, 1, 1, 0.8, 0]
  );

  const y = useTransform(scrollYProgress, [0.5, 1], ['0%', '-8%']);

  const tags = parseTags(service);
  const stickyTop = 80 + index * 20;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const hasImage = !!service.icon_url;

  // 3D tilt handler — matching Works cards
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    const rx = (yPos - rect.height / 2) / 30;
    const ry = (rect.width / 2 - x) / 30;
    cardRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    }
  }, []);

  // Mobile card — simplified without scroll effects
  if (isMobile) {
    return (
      <div
        ref={cardRef}
        onClick={onClick}
        className="group relative rounded-2xl overflow-hidden cursor-pointer"
        style={{ transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}
        data-cursor="pointer"
      >
        {/* Background */}
        <div className="relative aspect-[3/4.6] overflow-hidden">
          {hasImage ? (
            <>
              <motion.div className="relative w-full h-full" layoutId={`service-hero-${service.slug}`}>
                {isVideoUrl(service.icon_url!) ? (
                  <video
                    src={getRawMediaUrl(service.icon_url!)}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={getRawMediaUrl(service.icon_url!)}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            </>
          ) : (
            <div
              className="w-full h-full bg-dark-950"
              style={{ background: `${gradient}, linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)` }}
            >
              {/* Animated mesh elements */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-3xl animate-pulse-glow" style={{ background: accent }} />
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full blur-2xl animate-pulse-glow" style={{ background: accent, animationDelay: '1s' }} />
              </div>
              {/* Large decorative letter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[12rem] font-black font-display leading-none text-white/[0.04] select-none">
                  {service.title.charAt(0)}
                </span>
              </div>
            </div>
          )}

          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

          {/* Index number — dramatic watermark */}
          <div className="absolute top-4 right-4 z-20 text-[5rem] font-black text-white/[0.06] leading-none font-display select-none">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Tags — frosted glass */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-md rounded-full border border-white/10 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Content overlay — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-white/30" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                {String(index + 1).padStart(2, '0')} — Service
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white font-display leading-tight tracking-tight mb-3">
              {service.title}
            </h3>

            <p className="text-white/50 text-sm leading-relaxed font-light line-clamp-2 mb-4">
              {stripMarkdown(service.description)}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-5 pt-4 border-t border-white/10 mb-4">
              {getCardStats(service, index).map((stat, si) => (
                <div key={si}>
                  <span className="block text-base font-bold text-white font-display">{stat.value}</span>
                  <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Explore Service
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop — scroll-driven sticky stacking cards
  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `${stickyTop}px`, zIndex: 10 + index }}
    >
      <motion.div
        style={{ scale, opacity, y }}
        className="mx-auto max-w-6xl px-4 md:px-6 pb-6"
      >
        <div
          ref={cardRef}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group relative rounded-2xl overflow-hidden cursor-pointer"
          style={{
            transition: 'transform 0.15s ease-out, box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            boxShadow: isHovered
              ? `0 30px 80px -20px rgba(0,0,0,0.3), 0 0 40px ${accent}`
              : '0 25px 50px -12px rgba(0,0,0,0.15)',
          }}
          data-cursor="view"
          data-cursor-text="Explore"
        >
          {/* Card content — horizontal split on desktop */}
          <div className="flex flex-row min-h-[500px] lg:min-h-[560px]">

            {/* Left: Visual panel — dominant */}
            <div className="relative w-[55%] overflow-hidden">
              {hasImage ? (
                <motion.div className="relative w-full h-full" layoutId={`service-hero-${service.slug}`}>
                  {isVideoUrl(service.icon_url!) ? (
                    <video
                      src={getRawMediaUrl(service.icon_url!)}
                      autoPlay loop muted playsInline
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    />
                  ) : (
                    <img
                      src={getRawMediaUrl(service.icon_url!)}
                      alt={service.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    />
                  )}
                </motion.div>
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background: `${gradient}, linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)`,
                  }}
                >
                  {/* Animated glow orbs */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute top-1/4 left-1/3 w-48 h-48 rounded-full blur-[60px] animate-pulse-glow"
                      style={{ background: accent }}
                    />
                    <div
                      className="absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full blur-[50px] animate-pulse-glow"
                      style={{ background: accent, animationDelay: '1.5s' }}
                    />
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-30"
                      style={{ background: accent }}
                    />
                  </div>

                  {/* Large decorative letter */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[15rem] font-black font-display leading-none text-white/[0.04] select-none group-hover:text-white/[0.06] transition-all duration-700">
                      {service.title.charAt(0)}
                    </span>
                  </div>

                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                </div>
              )}

              {/* Gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 dark:to-dark-950/60 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />

              {/* Index number — dramatic watermark */}
              <div className="absolute top-6 left-8 z-20 text-[8rem] font-black text-white/[0.06] leading-none font-display select-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Tags — frosted glass pills */}
              <div className="absolute bottom-6 left-8 z-20 flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 text-[10px] font-bold text-white/90 bg-white/10 backdrop-blur-md rounded-full border border-white/15 uppercase tracking-wider group-hover:bg-white/15 group-hover:border-white/25 transition-all duration-500"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Content panel */}
            <div className="flex-1 relative bg-white dark:bg-dark-950 p-10 lg:p-14 flex flex-col justify-between">
              {/* Subtle accent glow top-right */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ background: accent }}
              />

              <div className="relative z-10">
                {/* Category label */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-8 h-[1px] bg-black/20 dark:bg-white/20 group-hover:w-12 group-hover:bg-primary-500 transition-all duration-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 dark:text-white/30 group-hover:text-primary-500 transition-colors duration-500">
                    {String(index + 1).padStart(2, '0')} — Service
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-display leading-[1] tracking-tighter text-black dark:text-white mb-6 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-500">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-base lg:text-lg text-black/50 dark:text-gray-400 leading-relaxed font-light max-w-md line-clamp-3 mb-8">
                  {stripMarkdown(service.description)}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-8 pt-6 border-t border-black/5 dark:border-white/5">
                  {getCardStats(service, index).map((stat, si) => (
                    <div key={si} className="group/stat">
                      <span className="block text-xl lg:text-2xl font-bold text-black dark:text-white font-display">
                        {stat.value}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-black/25 dark:text-white/25 font-bold">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="relative z-10 mt-10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/30 dark:text-white/30 group-hover:text-primary-500 group-hover:gap-5 transition-all duration-500">
                  Explore Service
                  <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>

                {/* Hover reveal CTA button */}
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-colors duration-300"
                    style={{
                      background: accent.replace('0.5', '1'),
                    }}
                  >
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                <div
                  className="h-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Strip video:: / image:: prefix to get actual src URL
function getRawMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('video::') || url.startsWith('image::')) return url.slice(7);
  return url;
}

// Detect video from URL or explicit prefix
function isVideoUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('video::')) return true;
  if (url.startsWith('image::')) return false;
  const lower = url.toLowerCase();
  if (/\.(mp4|webm|mov|ogg|avi)([?#]|$)/i.test(lower)) return true;
  if (lower.includes('pexels.com/download/video') || lower.includes('pexels.com/video')) return true;
  return false;
}

// Extract tags from service data
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

// Strip basic markdown for plain text preview
function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

// Generate per-service inline stats
const STAT_SETS = [
  [{ value: '50+', label: 'Projects' }, { value: '98%', label: 'Satisfaction' }, { value: '48hr', label: 'Response' }],
  [{ value: '40+', label: 'Clients' }, { value: '300%', label: 'Avg ROI' }, { value: '2wk', label: 'Turnaround' }],
  [{ value: '25+', label: 'Brands' }, { value: '4.9★', label: 'Rating' }, { value: '24hr', label: 'Support' }],
  [{ value: '60+', label: 'Delivered' }, { value: '95%', label: 'On-Time' }, { value: '5yr', label: 'Experience' }],
  [{ value: '35+', label: 'Campaigns' }, { value: '250%', label: 'Growth' }, { value: '1wk', label: 'First Draft' }],
  [{ value: '45+', label: 'Websites' }, { value: '99%', label: 'Uptime' }, { value: '3day', label: 'Deploy' }],
];

function getCardStats(service: Service, index: number): { value: string; label: string }[] {
  if (service.stats && service.stats.length > 0) {
    return service.stats.slice(0, 3);
  }
  return STAT_SETS[index % STAT_SETS.length];
}
